import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all courses without lessons
    const { data: coursesWithoutLessons, error: coursesError } = await supabase
      .from('courses')
      .select(`
        id, title, description, instructor_name, difficulty_level, 
        duration_hours, category, tags, is_featured,
        lesson_count:lessons(count)
      `);

    if (coursesError) {
      throw new Error(`Failed to fetch courses: ${coursesError.message}`);
    }

    // Filter courses that have no lessons
    const emptyLessonCourses = coursesWithoutLessons?.filter(course => 
      !course.lesson_count || course.lesson_count[0]?.count === 0
    ) || [];

    console.log(`Found ${emptyLessonCourses.length} courses without lessons`);

    const results = {
      totalProcessed: 0,
      successfullyGenerated: 0,
      errors: []
    };

    for (const course of emptyLessonCourses) {
      results.totalProcessed++;
      
      try {
        console.log(`Generating lessons for: ${course.title}`);
        
        // Generate course-specific prompt
        const prompt = generateCoursePrompt(course);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: getSystemPrompt(course.duration_hours) },
                  { text: prompt }
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
          throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        
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
          console.error('JSON parse error for course:', course.title, parseError);
          results.errors.push(`${course.title}: Failed to parse AI response`);
          continue;
        }

        if (parsedContent.lessons) {
          // Save lessons to database
          const lessonsWithCourseId = parsedContent.lessons.map((lesson: any, index: number) => ({
            ...lesson,
            course_id: course.id,
            order_index: index + 1
          }));

          const { error: lessonsError } = await supabase
            .from('lessons')
            .insert(lessonsWithCourseId);

          if (lessonsError) {
            console.error(`Error saving lessons for ${course.title}:`, lessonsError);
            results.errors.push(`${course.title}: Database error - ${lessonsError.message}`);
          } else {
            console.log(`✅ Successfully created ${lessonsWithCourseId.length} lessons for ${course.title}`);
            results.successfullyGenerated++;
          }
        }

      } catch (error) {
        console.error(`Error processing ${course.title}:`, error);
        results.errors.push(`${course.title}: ${error.message}`);
      }

      // Small delay to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify({ 
        ...results,
        message: `Processed ${results.totalProcessed} courses. Generated lessons for ${results.successfullyGenerated} courses.`,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in auto-generate-lessons function:', error);
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

function getSystemPrompt(duration: number): string {
  return `You are an expert culinary instructor and course designer. Create comprehensive restaurant training lessons.

Return a JSON object with this exact structure:
{
  "lessons": [
    {
      "title": "Lesson Title",
      "description": "Comprehensive lesson description",
      "order_index": 1,
      "duration_minutes": number,
      "content": {
        "video_url": "https://www.youtube.com/watch?v=relevant_video_id",
        "key_points": ["specific actionable point 1", "specific actionable point 2", "specific actionable point 3"],
        "practical_tips": ["practical tip 1", "practical tip 2"],
        "recipes": [
          {
            "name": "Recipe Name",
            "ingredients": ["ingredient1 with measurements", "ingredient2 with measurements"],
            "instructions": ["detailed step 1", "detailed step 2", "detailed step 3"]
          }
        ],
        "practical_exercise": "Detailed hands-on exercise with specific steps and expected outcomes",
        "transcript": "Full detailed lesson transcript with step-by-step explanations, industry best practices, and real-world examples. Should be 500-800 words per lesson.",
        "resources": [
          {
            "title": "Resource Title",
            "url": "https://example.com/resource",
            "type": "pdf"
          }
        ],
        "quiz": [
          {
            "question": "Specific, practical question related to the lesson?",
            "options": ["correct detailed answer", "plausible wrong answer 1", "plausible wrong answer 2", "plausible wrong answer 3"],
            "correct": 0
          },
          {
            "question": "Another practical question?",
            "options": ["wrong answer 1", "correct detailed answer", "wrong answer 2", "wrong answer 3"],
            "correct": 1
          }
        ]
      }
    }
  ]
}

Create ${Math.ceil(duration * 1.5)} comprehensive lessons (approximately ${Math.round(duration * 60 / Math.ceil(duration * 1.5))} minutes each). 
Make content practical, engaging, industry-relevant, and immediately applicable in restaurant operations.
Include real YouTube video IDs when possible, comprehensive quizzes, and detailed exercises.`;
}

function generateCoursePrompt(course: any): string {
  const basePrompts: { [key: string]: string } = {
    'Toast Platform Fundamentals': 'Create comprehensive lessons covering Toast ecosystem overview, basic POS operations, menu setup, hardware configuration, user management, reporting, and order processing. Include tutorials for restaurant setup, menu creation, and payment processing.',
    
    'Toast Advanced Analytics & Growth': 'Create lessons on restaurant analytics dashboards, financial reporting, customer insights, marketing automation, growth metrics, ROI analysis, data visualization, and growth strategies. Include exercises for dashboard setup and customer segmentation.',
    
    'Toast Menu Engineering & Optimization': 'Create lessons on menu design principles, profitability analysis, cost calculation, modifier pricing, dynamic pricing, menu psychology, seasonal planning, A/B testing, and revenue optimization. Include profitability analysis exercises.',
    
    'Toast Kitchen Display Systems': 'Create lessons on KDS setup, order flow management, kitchen optimization, prep time tracking, order prioritization, staff communication, and troubleshooting. Include hands-on KDS configuration exercises.',
    
    'Toast Kitchen Display Systems Expert': 'Create advanced lessons on complex KDS configuration, advanced order management, efficiency metrics, workflow optimization, and system integration. Include performance analytics exercises.',
    
    'Toast Payment Processing': 'Create lessons on payment fundamentals, tip management, payment setup, transaction reporting, chargeback management, security compliance, and troubleshooting. Include payment configuration exercises.',
    
    'Toast Online Ordering & Delivery': 'Create lessons on online ordering setup, menu optimization for digital, delivery management, third-party integrations, order fulfillment, and performance optimization. Include platform integration exercises.',
    
    'Toast Marketing & Customer Engagement': 'Create lessons on marketing suite overview, email campaigns, loyalty programs, customer segmentation, automated workflows, engagement strategies, and performance tracking. Include campaign creation exercises.',
    
    'Toast Multi-Location & Franchise Management': 'Create lessons on multi-location setup, centralized reporting, brand consistency, franchise tools, performance comparison, menu management, and scaling strategies. Include multi-location configuration exercises.',
    
    'Toast Integration & Third-Party Apps': 'Create lessons on app marketplace, popular integrations, API basics, data synchronization, setup configuration, troubleshooting, and custom solutions. Include integration setup exercises.',
    
    'Toast Capital & Financial Services': 'Create lessons on financing options, cash advances, equipment financing, application processes, financial planning, cash flow management, and growth strategies. Include financial planning exercises.',
    
    'Toast Inventory Management': 'Create lessons on inventory tracking, stock monitoring, reorder points, vendor management, cost tracking, waste reduction, recipe costing, and optimization. Include inventory system setup exercises.',
    
    'Toast Hardware & Terminal Management': 'Create lessons on hardware components, terminal installation, network configuration, printer setup, payment devices, maintenance, and troubleshooting. Include hardware installation exercises.',
    
    'Toast Security & Compliance': 'Create lessons on PCI compliance, data security, user permissions, audit trails, breach prevention, compliance reporting, and incident response. Include security configuration exercises.',
    
    'Toast Mobile Solutions': 'Create lessons on Toast Go setup, mobile ordering, staff apps, remote management, mobile payments, offline functionality, and optimization. Include mobile configuration exercises.',
    
    'Toast Advanced Reporting & Business Intelligence': 'Create lessons on custom reports, data visualization, business intelligence dashboards, trend analysis, forecasting, KPI tracking, and insights generation. Include report building exercises.',
    
    'Toast Gift Cards & Promotions': 'Create lessons on gift card setup, promotional campaigns, discount management, loyalty integration, automated promotions, and performance tracking. Include promotional campaign exercises.',
    
    'Toast Customer Data & CRM': 'Create lessons on customer profiles, data collection, segmentation, behavior analysis, retention strategies, personalized marketing, and privacy compliance. Include customer segmentation exercises.',
    
    'Toast for Quick Service Restaurants': 'Create lessons on QSR optimization, speed techniques, drive-thru management, mobile ordering for QSR, kitchen efficiency, order accuracy, and peak management. Include QSR workflow exercises.',
    
    'Toast for Bars & Nightlife': 'Create lessons on bar POS features, cocktail management, complex modifiers, age verification, tab management, bottle service, and event management. Include bar setup exercises.',
    
    'Toast Troubleshooting & System Maintenance': 'Create lessons on system diagnostics, preventive maintenance, performance optimization, backup recovery, monitoring, escalation procedures, and emergency response. Include troubleshooting exercises.'
  };

  const specificPrompt = basePrompts[course.title] || `Create comprehensive lessons for ${course.title}. ${course.description}`;
  
  return `${specificPrompt}

Course Details:
- Title: ${course.title}
- Instructor: ${course.instructor_name}
- Duration: ${course.duration_hours} hours
- Difficulty: ${course.difficulty_level}
- Category: ${course.category}
- Tags: ${course.tags?.join(', ') || 'N/A'}

Create industry-standard, practical content with real-world applications, step-by-step tutorials, and comprehensive assessments. Ensure all content is immediately applicable in restaurant operations.`;
}