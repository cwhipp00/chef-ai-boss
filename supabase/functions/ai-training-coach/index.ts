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
    const { prompt, context, userId, lessonId } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const systemPrompt = `You are an expert culinary training coach specializing in restaurant operations and POS systems. 

Your role is to:
- Provide personalized guidance and explanations
- Answer questions about cooking techniques, food safety, and restaurant management
- Offer practical tips and best practices
- Assess learning progress and provide constructive feedback
- Create engaging interactive learning experiences
- Adapt explanations to the user's skill level

Context: ${context || 'General training session'}

Keep responses helpful, encouraging, and professional. Focus on practical application and real-world scenarios.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `User question: ${prompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const coachResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I cannot provide a response right now. Please try again.';

    return new Response(JSON.stringify({ 
      response: coachResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-training-coach:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});