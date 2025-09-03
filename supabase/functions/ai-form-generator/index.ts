import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FormGenerationRequest {
  prompt: string;
  organizationId: string;
  category?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { prompt, organizationId, category }: FormGenerationRequest = await req.json();

    // Generate form using Gemini
    const systemPrompt = `You are an expert form designer. Create a dynamic form based on the user's description. 

Return ONLY a valid JSON object with this exact structure:
{
  "name": "Form Name",
  "category": "category_name", 
  "form_schema": {
    "title": "Form Title",
    "description": "Form description",
    "fields": [
      {
        "name": "field_name",
        "type": "text|number|select|checkbox|textarea|date",
        "label": "Field Label",
        "required": true|false,
        "placeholder": "placeholder text",
        "options": ["option1", "option2"] // only for select type
      }
    ]
  }
}

Make the form practical and professional. Include relevant validation and field types.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `Create a form for: ${prompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract valid JSON from AI response');
    }

    const formData = JSON.parse(jsonMatch[0]);
    
    // Set category from request or generated
    if (category) {
      formData.category = category;
    }

    // Save to database
    const { data: savedForm, error } = await supabase
      .from('dynamic_forms')
      .insert({
        name: formData.name,
        category: formData.category,
        form_schema: formData.form_schema,
        organization_id: organizationId,
        ai_generated: true
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save form to database');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      form: savedForm,
      message: `Successfully created "${formData.name}" form`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-form-generator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});