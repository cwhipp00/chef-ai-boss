import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ParseRequest {
  content: string;
  fileName: string;
  fileType: string;
}

interface ParsedRecipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  allergens: string[];
  cost?: number;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { content, fileName, fileType }: ParseRequest = await req.json();

    console.log(`Processing file: ${fileName} (${fileType})`);

    // Construct a detailed prompt for Gemini
    const prompt = `
You are an expert culinary AI assistant. Analyze the following document content and extract recipe information. 
The document is: "${fileName}" (${fileType})

Document Content:
${content}

Please extract and format recipe information as a JSON object with this exact structure:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description of the dish",
      "ingredients": ["ingredient 1", "ingredient 2", ...],
      "instructions": ["step 1", "step 2", ...],
      "servings": 4,
      "prepTime": 15,
      "cookTime": 30,
      "difficulty": "Easy|Medium|Hard",
      "category": "Main Course|Appetizer|Dessert|etc",
      "allergens": ["Gluten", "Dairy", etc],
      "cost": 12.50,
      "nutritionalInfo": {
        "calories": 420,
        "protein": 25,
        "carbs": 35,
        "fat": 15
      },
      "tags": ["quick", "healthy", etc]
    }
  ]
}

Rules:
1. Extract ALL recipes found in the document
2. If the document contains ingredient lists without instructions, create logical cooking steps
3. If measurements are unclear, provide reasonable estimates
4. Always include realistic prep/cook times and cost estimates
5. Identify common allergens based on ingredients
6. Categorize recipes appropriately
7. If it's a spreadsheet with multiple recipes, extract each one
8. For CSV files, treat each row as potential recipe data
9. If no recipes are found, return an empty recipes array
10. Be creative but accurate with recipe names and descriptions

Respond ONLY with valid JSON, no other text.
`;

    // Call Gemini API
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
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Gemini response:', generatedText);

    // Parse the JSON response from Gemini
    let parsedResult;
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        parsedResult = JSON.parse(generatedText);
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback if JSON parsing fails
      parsedResult = generateFallbackRecipe(fileName, content);
    }

    // Ensure we have a valid structure
    if (!parsedResult.recipes || !Array.isArray(parsedResult.recipes)) {
      parsedResult = generateFallbackRecipe(fileName, content);
    }

    console.log(`Successfully parsed ${parsedResult.recipes.length} recipe(s)`);

    return new Response(JSON.stringify({
      success: true,
      recipes: parsedResult.recipes,
      count: parsedResult.recipes.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in recipe parser:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to parse recipe',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateFallbackRecipe(fileName: string, content: string): { recipes: ParsedRecipe[] } {
  console.log('Generating fallback recipe for:', fileName);
  
  // Extract potential ingredients from content
  const words = content.toLowerCase().split(/\s+/);
  const commonIngredients = [
    'flour', 'sugar', 'salt', 'pepper', 'oil', 'butter', 'eggs', 'milk', 'water',
    'onion', 'garlic', 'tomato', 'chicken', 'beef', 'fish', 'rice', 'pasta'
  ];
  
  const foundIngredients = commonIngredients.filter(ingredient => 
    words.some(word => word.includes(ingredient))
  );

  const fallbackRecipe: ParsedRecipe = {
    name: `Recipe from ${fileName.replace(/\.[^/.]+$/, "")}`,
    description: `A recipe extracted from ${fileName}`,
    ingredients: foundIngredients.length > 0 
      ? foundIngredients.map(ing => `1 cup ${ing}`)
      : ["2 cups main ingredient", "1 tsp salt", "2 tbsp oil", "1 cup water"],
    instructions: [
      "Prepare all ingredients",
      "Heat oil in a large pan",
      "Add ingredients and cook until done",
      "Season with salt and pepper",
      "Serve hot"
    ],
    servings: 4,
    prepTime: 15,
    cookTime: 30,
    difficulty: 'Medium',
    category: 'Main Course',
    allergens: [],
    cost: 12.00,
    nutritionalInfo: {
      calories: 350,
      protein: 20,
      carbs: 30,
      fat: 12
    },
    tags: ['extracted']
  };

  return { recipes: [fallbackRecipe] };
}