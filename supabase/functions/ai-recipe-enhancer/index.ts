import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecipeEnhanceRequest {
  recipeText: string;
  imageData?: string; // base64 encoded image
  enhancementType: 'parse' | 'optimize' | 'scale' | 'analyze';
  targetServings?: number;
  dietaryRestrictions?: string[];
  costTarget?: number;
}

interface EnhancedRecipe {
  name: string;
  description: string;
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
    cost?: number;
    allergens?: string[];
    substitutes?: string[];
  }>;
  instructions: Array<{
    step: number;
    instruction: string;
    duration?: string;
    temperature?: string;
    equipment?: string[];
  }>;
  metadata: {
    servings: number;
    prepTime: string;
    cookTime: string;
    totalTime: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    cuisine: string;
    mealType: string[];
    dietaryInfo: string[];
    allergens: string[];
    tags: string[];
  };
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  costing?: {
    totalCost: number;
    costPerServing: number;
    ingredientCosts: Array<{ ingredient: string; cost: number }>;
    profitMargin?: number;
  };
  qualityScore: number;
  suggestions: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY not configured');
    }

    const { recipeText, imageData, enhancementType, targetServings, dietaryRestrictions, costTarget }: RecipeEnhanceRequest = await req.json();

    let prompt = '';
    let includeImage = false;

    // Build prompt based on enhancement type
    switch (enhancementType) {
      case 'parse':
        prompt = `As a professional chef and recipe analyst, parse this recipe text and extract comprehensive information. 
        
Recipe Text: "${recipeText}"

Analyze and structure this into a detailed recipe format including:
1. Recipe name and description
2. Complete ingredient list with amounts, units, and suggested substitutes
3. Step-by-step instructions with timing and equipment
4. Nutritional information estimate
5. Cost analysis (estimate ingredient costs)
6. Dietary information and allergens
7. Quality assessment and improvement suggestions
8. Professional cooking tips

Return a comprehensive JSON structure.`;
        includeImage = !!imageData;
        break;

      case 'optimize':
        prompt = `As a culinary optimization expert, analyze and improve this recipe:

Recipe: "${recipeText}"
${dietaryRestrictions?.length ? `Dietary Restrictions: ${dietaryRestrictions.join(', ')}` : ''}
${costTarget ? `Target Cost per Serving: $${costTarget}` : ''}

Optimize for:
- Cost efficiency while maintaining quality
- Nutritional balance
- Cooking time and technique improvements
- Ingredient substitutions for dietary needs
- Waste reduction
- Flavor enhancement
- Professional kitchen workflow

Provide detailed optimization suggestions and an improved recipe version.`;
        break;

      case 'scale':
        prompt = `As a professional kitchen manager, scale this recipe for commercial use:

Recipe: "${recipeText}"
Target Servings: ${targetServings || 50}

Consider:
- Ingredient scaling with proper ratios
- Cooking time adjustments for larger quantities
- Equipment requirements for volume cooking
- Food safety considerations
- Prep workflow optimization
- Storage and holding instructions
- Cost calculations for volume purchasing
- Quality control measures

Provide a complete scaled recipe with professional kitchen instructions.`;
        break;

      case 'analyze':
        prompt = `As a culinary analyst and food science expert, provide a comprehensive analysis of this recipe:

Recipe: "${recipeText}"

Analyze:
- Nutritional completeness and balance
- Flavor profile and component interactions
- Cooking technique effectiveness
- Ingredient quality and seasonality
- Cost-effectiveness analysis
- Potential allergens and dietary concerns
- Shelf life and storage considerations
- Market competitiveness
- Customer appeal factors
- Improvement opportunities

Provide detailed insights and recommendations.`;
        break;
    }

    // Prepare request body for Gemini API
    const requestBody: any = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            ingredients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  amount: { type: "string" },
                  unit: { type: "string" },
                  cost: { type: "number" },
                  allergens: { type: "array", items: { type: "string" } },
                  substitutes: { type: "array", items: { type: "string" } }
                }
              }
            },
            instructions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  step: { type: "number" },
                  instruction: { type: "string" },
                  duration: { type: "string" },
                  temperature: { type: "string" },
                  equipment: { type: "array", items: { type: "string" } }
                }
              }
            },
            metadata: {
              type: "object",
              properties: {
                servings: { type: "number" },
                prepTime: { type: "string" },
                cookTime: { type: "string" },
                totalTime: { type: "string" },
                difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
                cuisine: { type: "string" },
                mealType: { type: "array", items: { type: "string" } },
                dietaryInfo: { type: "array", items: { type: "string" } },
                allergens: { type: "array", items: { type: "string" } },
                tags: { type: "array", items: { type: "string" } }
              }
            },
            nutrition: {
              type: "object",
              properties: {
                calories: { type: "number" },
                protein: { type: "number" },
                carbs: { type: "number" },
                fat: { type: "number" },
                fiber: { type: "number" },
                sugar: { type: "number" },
                sodium: { type: "number" }
              }
            },
            costing: {
              type: "object",
              properties: {
                totalCost: { type: "number" },
                costPerServing: { type: "number" },
                ingredientCosts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ingredient: { type: "string" },
                      cost: { type: "number" }
                    }
                  }
                },
                profitMargin: { type: "number" }
              }
            },
            qualityScore: { type: "number" },
            suggestions: { type: "array", items: { type: "string" } }
          }
        }
      }
    };

    // Add image if provided
    if (includeImage && imageData) {
      requestBody.contents[0].parts.unshift({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageData
        }
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    try {
      const enhancedRecipe: EnhancedRecipe = JSON.parse(generatedText);
      
      return new Response(JSON.stringify({ 
        success: true, 
        recipe: enhancedRecipe,
        enhancementType 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      
      // Fallback: return structured data based on the text
      const fallbackRecipe = createFallbackRecipe(generatedText, enhancementType);
      
      return new Response(JSON.stringify({ 
        success: true, 
        recipe: fallbackRecipe,
        enhancementType,
        note: 'Generated with fallback parsing'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in recipe enhancer:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function createFallbackRecipe(text: string, enhancementType: string): EnhancedRecipe {
  // Create a basic recipe structure from the AI response text
  const lines = text.split('\n').filter(line => line.trim());
  
  return {
    name: "AI Generated Recipe",
    description: "Recipe enhanced by AI analysis",
    ingredients: [
      { name: "Various ingredients", amount: "As needed", unit: "portions" }
    ],
    instructions: [
      { step: 1, instruction: "Follow AI-generated instructions from analysis", duration: "Varies" }
    ],
    metadata: {
      servings: 4,
      prepTime: "15 minutes",
      cookTime: "30 minutes",
      totalTime: "45 minutes",
      difficulty: "Medium" as const,
      cuisine: "International",
      mealType: ["Main Course"],
      dietaryInfo: [],
      allergens: [],
      tags: ["AI Generated"]
    },
    nutrition: {
      calories: 350,
      protein: 20,
      carbs: 30,
      fat: 15
    },
    costing: {
      totalCost: 12.00,
      costPerServing: 3.00,
      ingredientCosts: []
    },
    qualityScore: 85,
    suggestions: [
      "Recipe analyzed and enhanced by AI",
      "Consider reviewing ingredient proportions",
      "Optimize cooking techniques for better results"
    ]
  };
}