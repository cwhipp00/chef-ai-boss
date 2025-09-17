import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DrinkRecommendation {
  name: string;
  type: string;
  description: string;
  ingredients: string[];
  pairingReason: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { foodItem, customerPreferences, occasion } = await req.json();

    if (!foodItem) {
      return new Response(
        JSON.stringify({ error: 'Food item is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY') || Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not found');
    }

    // Construct the prompt for drink pairing recommendations
    const prompt = `As an expert sommelier and mixologist, provide 3-5 drink pairing recommendations for the following:

Food Item: ${foodItem}
Customer Preferences: ${customerPreferences || 'None specified'}
Occasion: ${occasion || 'Casual dining'}

For each recommendation, provide:
1. Drink name
2. Type (wine, cocktail, beer, non-alcoholic, etc.)
3. Brief description (2-3 sentences)
4. Key ingredients list
5. Explanation of why it pairs well with the food
6. Difficulty level (Easy/Medium/Hard to prepare)

Consider flavor profiles, acidity, sweetness, temperature contrasts, and traditional pairings. Include both alcoholic and non-alcoholic options when appropriate.

Respond in valid JSON format with this structure:
{
  "recommendations": [
    {
      "name": "string",
      "type": "string",
      "description": "string",
      "ingredients": ["string"],
      "pairingReason": "string",
      "difficulty": "Easy|Medium|Hard"
    }
  ]
}`;

    console.log('Calling Gemini API for drink pairing recommendations');

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
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    let generatedText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response - remove markdown formatting
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let recommendations: DrinkRecommendation[];
    
    try {
      const parsed = JSON.parse(generatedText);
      recommendations = parsed.recommendations || [];
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedText);
      
      // Fallback recommendations
      recommendations = [
        {
          name: "House White Wine",
          type: "Wine",
          description: "A crisp, refreshing white wine that complements most dishes with its balanced acidity and light body.",
          ingredients: ["White wine grapes", "Natural sulfites"],
          pairingReason: "White wines typically pair well with a wide variety of foods due to their acidity and lighter flavor profile.",
          difficulty: "Easy"
        },
        {
          name: "Sparkling Water with Lemon",
          type: "Non-alcoholic",
          description: "Fresh sparkling water with a twist of lemon for cleansing the palate.",
          ingredients: ["Sparkling water", "Fresh lemon"],
          pairingReason: "The effervescence and citrus help cleanse the palate between bites.",
          difficulty: "Easy"
        }
      ];
    }

    // Validate and ensure each recommendation has required fields
    recommendations = recommendations.map(rec => ({
      name: rec.name || "Classic Pairing",
      type: rec.type || "Wine",
      description: rec.description || "A classic pairing option.",
      ingredients: Array.isArray(rec.ingredients) ? rec.ingredients : ["Main ingredient"],
      pairingReason: rec.pairingReason || "Complements the dish well.",
      difficulty: ['Easy', 'Medium', 'Hard'].includes(rec.difficulty) ? rec.difficulty : 'Easy'
    }));

    return new Response(
      JSON.stringify({ 
        recommendations,
        foodItem,
        customerPreferences,
        occasion 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in ai-drink-pairing function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate drink recommendations',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});