import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { category, action } = await req.json();
    
    if (action === 'generate_comprehensive_training') {
      // Define comprehensive training categories with real-world focus
      const trainingCategories = {
        'pos-training': {
          name: 'POS System Training',
          courses: [
            { title: 'Toast POS Complete Training', focus: 'Toast system operations, payment processing, menu management' },
            { title: 'Square POS Mastery', focus: 'Square Register, inventory, customer management' },
            { title: 'Clover POS Fundamentals', focus: 'Clover Station setup, reporting, staff management' },
            { title: 'Aloha POS Operations', focus: 'NCR Aloha system, kitchen management, reporting' },
            { title: 'TouchBistro Training', focus: 'iPad POS system, table management, analytics' }
          ]
        },
        'food-safety': {
          name: 'Food Safety & Compliance',
          courses: [
            { title: 'ServSafe Manager Certification', focus: 'Food safety principles, HACCP, certification prep' },
            { title: 'HACCP Implementation', focus: 'Critical control points, monitoring procedures, documentation' },
            { title: 'Allergen Management', focus: 'Food allergies, cross-contamination prevention, labeling' },
            { title: 'Sanitation Procedures', focus: 'Cleaning protocols, sanitizing, equipment maintenance' },
            { title: 'Temperature Control', focus: 'Cold chain management, cooking temperatures, storage' }
          ]
        },
        'culinary-skills': {
          name: 'Culinary Arts & Techniques',
          courses: [
            { title: 'Knife Skills Mastery', focus: 'Proper cutting techniques, knife maintenance, safety' },
            { title: 'Cooking Methods & Techniques', focus: 'Sautéing, grilling, roasting, braising fundamentals' },
            { title: 'Sauce Making Fundamentals', focus: 'Mother sauces, emulsification, flavor development' },
            { title: 'Baking & Pastry Basics', focus: 'Bread making, pastry techniques, dessert preparation' },
            { title: 'Plating & Presentation', focus: 'Visual appeal, garnishing, portion control' }
          ]
        },
        'management': {
          name: 'Restaurant Management',
          courses: [
            { title: 'Leadership in Hospitality', focus: 'Team management, communication, conflict resolution' },
            { title: 'Cost Control & Profitability', focus: 'Food costing, labor management, profit optimization' },
            { title: 'Inventory Management', focus: 'Stock control, ordering systems, waste reduction' },
            { title: 'Staff Scheduling', focus: 'Labor optimization, shift planning, coverage management' },
            { title: 'Customer Service Excellence', focus: 'Service standards, complaint handling, guest satisfaction' }
          ]
        },
        'customer-service': {
          name: 'Customer Service & Hospitality',
          courses: [
            { title: 'Professional Service Standards', focus: 'Greeting guests, order taking, service flow' },
            { title: 'Wine & Beverage Service', focus: 'Wine knowledge, proper service, upselling techniques' },
            { title: 'Handling Difficult Situations', focus: 'Complaint resolution, de-escalation, recovery' },
            { title: 'Upselling & Revenue Growth', focus: 'Suggestive selling, menu knowledge, sales techniques' },
            { title: 'Table Service Excellence', focus: 'Fine dining service, etiquette, timing' }
          ]
        }
      };

      // Enhanced web search and content generation for each category
      const selectedCategory = trainingCategories[category] || trainingCategories['pos-training'];
      
      for (const courseTemplate of selectedCategory.courses) {
        // Use Gemini to generate comprehensive, accurate course content
        const prompt = `Create a comprehensive restaurant industry training course for "${courseTemplate.title}".

REQUIREMENTS:
- Create 8-12 detailed lessons with practical, actionable content
- Each lesson should be 15-30 minutes long
- Include real-world scenarios and examples
- Add practical exercises and assessments
- Focus on: ${courseTemplate.focus}
- Make content suitable for restaurant professionals
- Include industry best practices and current standards

FORMAT AS VALID JSON:
{
  "course": {
    "title": "${courseTemplate.title}",
    "description": "Detailed course description",
    "category": "${category}",
    "difficulty_level": "beginner/intermediate/advanced",
    "duration_hours": number,
    "instructor_name": "Industry Professional Name",
    "tags": ["relevant", "tags"],
    "is_featured": true/false
  },
  "lessons": [
    {
      "title": "Lesson title",
      "content": "Comprehensive lesson content with practical information",
      "duration_minutes": number,
      "lesson_order": number,
      "video_url": "https://www.youtube.com/watch?v=relevant_video_id",
      "resources": ["resource1", "resource2"],
      "quiz_questions": [
        {
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correct_answer": "A"
        }
      ]
    }
  ]
}

Make all content professional, accurate, and immediately applicable in restaurant operations.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 4000,
            }
          }),
        });

        const data = await response.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (content) {
          try {
            // Clean the JSON response
            const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const courseData = JSON.parse(cleanedContent);

            // Insert course into database
            const { data: courseResult, error: courseError } = await supabase
              .from('courses')
              .insert([courseData.course])
              .select()
              .single();

            if (courseError) {
              console.error('Course insert error:', courseError);
              continue;
            }

            // Insert lessons
            if (courseData.lessons && courseResult) {
              const lessonsWithCourseId = courseData.lessons.map(lesson => ({
                ...lesson,
                course_id: courseResult.id
              }));

              const { error: lessonsError } = await supabase
                .from('lessons')
                .insert(lessonsWithCourseId);

              if (lessonsError) {
                console.error('Lessons insert error:', lessonsError);
              }
            }
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Content:', content);
          }
        }

        // Add delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      return new Response(JSON.stringify({
        success: true,
        message: `Generated ${selectedCategory.courses.length} courses for ${selectedCategory.name}`,
        category: selectedCategory.name
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'search_real_videos') {
      // Generate web search queries for real training videos
      const searchPrompt = `Generate comprehensive web search queries to find REAL restaurant training videos on YouTube and training platforms.

Categories to search:
1. POS System Training (Toast, Square, Clover tutorials)
2. Food Safety Training (ServSafe, HACCP, health department)
3. Culinary Skills (knife skills, cooking techniques, professional chef training)
4. Restaurant Management (leadership, operations, staff training)
5. Customer Service (hospitality training, service standards)

For each category, provide:
- 5-10 specific search queries that would find legitimate training videos
- Focus on professional, educational content
- Include channel names and video types
- Target industry-standard training providers

FORMAT AS JSON with search strategies.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: searchPrompt }] }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2000,
          }
        }),
      });

      const data = await response.json();
      const searchStrategies = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      return new Response(JSON.stringify({
        success: true,
        search_strategies: searchStrategies,
        message: 'Video search strategies generated'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action specified');

  } catch (error) {
    console.error('Error in web training content generator:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});