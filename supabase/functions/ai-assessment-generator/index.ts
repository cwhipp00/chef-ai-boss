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
    const { lessonContent, difficulty, assessmentType } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const systemPrompt = `You are an expert educational assessment designer specializing in culinary arts and restaurant management training.

Generate a comprehensive ${assessmentType || 'quiz'} based on the provided lesson content. The assessment should be at ${difficulty || 'intermediate'} level.

Requirements:
- Create 5-8 high-quality questions that test understanding and application
- Include multiple choice, scenario-based, and practical application questions
- Provide detailed explanations for correct answers
- Include realistic restaurant scenarios when applicable
- Ensure questions promote critical thinking and real-world application

Format your response as valid JSON with this structure:
{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Question text",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct": 0,
      "explanation": "Detailed explanation of why this is correct",
      "difficulty": "intermediate",
      "points": 10
    }
  ],
  "totalPoints": 80,
  "passingScore": 70,
  "timeLimit": 15
}

Lesson Content: ${lessonContent}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    let generatedContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean up JSON response
    generatedContent = generatedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const assessment = JSON.parse(generatedContent);
      return new Response(JSON.stringify(assessment), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Generated content:', generatedContent);
      
      // Fallback assessment
      const fallbackAssessment = {
        questions: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What is the most important aspect of food safety in restaurant operations?",
            options: [
              "A) Temperature control and monitoring",
              "B) Cleaning schedules",
              "C) Staff uniforms",
              "D) Menu design"
            ],
            correct: 0,
            explanation: "Temperature control is critical for preventing foodborne illness and ensuring food safety compliance.",
            difficulty: difficulty || "intermediate",
            points: 20
          }
        ],
        totalPoints: 20,
        passingScore: 70,
        timeLimit: 5
      };
      
      return new Response(JSON.stringify(fallbackAssessment), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in ai-assessment-generator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: {
        questions: [],
        totalPoints: 0,
        message: "Unable to generate assessment at this time."
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});