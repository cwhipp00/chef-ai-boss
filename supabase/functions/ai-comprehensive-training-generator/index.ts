import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action = 'generate_comprehensive_training', category, posSystem, selectedCategories } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    console.log(`Generating comprehensive training content for ${selectedCategories?.join(', ') || category || 'all categories'}, POS: ${posSystem || 'all'}`);

    if (action === 'generate_comprehensive_training') {
      const trainingCategories = [
        {
          name: 'POS System Training',
          systems: ['Toast', 'Square', 'Clover', 'Lightspeed', 'TouchBistro', 'Revel', 'Upserve', 'Aloha'],
          courses: [
            'Complete System Setup and Configuration',
            'Order Management Mastery',
            'Payment Processing Excellence', 
            'Inventory Integration',
            'Reporting and Analytics',
            'Advanced Features and Customization',
            'Troubleshooting Common Issues',
            'Staff Training and Onboarding'
          ]
        },
        {
          name: 'Food Safety & Compliance',
          certifications: ['ServSafe', 'HACCP', 'Food Handler', 'Manager Certification'],
          courses: [
            'Food Safety Fundamentals',
            'Temperature Control and Monitoring',
            'Cross-Contamination Prevention',
            'Personal Hygiene Standards',
            'Cleaning and Sanitization',
            'Foodborne Illness Prevention',
            'HACCP Implementation',
            'Health Department Compliance'
          ]
        },
        {
          name: 'Culinary Skills Development',
          levels: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
          courses: [
            'Knife Skills and Food Prep',
            'Cooking Methods and Techniques',
            'Sauce Making and Flavor Building',
            'Baking and Pastry Fundamentals',
            'Plating and Presentation',
            'Menu Development and Costing',
            'International Cuisine Techniques',
            'Advanced Culinary Arts'
          ]
        },
        {
          name: 'Restaurant Management',
          roles: ['Shift Supervisor', 'Assistant Manager', 'General Manager', 'Owner'],
          courses: [
            'Leadership and Team Building',
            'Staff Scheduling Optimization',
            'Cost Control and P&L Management',
            'Customer Service Excellence', 
            'Conflict Resolution',
            'Performance Management',
            'Marketing and Promotions',
            'Operations Management'
          ]
        },
        {
          name: 'Customer Service Excellence',
          skills: ['Communication', 'Problem Solving', 'Upselling', 'Complaint Handling'],
          courses: [
            'Guest Relations Fundamentals',
            'Effective Communication Skills',
            'Upselling and Cross-selling Techniques',
            'Handling Difficult Customers',
            'Phone and Online Ordering',
            'Creating Memorable Experiences',
            'Cultural Sensitivity Training',
            'Service Recovery Strategies'
          ]
        }
      ];

      const results = [];

      for (const category of trainingCategories) {
        for (const courseTitle of category.courses) {
          const prompt = `Create comprehensive training content for: "${courseTitle}" in the ${category.name} category.

REQUIREMENTS:
1. Find 3-5 REAL YouTube video links related to this topic (search for actual existing videos)
2. Create 8-12 detailed lessons with practical exercises
3. Include real-world scenarios and case studies
4. Add assessment questions and practical assignments
5. Provide certification criteria
6. Include downloadable resources and checklists

FORMAT YOUR RESPONSE AS VALID JSON:
{
  "course": {
    "title": "${courseTitle}",
    "description": "Detailed course description",
    "category": "${category.name}",
    "difficulty_level": "beginner|intermediate|advanced",
    "duration_hours": "estimated hours",
    "instructor_name": "Professional instructor name",
    "thumbnail_url": "https://example.com/thumb.jpg",
    "tags": ["tag1", "tag2", "tag3"],
    "certification_available": true,
    "real_video_links": [
      {
        "title": "Video Title",
        "url": "https://youtube.com/watch?v=...",
        "duration": "Duration",
        "description": "What this video covers"
      }
    ]
  },
  "lessons": [
    {
      "title": "Lesson Title",
      "description": "Lesson description",
      "duration_minutes": 30,
      "order_index": 1,
      "content": {
        "learning_objectives": ["objective1", "objective2"],
        "theory_sections": [
          {
            "heading": "Section Title",
            "content": "Detailed explanatory content",
            "key_points": ["point1", "point2"]
          }
        ],
        "practical_exercises": [
          {
            "title": "Exercise Title", 
            "instructions": "Step by step instructions",
            "materials_needed": ["item1", "item2"],
            "estimated_time": "15 minutes"
          }
        ],
        "real_world_scenarios": [
          {
            "scenario": "Real situation description",
            "challenge": "What needs to be solved",
            "solution_approach": "How to handle it"
          }
        ],
        "assessment_questions": [
          {
            "question": "Question text",
            "type": "multiple_choice|true_false|short_answer",
            "options": ["A", "B", "C", "D"],
            "correct_answer": "B",
            "explanation": "Why this is correct"
          }
        ],
        "resources": [
          {
            "title": "Resource name",
            "type": "video|pdf|checklist|template",
            "url": "https://example.com/resource",
            "description": "What this resource provides"
          }
        ]
      }
    }
  ]
}

Make this content practical, industry-standard, and immediately applicable. Include real restaurant scenarios, actual tools used, and current best practices. Focus on actionable learning that staff can implement immediately.`;

          console.log(`Generating content for: ${courseTitle}`);

          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 4000,
              }
            }),
          });

          if (!response.ok) {
            console.error(`Gemini API error for ${courseTitle}:`, response.status);
            continue;
          }

          const data = await response.json();
          const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (content) {
            try {
              // Clean and parse JSON
              let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
              const courseData = JSON.parse(cleanContent);
              
              console.log(`Successfully generated content for: ${courseTitle}`);
              
              // Insert course into database
              const { data: courseResult, error: courseError } = await supabase
                .from('courses')
                .insert({
                  title: courseData.course.title,
                  description: courseData.course.description,
                  instructor_name: courseData.course.instructor_name || 'ChefCentral AI Expert',
                  difficulty_level: courseData.course.difficulty_level || 'intermediate',
                  duration_hours: parseInt(courseData.course.duration_hours) || 8,
                  thumbnail_url: courseData.course.thumbnail_url,
                  category: courseData.course.category,
                  tags: courseData.course.tags || [],
                  is_featured: Math.random() > 0.7 // Random featured courses
                })
                .select()
                .single();

              if (courseError) {
                console.error('Error inserting course:', courseError);
                continue;
              }

              // Insert lessons
              if (courseData.lessons && courseResult) {
                const lessonsToInsert = courseData.lessons.map((lesson: any, index: number) => ({
                  course_id: courseResult.id,
                  title: lesson.title,
                  description: lesson.description,
                  order_index: lesson.order_index || index + 1,
                  duration_minutes: lesson.duration_minutes || 30,
                  content: lesson.content
                }));

                const { error: lessonsError } = await supabase
                  .from('lessons')
                  .insert(lessonsToInsert);

                if (lessonsError) {
                  console.error('Error inserting lessons:', lessonsError);
                }
              }

              results.push({
                course: courseResult,
                lessons_count: courseData.lessons?.length || 0,
                status: 'success'
              });

            } catch (parseError) {
              console.error(`JSON parse error for ${courseTitle}:`, parseError);
              results.push({
                course_title: courseTitle,
                status: 'error',
                error: 'JSON parse failed'
              });
            }
          }

          // Add delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return new Response(JSON.stringify({
        success: true,
        message: `Generated ${results.filter(r => r.status === 'success').length} courses successfully`,
        results: results,
        categories_processed: trainingCategories.map(c => c.name)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'generate_video_content') {
      // Generate additional video content and resources
      const videoPrompt = `Find and compile REAL training video resources for restaurant and POS training.

Search for actual existing YouTube channels and videos in these categories:
1. POS System Training (Toast, Square, Clover tutorials)  
2. Food Safety Training (ServSafe, HACCP content)
3. Culinary Skills (Professional cooking techniques)
4. Restaurant Management (Leadership, operations)
5. Customer Service (Hospitality training)

For each category, provide 10-15 REAL video links with:
- Exact YouTube URLs that exist
- Professional training content
- High-quality instructional videos
- Industry-recognized trainers/channels

FORMAT AS JSON with actual video data.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: videoPrompt }] }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3000,
          }
        }),
      });

      const data = await response.json();
      const videoContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      return new Response(JSON.stringify({
        success: true,
        video_content: videoContent,
        message: 'Video content research completed'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action specified');

  } catch (error) {
    console.error('Error in comprehensive training generator:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});