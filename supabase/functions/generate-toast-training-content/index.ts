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
  const prompt = `Create an EXTENSIVE and COMPREHENSIVE training course for: "${courseName}". 

  Generate exactly 8-12 detailed training modules with the following enhanced structure:
  - Each module should be 35-50 minutes long with substantial content
  - Include 4-8 sections per module with extensive detail
  - Each section should have 8-15 bullet points of actionable information
  - Include multiple quizzes per module (2-4 questions per section)
  - Focus on real-world Toast POS system features with deep technical detail
  - Include specific workflows, troubleshooting, and advanced scenarios
  - Provide step-by-step procedures with extensive explanations
  - Add practical exercises and real-world case studies

  CRITICAL REQUIREMENTS:
  - Each section must contain AT LEAST 10-20 detailed bullet points
  - Include advanced topics, edge cases, and troubleshooting scenarios
  - Add detailed workflows with numbered steps
  - Include best practices, common mistakes, and expert tips
  - Provide comprehensive coverage of all Toast POS features
  - Add integration scenarios with third-party systems
  - Include compliance, security, and operational excellence topics

  Return JSON format:
  {
    "modules": [
      {
        "title": "Comprehensive Module Title",
        "description": "Detailed description covering multiple aspects and learning outcomes",
        "duration": 45,
        "order": 1,
        "content": {
          "type": "interactive_lesson",
          "sections": [
            {
              "title": "Detailed Section Title",
              "content": "EXTENSIVE content with:\n\n• Comprehensive overview paragraph\n\n**Key Concepts:**\n• Bullet point 1 with detailed explanation\n• Bullet point 2 with specific procedures\n• Bullet point 3 with troubleshooting steps\n• [Continue with 10-20 detailed bullet points]\n\n**Advanced Workflows:**\n• Step-by-step procedure 1\n• Step-by-step procedure 2\n• [Multiple detailed workflows]\n\n**Best Practices:**\n• Expert tip 1 with reasoning\n• Expert tip 2 with examples\n• [Multiple best practices]\n\n**Common Issues & Solutions:**\n• Problem 1 and detailed solution\n• Problem 2 and troubleshooting steps\n• [Multiple scenarios]\n\n**Integration Points:**\n• Third-party system integration details\n• API considerations\n• Data flow explanations",
              "media": [],
              "quiz": [
                {
                  "question": "Detailed technical question about the topic?",
                  "options": ["Comprehensive option 1", "Detailed option 2", "Technical option 3", "Advanced option 4"],
                  "correct": 1
                },
                {
                  "question": "Scenario-based question with real-world application?",
                  "options": ["Practical solution 1", "Alternative approach 2", "Best practice 3", "Troubleshooting step 4"],
                  "correct": 2
                }
              ]
            }
          ]
        }
      }
    ]
  }

  COMPREHENSIVE TOAST POS TOPICS TO COVER:
  
  **Core System Mastery:**
  - Complete Toast POS interface navigation and customization
  - Advanced menu engineering and pricing strategies
  - Complex order management and modification workflows
  - Multi-location management and synchronization
  - Advanced user permissions and role-based access control
  
  **Operational Excellence:**
  - Kitchen Display System optimization and workflow management
  - Advanced inventory management and cost control
  - Labor management and scheduling optimization
  - Customer relationship management and loyalty programs
  - Advanced reporting and business intelligence
  
  **Technical Integration:**
  - Third-party delivery platform integrations (DoorDash, Uber Eats, Grubhub)
  - Payment processing and PCI compliance
  - API integrations and data export/import
  - Hardware troubleshooting and maintenance
  - Network configuration and security protocols
  
  **Advanced Features:**
  - Toast Capital and financial services integration
  - Advanced analytics and predictive insights
  - Marketing automation and customer engagement
  - Franchise and multi-location management
  - Custom reporting and dashboard creation
  
  **Compliance & Security:**
  - Food safety compliance tracking
  - Financial reporting and tax management
  - Data security and privacy protection
  - Audit trail management and compliance reporting
  - Staff training and certification tracking

  Make this the most comprehensive, detailed, and practical Toast POS training course available with extensive bullet points, detailed procedures, and real-world applications.`;

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