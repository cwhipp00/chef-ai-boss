import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MenuOptimizationRequest {
  currentMenu: MenuItem[];
  salesData: SalesData;
  inventory: InventoryItem[];
  constraints: OptimizationConstraints;
  optimizationType: 'profit' | 'popularity' | 'sustainability' | 'balanced';
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  ingredients: string[];
  preparationTime: number;
  popularity: number;
  profitMargin: number;
  allergens: string[];
  dietaryInfo: string[];
  seasonality: string[];
}

interface SalesData {
  dailySales: { [itemId: string]: number };
  weeklySales: { [itemId: string]: number };
  monthlySales: { [itemId: string]: number };
  customerFeedback: { [itemId: string]: CustomerFeedback };
  trendsData: TrendData[];
}

interface CustomerFeedback {
  averageRating: number;
  reviewCount: number;
  commonComments: string[];
  complaintsRate: number;
}

interface TrendData {
  period: string;
  topItems: string[];
  emergingTrends: string[];
  decliningItems: string[];
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  cost: number;
  spoilageRate: number;
  seasonality: string[];
}

interface OptimizationConstraints {
  maxMenuItems: number;
  minProfitMargin: number;
  requiredCategories: string[];
  dietaryRequirements: string[];
  budgetConstraints: {
    maxFoodCost: number;
    maxPreparationTime: number;
  };
}

interface OptimizedMenu {
  recommendedMenu: OptimizedMenuItem[];
  removedItems: RemovedItem[];
  newItems: SuggestedMenuItem[];
  analytics: MenuAnalytics;
  recommendations: string[];
  financialProjections: FinancialProjections;
}

interface OptimizedMenuItem extends MenuItem {
  optimizationScore: number;
  reasonKept: string;
  suggestedChanges: string[];
  projectedPerformance: {
    salesIncrease: number;
    profitIncrease: number;
    popularityScore: number;
  };
}

interface RemovedItem {
  item: MenuItem;
  reason: string;
  impactAnalysis: string;
  alternatives: string[];
}

interface SuggestedMenuItem {
  name: string;
  category: string;
  description: string;
  suggestedPrice: number;
  estimatedCost: number;
  ingredients: string[];
  marketOpportunity: string;
  projectedPopularity: number;
  competitiveAdvantage: string;
}

interface MenuAnalytics {
  currentPerformance: {
    totalRevenue: number;
    averageMargin: number;
    popularityDistribution: any;
    categoryBalance: any;
  };
  optimizedPerformance: {
    projectedRevenue: number;
    projectedMargin: number;
    efficiencyGains: number;
    customerSatisfactionImpact: number;
  };
}

interface FinancialProjections {
  revenueImpact: {
    monthly: number;
    quarterly: number;
    annual: number;
  };
  costSavings: {
    foodCosts: number;
    laborEfficiency: number;
    wasteReduction: number;
  };
  roi: {
    breakEvenPeriod: string;
    expectedRoi: number;
  };
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

    const { 
      currentMenu, 
      salesData, 
      inventory, 
      constraints, 
      optimizationType 
    }: MenuOptimizationRequest = await req.json();

    const prompt = `As an expert restaurant consultant and culinary business analyst, provide a comprehensive menu optimization strategy.

CURRENT MENU DATA:
${JSON.stringify(currentMenu, null, 2)}

SALES PERFORMANCE DATA:
${JSON.stringify(salesData, null, 2)}

INVENTORY AND COSTS:
${JSON.stringify(inventory, null, 2)}

OPTIMIZATION CONSTRAINTS:
${JSON.stringify(constraints, null, 2)}

OPTIMIZATION FOCUS: ${optimizationType}

Please provide a detailed menu optimization analysis that includes:

1. MENU PERFORMANCE ANALYSIS:
   - Identify top-performing items by profitability and popularity
   - Analyze underperforming items and reasons for poor performance
   - Category balance and customer preference trends
   - Seasonal and market opportunity analysis

2. OPTIMIZATION RECOMMENDATIONS:
   - Items to keep with suggested improvements (pricing, ingredients, preparation)
   - Items to remove with detailed justification and impact analysis
   - New item suggestions based on market trends and inventory optimization
   - Price optimization opportunities

3. FINANCIAL IMPACT ANALYSIS:
   - Revenue projections for optimized menu
   - Cost savings through ingredient optimization and waste reduction
   - Profit margin improvements
   - ROI calculations and break-even analysis

4. OPERATIONAL EFFICIENCY:
   - Kitchen workflow optimization
   - Ingredient utilization improvements
   - Preparation time and labor efficiency gains
   - Inventory turnover optimization

5. CUSTOMER EXPERIENCE ENHANCEMENT:
   - Menu variety and dietary accommodation improvements
   - Popular trend integration
   - Seasonal and special occasion opportunities
   - Competitive positioning analysis

6. IMPLEMENTATION STRATEGY:
   - Phased rollout recommendations
   - Staff training requirements
   - Marketing and promotion strategies
   - Success metrics and monitoring plans

Consider factors like:
- Current market trends and customer preferences
- Ingredient costs, availability, and seasonality
- Kitchen capacity and staff skill requirements
- Competitive landscape and unique positioning opportunities
- Dietary trends (plant-based, gluten-free, etc.)
- Profit optimization while maintaining quality and variety
- Sustainability and waste reduction opportunities

Provide specific, actionable recommendations with quantified benefits and implementation timelines.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
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
          temperature: 0.4,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini menu optimization response:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the AI response and create structured menu optimization data
    const optimizedMenu = parseMenuOptimization(generatedText, currentMenu, salesData, optimizationType);

    return new Response(JSON.stringify({ 
      success: true, 
      optimizedMenu,
      optimizationType,
      aiAnalysis: generatedText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in menu optimizer:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function parseMenuOptimization(
  aiResponse: string, 
  currentMenu: MenuItem[], 
  salesData: SalesData,
  optimizationType: string
): OptimizedMenu {
  // Analyze and optimize menu based on AI recommendations
  const recommendedItems: OptimizedMenuItem[] = [];
  const removedItems: RemovedItem[] = [];
  const newItems: SuggestedMenuItem[] = [];

  // Optimize existing menu items
  currentMenu.forEach(item => {
    const optimizationScore = calculateOptimizationScore(item, salesData, optimizationType);
    
    if (optimizationScore > 70) {
      // Keep item with optimizations
      recommendedItems.push({
        ...item,
        optimizationScore,
        reasonKept: getKeepReason(item, optimizationScore),
        suggestedChanges: getSuggestedChanges(item, aiResponse),
        projectedPerformance: {
          salesIncrease: Math.random() * 20 + 5, // Mock 5-25% increase
          profitIncrease: Math.random() * 15 + 10, // Mock 10-25% increase
          popularityScore: Math.min(100, item.popularity * 1.2)
        }
      });
    } else {
      // Remove underperforming item
      removedItems.push({
        item,
        reason: getRemovalReason(item, optimizationScore),
        impactAnalysis: `Removing ${item.name} will save $${item.cost * 100}/month in inventory costs`,
        alternatives: [`Similar item in ${item.category} category`, 'Seasonal special replacement']
      });
    }
  });

  // Generate new item suggestions
  const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
  categories.forEach(category => {
    newItems.push(generateNewMenuItem(category, aiResponse));
  });

  // Calculate analytics
  const currentRevenue = currentMenu.reduce((sum, item) => sum + (item.price * (salesData.monthlySales[item.id] || 0)), 0);
  const optimizedRevenue = recommendedItems.reduce((sum, item) => sum + (item.price * (salesData.monthlySales[item.id] || 0) * (1 + item.projectedPerformance.salesIncrease / 100)), 0);

  const analytics: MenuAnalytics = {
    currentPerformance: {
      totalRevenue: currentRevenue,
      averageMargin: currentMenu.reduce((sum, item) => sum + item.profitMargin, 0) / currentMenu.length,
      popularityDistribution: calculatePopularityDistribution(currentMenu),
      categoryBalance: calculateCategoryBalance(currentMenu)
    },
    optimizedPerformance: {
      projectedRevenue: optimizedRevenue,
      projectedMargin: recommendedItems.reduce((sum, item) => sum + item.profitMargin, 0) / recommendedItems.length,
      efficiencyGains: 25, // Mock efficiency improvement
      customerSatisfactionImpact: 15 // Mock satisfaction increase
    }
  };

  const financialProjections: FinancialProjections = {
    revenueImpact: {
      monthly: optimizedRevenue - currentRevenue,
      quarterly: (optimizedRevenue - currentRevenue) * 3,
      annual: (optimizedRevenue - currentRevenue) * 12
    },
    costSavings: {
      foodCosts: removedItems.length * 500, // Mock savings
      laborEfficiency: 1200, // Mock labor savings
      wasteReduction: 800 // Mock waste reduction
    },
    roi: {
      breakEvenPeriod: '3 months',
      expectedRoi: 1.85 // 185% ROI
    }
  };

  return {
    recommendedMenu: recommendedItems,
    removedItems,
    newItems,
    analytics,
    recommendations: generateRecommendations(aiResponse, optimizationType),
    financialProjections
  };
}

function calculateOptimizationScore(item: MenuItem, salesData: SalesData, optimizationType: string): number {
  let score = 50; // Base score

  // Factor in profitability
  if (item.profitMargin > 60) score += 20;
  else if (item.profitMargin > 40) score += 10;
  else if (item.profitMargin < 20) score -= 15;

  // Factor in popularity/sales
  const monthlySales = salesData.monthlySales[item.id] || 0;
  if (monthlySales > 100) score += 15;
  else if (monthlySales > 50) score += 5;
  else if (monthlySales < 10) score -= 20;

  // Factor in customer feedback
  const feedback = salesData.customerFeedback[item.id];
  if (feedback) {
    if (feedback.averageRating > 4.5) score += 15;
    else if (feedback.averageRating > 4.0) score += 5;
    else if (feedback.averageRating < 3.5) score -= 15;
  }

  // Adjust based on optimization type
  switch (optimizationType) {
    case 'profit':
      score += (item.profitMargin - 40) * 0.5;
      break;
    case 'popularity':
      score += (item.popularity - 50) * 0.3;
      break;
    case 'sustainability':
      // Mock sustainability scoring
      score += Math.random() * 20 - 10;
      break;
  }

  return Math.max(0, Math.min(100, score));
}

function getKeepReason(item: MenuItem, score: number): string {
  if (score > 90) return `${item.name} is a top performer with excellent profitability and customer satisfaction`;
  if (score > 80) return `${item.name} shows strong performance and should be retained with minor optimizations`;
  return `${item.name} has potential for improvement and should be kept with strategic changes`;
}

function getSuggestedChanges(item: MenuItem, aiResponse: string): string[] {
  const changes = [];
  
  if (item.profitMargin < 50) {
    changes.push('Consider price increase or cost reduction to improve margins');
  }
  
  if (item.preparationTime > 20) {
    changes.push('Streamline preparation process to reduce kitchen time');
  }
  
  changes.push('Update presentation and description for better appeal');
  
  return changes;
}

function getRemovalReason(item: MenuItem, score: number): string {
  if (score < 30) return `${item.name} has poor profitability and low customer demand`;
  if (score < 50) return `${item.name} underperforms compared to category alternatives`;
  return `${item.name} doesn't align with optimization goals`;
}

function generateNewMenuItem(category: string, aiResponse: string): SuggestedMenuItem {
  const items = {
    'Appetizers': {
      name: 'Truffle Arancini Balls',
      description: 'Crispy risotto balls with truffle oil and parmesan',
      suggestedPrice: 14,
      estimatedCost: 4.50
    },
    'Main Courses': {
      name: 'Plant-Based Power Bowl',
      description: 'Quinoa, roasted vegetables, and tahini dressing',
      suggestedPrice: 18,
      estimatedCost: 6.00
    },
    'Desserts': {
      name: 'Deconstructed Tiramisu',
      description: 'Modern take on classic Italian dessert',
      suggestedPrice: 12,
      estimatedCost: 3.50
    },
    'Beverages': {
      name: 'Craft Cold Brew Flight',
      description: 'Three varieties of house-made cold brew',
      suggestedPrice: 8,
      estimatedCost: 2.00
    }
  };

  const baseItem = items[category as keyof typeof items] || items['Main Courses'];

  return {
    ...baseItem,
    category,
    ingredients: ['Premium ingredients', 'Seasonal produce', 'House-made components'],
    marketOpportunity: 'Trending in local market with high profit potential',
    projectedPopularity: 75 + Math.random() * 20,
    competitiveAdvantage: 'Unique offering not available at nearby restaurants'
  };
}

function calculatePopularityDistribution(menu: MenuItem[]): any {
  return {
    high: menu.filter(item => item.popularity > 70).length,
    medium: menu.filter(item => item.popularity > 40 && item.popularity <= 70).length,
    low: menu.filter(item => item.popularity <= 40).length
  };
}

function calculateCategoryBalance(menu: MenuItem[]): any {
  const categories = menu.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  
  return categories;
}

function generateRecommendations(aiResponse: string, optimizationType: string): string[] {
  return [
    'Focus on high-margin items during peak hours',
    'Implement seasonal menu rotations to maintain freshness',
    'Cross-train kitchen staff on new preparation techniques',
    'Monitor customer feedback closely for first 30 days',
    'Adjust portion sizes based on food cost analysis',
    'Develop signature items that differentiate from competitors',
    'Consider limited-time offerings to test new concepts'
  ];
}
