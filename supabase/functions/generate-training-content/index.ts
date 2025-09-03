import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  console.log('Generate training content function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { courseId, userId } = requestBody;
    
    console.log(`Generating training content for course ${courseId} by user ${userId}`);

    if (!courseId) {
      throw new Error('Course ID is required');
    }

    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment');
      throw new Error('OpenAI API key not configured');
    }

    // Get course details
    console.log('Fetching course details...');
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      console.error('Course fetch error:', courseError);
      throw new Error(`Course not found: ${courseError?.message}`);
    }

    console.log('Course found:', course.title);

    // Check if course already has lessons
    const { data: existingLessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title')
      .eq('course_id', courseId);

    if (lessonsError) {
      console.error('Lessons check error:', lessonsError);
      throw new Error(`Error checking lessons: ${lessonsError.message}`);
    }

    if (existingLessons && existingLessons.length > 0) {
      console.log(`Course ${courseId} already has ${existingLessons.length} lessons`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Course already has content',
          lessonsCount: existingLessons.length,
          lessons: existingLessons
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('No existing lessons found. Generating comprehensive training content...');

    // Generate training content using OpenAI
    const prompt = `You are an expert curriculum designer and trainer. Create a comprehensive training course for "${course.title}".

Course Details:
- Category: ${course.category}
- Description: ${course.description}
- Difficulty: ${course.difficulty_level}
- Duration: ${course.duration_hours} hours
- Instructor: ${course.instructor_name}

Create 6-8 progressive lessons that provide complete training from beginner to proficient level. Each lesson must include:

1. Clear learning objectives
2. Theoretical content explaining concepts
3. Practical tips for real-world application
4. Step-by-step instructions
5. Common mistakes to avoid
6. Practice exercises
7. Knowledge assessment questions

IMPORTANT: Return ONLY valid JSON in this exact structure (no markdown, no code blocks):

{
  "lessons": [
    {
      "title": "Lesson 1: Foundation and Setup",
      "description": "Learn the fundamentals and get started",
      "duration_minutes": 45,
      "order_index": 1,
      "content": {
        "learning_objectives": [
          "Understand core concepts",
          "Complete basic setup",
          "Navigate the interface"
        ],
        "key_points": [
          "First key concept explained clearly",
          "Second important point with details",
          "Third essential takeaway"
        ],
        "theory": "Detailed explanation of the theoretical foundations, concepts, and principles. This should be comprehensive and educational, covering why things work the way they do.",
        "practical_tips": [
          "Tip 1: Specific actionable advice",
          "Tip 2: Best practice recommendation",
          "Tip 3: Expert technique"
        ],
        "step_by_step": [
          "Step 1: First action to take",
          "Step 2: Next specific step",
          "Step 3: Follow-up action"
        ],
        "common_mistakes": [
          "Mistake 1: What beginners often do wrong",
          "Mistake 2: Another pitfall to avoid"
        ],
        "practical_exercise": "Hands-on exercise: Create/practice/demonstrate something specific. Be detailed about what the learner should do.",
        "quiz": [
          {
            "question": "What is the most important first step?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct": 1,
            "explanation": "Option B is correct because..."
          },
          {
            "question": "Which technique is most effective?",
            "options": ["Technique A", "Technique B", "Technique C", "Technique D"],
            "correct": 0,
            "explanation": "Technique A works best because..."
          }
        ],
        "resources": [
          "Official documentation link",
          "Helpful tutorial reference",
          "Additional reading material"
        ]
      }
    }
  ]
}`;

    console.log('Sending request to OpenAI...');
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert training content creator. Create comprehensive, practical training lessons. Return only valid JSON without any markdown formatting or code blocks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API Error:', openaiResponse.status, errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`);
    }

    const openaiData = await openaiResponse.json();
    console.log('OpenAI response received, processing...');

    if (!openaiData.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', openaiData);
      throw new Error('Invalid response from OpenAI API');
    }

    const generatedText = openaiData.choices[0].message.content;
    console.log('Generated text length:', generatedText.length);
    
    // Parse the JSON response
    let lessonsData;
    try {
      // Clean up any potential markdown formatting
      let cleanText = generatedText.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/, '').replace(/\n?```$/, '');
      }
      
      lessonsData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse generated JSON:', parseError);
      console.error('Generated text preview:', generatedText.substring(0, 1000));
      throw new Error('Failed to parse generated lesson content');
    }

    if (!lessonsData.lessons || !Array.isArray(lessonsData.lessons)) {
      console.error('Invalid lesson data structure:', lessonsData);
      throw new Error('Invalid lesson data structure from OpenAI');
    }

    console.log(`Generated ${lessonsData.lessons.length} lessons, inserting into database...`);

    // Insert lessons into database
    const lessonsToInsert = lessonsData.lessons.map((lesson: any, index: number) => ({
      course_id: courseId,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      duration_minutes: lesson.duration_minutes || 45,
      order_index: lesson.order_index || (index + 1),
    }));

    const { data: insertedLessons, error: insertError } = await supabase
      .from('lessons')
      .insert(lessonsToInsert)
      .select();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to save lessons: ${insertError.message}`);
    }

    console.log(`Successfully inserted ${insertedLessons.length} lessons for course ${courseId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Training content generated successfully',
        lessonsGenerated: insertedLessons.length,
        lessons: insertedLessons
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-training-content function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});