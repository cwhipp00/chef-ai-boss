import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  console.log('Generate course content function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { courseId, userId } = requestBody;
    
    console.log(`Generating content for course ${courseId} enrolled by user ${userId}`);

    if (!courseId) {
      throw new Error('Course ID is required');
    }

    if (!geminiApiKey) {
      console.error('Gemini API key not found in environment');
      throw new Error('Gemini API key not configured');
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
      .select('id')
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
          lessonsCount: existingLessons.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('No existing lessons found. Generating new lessons with Gemini AI...');

    // Generate comprehensive course content using Gemini
    const prompt = `Create a comprehensive training course for "${course.title}" in the ${course.category} category.

Course Description: ${course.description}
Difficulty Level: ${course.difficulty_level}
Target Duration: ${course.duration_hours} hours
Instructor: ${course.instructor_name}

Generate exactly 6-10 detailed lessons that cover all aspects of this course. Each lesson should include:

1. **Lesson Title**: Clear, descriptive title
2. **Description**: Brief overview of what students will learn
3. **Duration**: Estimated time in minutes (should total to approximately ${course.duration_hours * 60} minutes across all lessons)
4. **Learning Objectives**: 3-5 specific, measurable objectives
5. **Content Sections**: Detailed content broken into sections

Make the content professional, engaging, and practical. Focus on real-world application and hands-on learning. Ensure progressive difficulty from lesson to lesson.

Return the response as a JSON object with this exact structure:
{
  "lessons": [
    {
      "title": "Lesson Title",
      "description": "Lesson description",
      "duration_minutes": 45,
      "order_index": 1,
      "content": {
        "learning_objectives": ["Objective 1", "Objective 2", "Objective 3"],
        "theory": "Detailed theory content here...",
        "practical_steps": ["Step 1", "Step 2", "Step 3"],
        "key_points": ["Point 1", "Point 2"],
        "resources": ["Resource 1", "Resource 2"]
      }
    }
  ]
}`;

    console.log('Sending request to Gemini API...');
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
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
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API Error:', geminiResponse.status, errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response received, processing...');

    if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid Gemini response structure:', geminiData);
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = geminiData.candidates[0].content.parts[0].text;
    console.log('Generated text length:', generatedText.length);
    
    // Extract JSON from the response (remove any markdown formatting)
    let jsonText = generatedText;
    if (generatedText.includes('```json')) {
      jsonText = generatedText.split('```json')[1].split('```')[0];
    } else if (generatedText.includes('```')) {
      jsonText = generatedText.split('```')[1].split('```')[0];
    }

    let lessonsData;
    try {
      lessonsData = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error('Failed to parse generated JSON:', parseError);
      console.error('Generated text preview:', generatedText.substring(0, 500));
      throw new Error('Failed to parse generated lesson content');
    }

    if (!lessonsData.lessons || !Array.isArray(lessonsData.lessons)) {
      console.error('Invalid lesson data structure:', lessonsData);
      throw new Error('Invalid lesson data structure from Gemini');
    }

    console.log(`Generated ${lessonsData.lessons.length} lessons, inserting into database...`);

    // Insert lessons into database
    const lessonsToInsert = lessonsData.lessons.map((lesson: any, index: number) => ({
      course_id: courseId,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      duration_minutes: lesson.duration_minutes || 30,
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
        message: 'Course content generated successfully',
        lessonsGenerated: insertedLessons.length,
        lessons: insertedLessons
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-course-content function:', error);
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