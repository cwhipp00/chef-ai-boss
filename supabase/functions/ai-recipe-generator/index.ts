import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecipeRequest {
  ingredients: string;
  cuisineType?: string;
  dietaryRestrictions?: string[];
  servings: number;
  cookingTime: number;
  difficulty?: string;
  mealType?: string;
  equipment?: string;
  occasion?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found');
    }

    const { 
      ingredients, 
      cuisineType, 
      dietaryRestrictions, 
      servings, 
      cookingTime, 
      difficulty, 
      mealType, 
      equipment, 
      occasion 
    }: RecipeRequest = await req.json();

    const prompt = `Create a detailed recipe with the following requirements:
    
Ingredients available: ${ingredients}
${cuisineType ? `Cuisine type: ${cuisineType}` : ''}
${dietaryRestrictions?.length ? `Dietary restrictions: ${dietaryRestrictions.join(', ')}` : ''}
Servings: ${servings}
Cooking time: ${cookingTime} minutes
${difficulty ? `Difficulty: ${difficulty}` : ''}
${mealType ? `Meal type: ${mealType}` : ''}
${equipment ? `Available equipment: ${equipment}` : ''}
${occasion ? `Occasion: ${occasion}` : ''}

Please provide a complete recipe in JSON format with:
- name: creative recipe name
- description: brief appetizing description
- ingredients: detailed ingredients list with quantities
- instructions: step-by-step cooking instructions
- prepTime: preparation time in minutes
- cookTime: cooking time in minutes
- difficulty: Easy/Medium/Hard
- category: meal category
- estimatedCost: estimated cost in USD
- allergens: potential allergens
- nutritionalInfo: estimated calories, protein, carbs, fat per serving
- tips: helpful cooking tips

Ensure the recipe uses the provided ingredients creatively and follows any dietary restrictions.`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + geminiApiKey, {
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
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    let generatedText = data.candidates[0].content.parts[0].text;
    
    // Clean and parse the JSON response
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let recipe;
    try {
      recipe = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      // Fallback recipe generation
      recipe = {
        name: `${cuisineType || 'Fusion'} ${ingredients.split(',')[0]?.trim() || 'Special'} Delight`,
        description: `A delicious dish made with ${ingredients.split(',').slice(0, 2).join(' and ')}`,
        ingredients: ingredients.split(',').map(ing => `1 portion ${ing.trim()}`),
        instructions: [
          'Prepare all ingredients',
          'Cook according to your preferred method',
          'Season and serve hot'
        ],
        prepTime: Math.max(10, Math.floor(cookingTime * 0.3)),
        cookTime: cookingTime,
        difficulty: difficulty || 'Medium',
        category: mealType || 'Main Course',
        estimatedCost: 12.99,
        allergens: [],
        nutritionalInfo: {
          calories: 400,
          protein: 25,
          carbs: 35,
          fat: 15
        },
        tips: ['Taste and adjust seasoning as needed']
      };
    }

    return new Response(JSON.stringify({ recipe }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating recipe:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate recipe',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});