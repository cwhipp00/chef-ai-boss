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
    const { userProfile, completedCourses, performanceData, goals } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const systemPrompt = `You are an expert learning path designer for culinary and restaurant management education.

Analyze the user's profile and create a personalized learning path with specific course recommendations.

User Profile:
- Experience Level: ${userProfile?.experience || 'beginner'}
- Role: ${userProfile?.role || 'general staff'}
- Interests: ${userProfile?.interests?.join(', ') || 'general restaurant operations'}
- Goals: ${goals || 'improve overall restaurant skills'}

Completed Courses: ${completedCourses?.length || 0} courses
Performance Data: Average score ${performanceData?.averageScore || 'N/A'}%

Generate a personalized learning path with:
1. Immediate next steps (1-2 courses)
2. Short-term goals (3-6 months)
3. Long-term objectives (6-12 months)
4. Skill gap analysis
5. Career progression recommendations

Format as JSON:
{
  "personalizedMessage": "Welcome message tailored to user",
  "skillGaps": ["skill1", "skill2"],
  "immediatePath": [
    {
      "courseTitle": "Course Name",
      "priority": "high|medium|low",
      "reason": "Why this course is recommended",
      "estimatedDuration": "X hours",
      "skillsGained": ["skill1", "skill2"]
    }
  ],
  "shortTermGoals": [...],
  "longTermGoals": [...],
  "careerProgression": {
    "currentLevel": "Current role/level",
    "nextLevel": "Suggested next role",
    "requiredSkills": ["skill1", "skill2"],
    "timeframe": "X months"
  }
}`;

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
          temperature: 0.7,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 1536,
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
    
    generatedContent = generatedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const learningPath = JSON.parse(generatedContent);
      return new Response(JSON.stringify(learningPath), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      
      // Fallback learning path
      const fallbackPath = {
        personalizedMessage: "Welcome to your personalized learning journey! Based on your profile, we've created a custom path to help you excel in restaurant operations.",
        skillGaps: ["Food Safety Compliance", "POS System Mastery", "Team Leadership"],
        immediatePath: [
          {
            courseTitle: "Food Safety Fundamentals",
            priority: "high",
            reason: "Essential foundation for all restaurant operations",
            estimatedDuration: "3 hours",
            skillsGained: ["HACCP Knowledge", "Temperature Control", "Sanitation Procedures"]
          }
        ],
        shortTermGoals: [
          {
            courseTitle: "POS System Training",
            priority: "medium",
            reason: "Master technology essential for daily operations",
            estimatedDuration: "4 hours",
            skillsGained: ["Payment Processing", "Inventory Management", "Customer Service"]
          }
        ],
        longTermGoals: [
          {
            courseTitle: "Restaurant Management Excellence",
            priority: "medium",
            reason: "Develop leadership and operational management skills",
            estimatedDuration: "8 hours",
            skillsGained: ["Team Leadership", "Cost Control", "Strategic Planning"]
          }
        ],
        careerProgression: {
          currentLevel: "Staff Member",
          nextLevel: "Shift Supervisor",
          requiredSkills: ["Leadership", "Food Safety Certification", "POS Proficiency"],
          timeframe: "6-9 months"
        }
      };
      
      return new Response(JSON.stringify(fallbackPath), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in ai-learning-path:', error);
    return new Response(JSON.stringify({ 
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});