import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, contentType, difficulty, duration, existingContent } = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    let systemPrompt = '';
    
    if (contentType === 'course') {
      systemPrompt = `You are an expert culinary instructor and course designer. Create a comprehensive restaurant training course based on the user's prompt.

Return a JSON object with this exact structure:
{
  "course": {
    "title": "Course Title",
    "description": "Detailed course description",
    "category": "culinary-arts | pos-systems | safety-compliance | management",
    "difficulty_level": "beginner | intermediate | advanced",
    "duration_hours": number,
    "instructor_name": "AI Chef Instructor",
    "tags": ["tag1", "tag2", "tag3"],
    "is_featured": false
  },
  "lessons": [
    {
      "title": "Lesson Title",
      "description": "Lesson description",
      "order_index": 1,
      "duration_minutes": number,
      "content": {
        "video_url": "https://www.youtube.com/watch?v=example",
        "key_points": ["point1", "point2", "point3"],
        "practical_tips": ["tip1", "tip2"],
        "recipes": [
          {
            "name": "Recipe Name",
            "ingredients": ["ingredient1", "ingredient2"],
            "instructions": ["step1", "step2"]
          }
        ],
        "practical_exercise": "Exercise description",
        "transcript": "Full lesson transcript...",
        "resources": [
          {
            "title": "Resource Title",
            "url": "https://example.com",
            "type": "pdf | video | article"
          }
        ],
        "quiz": [
          {
            "question": "Question text?",
            "options": ["option1", "option2", "option3", "option4"],
            "correct": 0
          }
        ]
      }
    }
  ]
}

Create ${duration} hours of content with appropriate lessons. Make it practical, engaging, and industry-relevant.`;
    } else if (contentType === 'lesson') {
      systemPrompt = `You are an expert culinary instructor. Create a detailed lesson based on the user's prompt.

Return a JSON object with this exact structure:
{
  "lesson": {
    "title": "Lesson Title",
    "description": "Lesson description",
    "duration_minutes": number,
    "content": {
      "video_url": "https://www.youtube.com/watch?v=example",
      "key_points": ["point1", "point2", "point3"],
      "practical_tips": ["tip1", "tip2"],
      "recipes": [
        {
          "name": "Recipe Name",
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"]
        }
      ],
      "practical_exercise": "Exercise description",
      "transcript": "Full lesson transcript...",
      "resources": [
        {
          "title": "Resource Title",
          "url": "https://example.com",
          "type": "pdf | video | article"
        }
      ],
      "quiz": [
        {
          "question": "Question text?",
          "options": ["option1", "option2", "option3", "option4"],
          "correct": 0
        }
      ]
    }
  }
}

Make it practical, detailed, and engaging for restaurant staff.`;
    }

    const userPrompt = `${prompt}

${difficulty ? `Difficulty level: ${difficulty}` : ''}
${duration ? `Duration: ${duration} hours` : ''}
${existingContent ? `Existing content to reference: ${JSON.stringify(existingContent)}` : ''}

Create professional, practical content suitable for restaurant training. Include real YouTube videos when possible, practical exercises, and comprehensive quizzes.`;

    console.log('Making request to Gemini API...');
    
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
              { text: userPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedContent = data.candidates[0].content.parts[0].text;
    
    // Clean and parse the JSON response
    let cleanedContent = generatedContent.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.slice(7);
    }
    if (cleanedContent.endsWith('```')) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Content that failed to parse:', cleanedContent);
      throw new Error('Failed to parse AI response as JSON');
    }

    return new Response(
      JSON.stringify({ 
        content: parsedContent,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-course-creator function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});