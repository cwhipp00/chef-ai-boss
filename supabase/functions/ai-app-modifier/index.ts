import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AppModificationRequest {
  request: string;
  context?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { request, context }: AppModificationRequest = await req.json();

    const systemPrompt = `You are an AI assistant for a restaurant management app. The app has these main features:
- Dashboard with stats and quick actions
- Staff scheduling and management
- Inventory tracking (bar inventory, store lists)
- Recipe management and prep lists  
- Order management
- Forms and checklists
- Calendar and reminders
- Training modules
- Communications and video calls
- Document management
- Customer management
- Finance dashboard
- HACCP compliance
- Table management and reservations

When users ask to add or modify features, provide helpful suggestions and instructions. Be specific about:
1. What component/page would need to be created or modified
2. What database tables might be needed
3. Step-by-step guidance for implementation
4. Best practices for restaurant operations

Keep responses practical and actionable. Focus on restaurant-specific needs.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: context ? `Context: ${context}\n\nUser Request: ${request}` : `User Request: ${request}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const suggestion = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ 
      success: true, 
      suggestion,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-app-modifier:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});