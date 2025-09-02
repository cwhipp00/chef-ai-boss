import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentAnalysis {
  category: string;
  confidence: number;
  extractedData: any;
  suggestedFields: any[];
  formSchema: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { documentContent, fileName, organizationId, userId } = await req.json();

    if (!documentContent || !organizationId || !userId) {
      throw new Error('Missing required fields');
    }

    console.log('Processing document:', fileName, 'for organization:', organizationId);

    // Call Gemini AI to analyze the document
    const analysis = await analyzeDocumentWithGemini(documentContent, fileName);
    
    // Store the parsed document in database
    const { data: parsedDoc, error: insertError } = await supabaseClient
      .from('parsed_documents')
      .insert({
        organization_id: organizationId,
        parsed_data: analysis.extractedData,
        confidence_score: analysis.confidence,
        status: 'completed',
        target_category: analysis.category,
        created_by: userId
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Create dynamic form if confidence is high enough
    if (analysis.confidence > 0.7) {
      const { error: formError } = await supabaseClient
        .from('dynamic_forms')
        .insert({
          organization_id: organizationId,
          name: `Auto-generated form from ${fileName}`,
          category: analysis.category,
          form_schema: analysis.formSchema,
          generated_from_document: parsedDoc.id,
          created_by: userId
        });

      if (formError) {
        console.error('Error creating form:', formError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      analysis,
      parsedDocumentId: parsedDoc.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in parse-document-ai:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeDocumentWithGemini(content: string, fileName: string): Promise<DocumentAnalysis> {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const prompt = `
Analyze this restaurant document and extract structured information. Determine the document category and extract relevant data.

Document Name: ${fileName}
Document Content: ${content}

Categories to consider:
- checklist: Daily/weekly operational checklists
- recipe: Recipe cards, cooking instructions
- inventory: Inventory lists, stock counts
- training: Training materials, procedures
- menu: Menu items, pricing
- policy: Policies, procedures, guidelines
- supplier: Vendor information, orders
- schedule: Staff schedules, shifts

Provide your response as a JSON object with:
{
  "category": "detected_category",
  "confidence": 0.0-1.0,
  "extractedData": {
    // Structured data based on category
  },
  "suggestedFields": [
    // Array of field objects for form generation
  ],
  "formSchema": {
    // JSON schema for dynamic form generation
    "title": "Form Title",
    "fields": [
      {
        "name": "field_name",
        "type": "text|number|select|checkbox|textarea",
        "label": "Field Label",
        "required": true|false,
        "options": [] // for select fields
      }
    ]
  }
}

Focus on extracting actionable, structured information that can be used to generate forms and workflows.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Gemini API response:', result);

    if (!result.candidates || !result.candidates[0]?.content?.parts[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const aiResponse = result.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response
    let jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Fallback: try to find JSON block
      jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonMatch[0] = jsonMatch[1];
      }
    }

    if (!jsonMatch) {
      throw new Error('Could not extract JSON from AI response');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    // Validate and set defaults
    return {
      category: analysis.category || 'general',
      confidence: Math.min(Math.max(analysis.confidence || 0.5, 0), 1),
      extractedData: analysis.extractedData || {},
      suggestedFields: analysis.suggestedFields || [],
      formSchema: analysis.formSchema || {
        title: `Form for ${fileName}`,
        fields: []
      }
    };

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Fallback analysis based on filename and basic content analysis
    return generateFallbackAnalysis(content, fileName);
  }
}

function generateFallbackAnalysis(content: string, fileName: string): DocumentAnalysis {
  const lowerContent = content.toLowerCase();
  const lowerFileName = fileName.toLowerCase();
  
  let category = 'general';
  let confidence = 0.6;
  
  // Simple category detection based on keywords
  if (lowerFileName.includes('recipe') || lowerContent.includes('ingredients') || lowerContent.includes('cooking')) {
    category = 'recipe';
    confidence = 0.8;
  } else if (lowerFileName.includes('checklist') || lowerContent.includes('checklist') || lowerContent.includes('□') || lowerContent.includes('☐')) {
    category = 'checklist';
    confidence = 0.8;
  } else if (lowerFileName.includes('inventory') || lowerContent.includes('inventory') || lowerContent.includes('stock')) {
    category = 'inventory';
    confidence = 0.7;
  } else if (lowerFileName.includes('menu') || lowerContent.includes('price') || lowerContent.includes('$')) {
    category = 'menu';
    confidence = 0.7;
  } else if (lowerFileName.includes('training') || lowerContent.includes('training') || lowerContent.includes('procedure')) {
    category = 'training';
    confidence = 0.7;
  }

  return {
    category,
    confidence,
    extractedData: {
      rawContent: content,
      detectedCategory: category,
      fileName: fileName
    },
    suggestedFields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'description', type: 'textarea', label: 'Description', required: false }
    ],
    formSchema: {
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Form`,
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'description', type: 'textarea', label: 'Description', required: false }
      ]
    }
  };
}