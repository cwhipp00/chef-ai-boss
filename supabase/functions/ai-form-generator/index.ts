import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface GeneratedForm {
  title: string;
  description: string;
  fields: FormField[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName, fileType, fileContent, organizationId } = await req.json();

    if (!fileName || !fileContent) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Processing file: ${fileName} for organization: ${organizationId}`);

    // Parse file content based on type
    let parsedContent = '';
    
    try {
      // Decode base64 content
      const binaryContent = atob(fileContent);
      
      // For CSV files, we can parse directly
      if (fileName.toLowerCase().endsWith('.csv')) {
        parsedContent = binaryContent;
      } 
      // For JSON files
      else if (fileName.toLowerCase().endsWith('.json')) {
        parsedContent = binaryContent;
      }
      // For text files
      else if (fileName.toLowerCase().endsWith('.txt')) {
        parsedContent = binaryContent;
      }
      // For other file types, we'll use a simplified extraction
      else {
        // For complex documents (PDF, Word, Excel), we'll use a fallback approach
        // In production, you might want to use a document parsing service
        parsedContent = `Document content from ${fileName}. This is a ${fileType} file that contains structured data that can be converted into a form.`;
      }
    } catch (error) {
      console.error('Error parsing file content:', error);
      parsedContent = `Content extracted from ${fileName}`;
    }

    // Use Gemini AI to analyze content and generate form
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const prompt = `
You are an expert form creator. Analyze the following document content and create an interactive form structure based on the data patterns, headers, and information you find.

Document: ${fileName}
Content: ${parsedContent.substring(0, 3000)}

Please create a comprehensive form that captures the key data elements from this document. Return a JSON object with this exact structure:

{
  "title": "Generated Form Title",
  "description": "Brief description of what this form captures",
  "fields": [
    {
      "id": "unique_field_id",
      "type": "text|email|number|select|checkbox|textarea|date|radio",
      "label": "Field Label",
      "placeholder": "Optional placeholder text",
      "required": true|false,
      "options": ["option1", "option2"] // only for select/radio types
    }
  ]
}

Guidelines:
1. Create 5-15 relevant fields based on the document content
2. Use appropriate field types (text, email, number, select, etc.)
3. Make important fields required
4. For select/radio fields, provide 3-5 realistic options
5. Use clear, professional labels
6. The form should be practical and usable for data collection
7. If the document contains tabular data, create fields for each column
8. If it's a questionnaire or survey, convert questions to form fields
9. If it's a spreadsheet, use headers as field labels

Return ONLY the JSON object, no additional text or formatting.
`;

    console.log('Calling Gemini AI for form generation...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('Raw Gemini response:', JSON.stringify(aiResponse, null, 2));

    if (!aiResponse.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from AI');
    }

    let generatedText = aiResponse.candidates[0].content.parts[0].text.trim();
    
    // Clean up the response - remove any markdown formatting
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('Cleaned AI response:', generatedText);

    // Parse the JSON response
    let generatedForm: GeneratedForm;
    try {
      generatedForm = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw text that failed to parse:', generatedText);
      
      // Fallback form if parsing fails
      generatedForm = {
        title: `Form from ${fileName}`,
        description: `This form was generated from the uploaded document: ${fileName}`,
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Name',
            placeholder: 'Enter your name',
            required: true
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'Enter your email',
            required: true
          },
          {
            id: 'feedback',
            type: 'textarea',
            label: 'Feedback or Comments',
            placeholder: 'Please provide your feedback',
            required: false
          }
        ]
      };
    }

    // Validate the generated form structure
    if (!generatedForm.title || !generatedForm.fields || !Array.isArray(generatedForm.fields)) {
      throw new Error('Invalid form structure generated by AI');
    }

    // Ensure all fields have required properties
    generatedForm.fields = generatedForm.fields.map((field, index) => ({
      id: field.id || `field_${index + 1}`,
      type: field.type || 'text',
      label: field.label || `Field ${index + 1}`,
      placeholder: field.placeholder || '',
      required: field.required !== undefined ? field.required : false,
      options: field.options || undefined
    }));

    console.log('Successfully generated form:', generatedForm.title);

    return new Response(
      JSON.stringify({
        success: true,
        form: generatedForm,
        metadata: {
          sourceFile: fileName,
          fieldsCount: generatedForm.fields.length,
          organizationId
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-form-generator function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});