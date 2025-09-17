import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ToastTrainingModule {
  title: string;
  description: string;
  content: any;
  duration: number;
  order: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseId, courseName } = await req.json();
    
    console.log(`Generating training content for course: ${courseName}`);

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Generate training modules using Gemini AI
    const trainingModules = await generateTrainingModulesWithAI(courseName);
    
    // Insert lessons into the database
    const lessons = [];
    for (let i = 0; i < trainingModules.length; i++) {
      const module = trainingModules[i];
      
      const { data: lesson, error } = await supabase
        .from('lessons')
        .insert({
          course_id: courseId,
          title: module.title,
          description: module.description,
          content: module.content,
          order_index: module.order,
          duration_minutes: module.duration
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting lesson:', error);
        continue;
      }

      lessons.push(lesson);
    }

    console.log(`Generated ${lessons.length} lessons for ${courseName}`);

    return new Response(JSON.stringify({ 
      success: true, 
      lessonsGenerated: lessons.length,
      lessons: lessons 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating training content:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate training content',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateTrainingModulesWithAI(courseName: string): Promise<ToastTrainingModule[]> {
  const prompt = `Create comprehensive training content for a restaurant course: "${courseName}". 

  Generate exactly 4-6 detailed training modules with the following structure:
  - Each module should be 15-25 minutes long
  - Include interactive content with sections, quizzes, and practical examples
  - Focus on real-world Toast POS system features and restaurant operations
  - Include specific steps, best practices, and common scenarios
  - Make content actionable and practical for restaurant staff

  Return JSON format:
  {
    "modules": [
      {
        "title": "Module Title",
        "description": "Brief description of what this module covers",
        "duration": 20,
        "order": 1,
        "content": {
          "type": "interactive_lesson",
          "sections": [
            {
              "title": "Section Title",
              "content": "Detailed content with bullet points, steps, and practical information",
              "media": [],
              "quiz": [
                {
                  "question": "Quiz question?",
                  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                  "correct": 1
                }
              ]
            }
          ]
        }
      }
    ]
  }

  Focus on these Toast POS topics based on the course name:
  - Toast POS system navigation and features
  - Order management and payment processing  
  - Kitchen display system and order workflow
  - Menu management and item setup
  - Customer service best practices
  - Analytics and reporting features
  - Staff management and permissions
  - Integration with delivery platforms
  - Inventory tracking and management
  - Security and compliance

  Make the content comprehensive, practical, and specific to Toast POS system functionality.`;

  try {
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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response and parse JSON
    const cleanedResponse = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsedData = JSON.parse(cleanedResponse);
    
    if (!parsedData.modules || !Array.isArray(parsedData.modules)) {
      throw new Error('Invalid response format from Gemini API');
    }

    return parsedData.modules.map((module: any, index: number) => ({
      title: module.title,
      description: module.description,
      content: module.content,
      duration: module.duration || 20,
      order: index + 1
    }));

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback to basic content if AI fails
    return generateFallbackContent(courseName);
  }
}

function generateFallbackContent(courseName: string): ToastTrainingModule[] {
  return [
    {
      title: `${courseName} - Getting Started`,
      description: "Introduction to the fundamentals and basic operations",
      duration: 20,
      order: 1,
      content: {
        type: "interactive_lesson",
        sections: [
          {
            title: "Overview",
            content: `This lesson covers the essential concepts and operations for ${courseName}.

Key topics include:
• System navigation and interface
• Basic operations and workflows
• Best practices and tips
• Common troubleshooting

Let's get started with the fundamentals.`,
            media: [],
            quiz: [
              {
                question: "What is the first step in getting started?",
                options: ["Learn the interface", "Set up account", "Take an order", "Call support"],
                correct: 0
              }
            ]
          }
        ]
      }
    },
    {
      title: `${courseName} - Advanced Features`,
      description: "Deep dive into advanced functionality and optimization",
      duration: 25,
      order: 2,
      content: {
        type: "interactive_lesson",
        sections: [
          {
            title: "Advanced Operations",
            content: `This lesson explores advanced features and optimization techniques.

Topics covered:
• Advanced system features
• Optimization strategies
• Integration capabilities
• Performance monitoring
• Reporting and analytics

Master these concepts to maximize efficiency.`,
            media: [],
            quiz: [
              {
                question: "What is key to system optimization?",
                options: ["Speed", "Training", "Both speed and training", "Hardware"],
                correct: 2
              }
            ]
          }
        ]
      }
    }
  ];
}