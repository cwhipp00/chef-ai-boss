import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InventoryAnalysisRequest {
  currentInventory: InventoryItem[];
  salesData: SalesHistoryData;
  weatherData?: WeatherData;
  events?: EventData[];
  analysisType: 'demand_forecast' | 'optimization' | 'waste_reduction' | 'cost_analysis';
  timeHorizon: '1_week' | '2_weeks' | '1_month' | '3_months';
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  minimumStock: number;
  maximumStock: number;
  averageDailyUsage: number;
  leadTime: number; // days
  perishability: {
    shelfLife: number; // days
    storageRequirements: string;
    spoilageRate: number; // percentage
  };
  seasonality: {
    highSeason: string[];
    lowSeason: string[];
    peakMonths: string[];
  };
  lastOrderDate: string;
  lastOrderQuantity: number;
  qualityScore: number; // 1-10
}

interface SalesHistoryData {
  dailySales: { [date: string]: { [itemId: string]: number } };
  weeklyTrends: { [week: string]: { [itemId: string]: number } };
  monthlyPatterns: { [month: string]: { [itemId: string]: number } };
  customerPreferences: { [itemId: string]: PreferenceData };
}

interface PreferenceData {
  popularityScore: number;
  repeatOrderRate: number;
  seasonalDemand: { [season: string]: number };
  demographicPreference: any;
}

interface WeatherData {
  forecast: Array<{
    date: string;
    temperature: number;
    conditions: string;
    humidity: number;
  }>;
  historical: Array<{
    date: string;
    temperature: number;
    conditions: string;
    salesImpact: number;
  }>;
}

interface EventData {
  date: string;
  type: string;
  expectedAttendance: number;
  menuFocus: string[];
  specialRequirements: string[];
}

interface InventoryAnalysisResult {
  demandForecast: DemandForecast;
  optimizationRecommendations: OptimizationRecommendation[];
  wasteReductionOpportunities: WasteReduction[];
  costAnalysis: CostAnalysis;
  riskAssessment: RiskAssessment;
  actionPlan: ActionPlan;
  alerts: Alert[];
  performance: PerformanceMetrics;
}

interface DemandForecast {
  predictions: Array<{
    itemId: string;
    itemName: string;
    forecastedDemand: number;
    confidence: number;
    seasonalFactor: number;
    weatherImpact: number;
    eventImpact: number;
    trendDirection: 'increasing' | 'decreasing' | 'stable';
  }>;
  aggregatedMetrics: {
    totalDemandIncrease: number;
    highDemandItems: string[];
    lowDemandItems: string[];
    newTrendItems: string[];
  };
}

interface OptimizationRecommendation {
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  action: string;
  expectedImpact: string;
  implementation: {
    effort: string;
    timeline: string;
    resources: string[];
    cost: number;
  };
  metrics: {
    costSavings: number;
    wastageReduction: number;
    serviceImprovement: number;
  };
}

interface WasteReduction {
  itemId: string;
  itemName: string;
  currentWastage: number;
  wasteValue: number;
  rootCauses: string[];
  solutions: Array<{
    solution: string;
    potentialReduction: number;
    implementationDifficulty: string;
    costBenefit: number;
  }>;
}

interface CostAnalysis {
  totalInventoryValue: number;
  carryingCosts: number;
  orderingCosts: number;
  stockoutCosts: number;
  spoilageCosts: number;
  optimizationOpportunities: Array<{
    area: string;
    currentCost: number;
    optimizedCost: number;
    savings: number;
    paybackPeriod: string;
  }>;
}

interface RiskAssessment {
  supplyChainRisks: Array<{
    supplier: string;
    riskLevel: 'high' | 'medium' | 'low';
    riskFactors: string[];
    mitigationStrategies: string[];
  }>;
  stockoutRisks: Array<{
    itemId: string;
    itemName: string;
    riskProbability: number;
    businessImpact: number;
    preventionActions: string[];
  }>;
  overStockRisks: Array<{
    itemId: string;
    itemName: string;
    excessQuantity: number;
    tieUpCapital: number;
    spoilageRisk: number;
  }>;
}

interface ActionPlan {
  immediate: Action[];
  shortTerm: Action[];
  longTerm: Action[];
}

interface Action {
  action: string;
  priority: number;
  owner: string;
  deadline: string;
  resources: string[];
  successMetrics: string[];
}

interface Alert {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  affectedItems: string[];
  recommendedAction: string;
  deadline?: string;
}

interface PerformanceMetrics {
  turnoverRatio: number;
  serviceLevel: number;
  fillRate: number;
  accuracyRate: number;
  costEfficiency: number;
  wastagePercentage: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY') || Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const requestBody = await req.json();

    // Check if this is a photo-based inventory request
    if (requestBody.image && requestBody.imageType) {
      return await handlePhotoInventoryAnalysis(requestBody, geminiApiKey);
    }

    // Handle traditional inventory analysis
    const { 
      currentInventory, 
      salesData, 
      weatherData, 
      events = [], 
      analysisType, 
      timeHorizon 
    }: InventoryAnalysisRequest = requestBody;

    console.log('Processing inventory analysis:', { analysisType, timeHorizon, itemCount: currentInventory.length });

    const prompt = `As an expert inventory management specialist and restaurant operations analyst, provide comprehensive inventory analysis and optimization recommendations.

CURRENT INVENTORY DATA:
${JSON.stringify(currentInventory.slice(0, 10), null, 2)} ${currentInventory.length > 10 ? '... (showing first 10 items)' : ''}
Total Items: ${currentInventory.length}

SALES HISTORY DATA:
${JSON.stringify(salesData, null, 2)}

WEATHER FORECAST:
${JSON.stringify(weatherData, null, 2)}

UPCOMING EVENTS:
${JSON.stringify(events, null, 2)}

ANALYSIS TYPE: ${analysisType}
TIME HORIZON: ${timeHorizon}

Please provide a comprehensive inventory analysis that includes:

1. DEMAND FORECASTING:
   - Predict demand for each inventory item over the specified time horizon
   - Consider seasonal patterns, weather impact, and upcoming events
   - Factor in historical sales trends and customer preferences
   - Identify items with increasing/decreasing demand trends
   - Calculate confidence levels for predictions

2. INVENTORY OPTIMIZATION:
   - Analyze current stock levels vs. optimal levels
   - Identify overstocked and understocked items
   - Calculate optimal order quantities and reorder points
   - Recommend safety stock levels based on demand variability
   - Optimize inventory turnover and carrying costs

3. WASTE REDUCTION OPPORTUNITIES:
   - Identify items with high spoilage rates
   - Analyze root causes of waste (over-ordering, poor rotation, etc.)
   - Calculate financial impact of current waste levels
   - Recommend specific waste reduction strategies
   - Prioritize items by waste reduction potential

4. COST ANALYSIS AND OPTIMIZATION:
   - Calculate total inventory carrying costs
   - Analyze ordering patterns and frequency optimization
   - Identify cost reduction opportunities
   - Evaluate supplier performance and pricing
   - Recommend cost-effective procurement strategies

5. RISK ASSESSMENT:
   - Identify supply chain vulnerabilities
   - Assess stockout risks and business impact
   - Evaluate overstock risks and capital tie-up
   - Analyze supplier reliability and backup options
   - Recommend risk mitigation strategies

6. ACTIONABLE RECOMMENDATIONS:
   - Prioritized action plan with timelines
   - Immediate actions needed (next 24-48 hours)
   - Short-term optimizations (1-4 weeks)
   - Long-term strategic improvements (1-3 months)
   - Resource requirements and implementation steps

7. PERFORMANCE METRICS AND KPIs:
   - Current inventory performance assessment
   - Benchmark against industry standards
   - Track key metrics (turnover, service level, waste %)
   - Set targets for improvement

Consider factors like:
- Restaurant type and customer patterns
- Seasonal variations and local events
- Perishability and storage constraints
- Supplier lead times and reliability
- Cash flow and working capital optimization
- Food safety and quality requirements
- Menu planning and promotional activities

Provide specific, data-driven recommendations with quantified benefits and implementation guidance.`;

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
    console.log('Gemini inventory analysis response received');

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the AI response and create structured inventory analysis
    const analysisResult = parseInventoryAnalysis(generatedText, currentInventory, salesData, analysisType, timeHorizon);

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: analysisResult,
      analysisType,
      timeHorizon,
      processedItems: currentInventory.length,
      aiInsights: generatedText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in inventory analyzer:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function parseInventoryAnalysis(
  aiResponse: string, 
  currentInventory: InventoryItem[], 
  salesData: SalesHistoryData,
  analysisType: string, 
  timeHorizon: string
): InventoryAnalysisResult {
  
  // Generate demand forecast
  const demandForecast = generateDemandForecast(currentInventory, salesData, timeHorizon);
  
  // Generate optimization recommendations
  const optimizationRecommendations = generateOptimizationRecommendations(currentInventory, aiResponse);
  
  // Identify waste reduction opportunities
  const wasteReductionOpportunities = identifyWasteReduction(currentInventory, salesData);
  
  // Perform cost analysis
  const costAnalysis = performCostAnalysis(currentInventory, salesData);
  
  // Assess risks
  const riskAssessment = assessRisks(currentInventory, salesData);
  
  // Create action plan
  const actionPlan = createActionPlan(optimizationRecommendations);
  
  // Generate alerts
  const alerts = generateAlerts(currentInventory, demandForecast);
  
  // Calculate performance metrics
  const performance = calculatePerformanceMetrics(currentInventory, salesData);

  return {
    demandForecast,
    optimizationRecommendations,
    wasteReductionOpportunities,
    costAnalysis,
    riskAssessment,
    actionPlan,
    alerts,
    performance
  };
}

function generateDemandForecast(inventory: InventoryItem[], salesData: SalesHistoryData, timeHorizon: string): DemandForecast {
  const predictions = inventory.map(item => {
    const baseUsage = item.averageDailyUsage;
    const seasonalFactor = calculateSeasonalFactor(item);
    const trendFactor = calculateTrendFactor(item, salesData);
    
    // Multiply by time horizon
    const days = timeHorizon === '1_week' ? 7 : timeHorizon === '2_weeks' ? 14 : timeHorizon === '1_month' ? 30 : 90;
    const forecastedDemand = Math.round(baseUsage * seasonalFactor * trendFactor * days);
    
    return {
      itemId: item.id,
      itemName: item.name,
      forecastedDemand,
      confidence: 0.75 + Math.random() * 0.2, // 75-95% confidence
      seasonalFactor,
      weatherImpact: Math.random() * 0.2 + 0.9, // 0.9-1.1 multiplier
      eventImpact: Math.random() * 0.3 + 0.85, // 0.85-1.15 multiplier
      trendDirection: trendFactor > 1.1 ? 'increasing' : trendFactor < 0.9 ? 'decreasing' : 'stable'
    };
  });

  const totalDemandIncrease = predictions.reduce((sum, p) => sum + p.forecastedDemand, 0);
  const highDemandItems = predictions.filter(p => p.trendDirection === 'increasing').map(p => p.itemName);
  const lowDemandItems = predictions.filter(p => p.trendDirection === 'decreasing').map(p => p.itemName);

  return {
    predictions,
    aggregatedMetrics: {
      totalDemandIncrease,
      highDemandItems: highDemandItems.slice(0, 5),
      lowDemandItems: lowDemandItems.slice(0, 5),
      newTrendItems: []
    }
  };
}

function calculateSeasonalFactor(item: InventoryItem): number {
  const currentMonth = new Date().getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthName = monthNames[currentMonth];
  
  if (item.seasonality.peakMonths.includes(currentMonthName)) {
    return 1.3; // 30% higher demand
  } else if (item.seasonality.lowSeason.some(season => 
    (season === 'winter' && [11, 0, 1].includes(currentMonth)) ||
    (season === 'summer' && [5, 6, 7].includes(currentMonth))
  )) {
    return 0.8; // 20% lower demand
  }
  
  return 1.0; // Normal demand
}

function calculateTrendFactor(item: InventoryItem, salesData: SalesHistoryData): number {
  // Mock trend calculation - in reality would analyze historical data
  const popularity = salesData.customerPreferences[item.id]?.popularityScore || 50;
  
  if (popularity > 80) return 1.2; // Growing trend
  if (popularity < 30) return 0.8; // Declining trend
  return 1.0; // Stable
}

function generateOptimizationRecommendations(inventory: InventoryItem[], aiResponse: string): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];

  // Find understocked items
  const understockedItems = inventory.filter(item => item.currentStock <= item.minimumStock);
  if (understockedItems.length > 0) {
    recommendations.push({
      category: 'Stock Replenishment',
      priority: 'critical',
      action: `Immediately order ${understockedItems.length} understocked items: ${understockedItems.map(i => i.name).slice(0, 3).join(', ')}${understockedItems.length > 3 ? '...' : ''}`,
      expectedImpact: 'Prevent stockouts and maintain service levels',
      implementation: {
        effort: 'Low',
        timeline: '24-48 hours',
        resources: ['Procurement team', 'Supplier contacts'],
        cost: understockedItems.reduce((sum, item) => sum + (item.minimumStock * item.costPerUnit), 0)
      },
      metrics: {
        costSavings: 0,
        wastageReduction: 0,
        serviceImprovement: 25
      }
    });
  }

  // Find overstocked items
  const overstockedItems = inventory.filter(item => item.currentStock > item.maximumStock * 1.5);
  if (overstockedItems.length > 0) {
    recommendations.push({
      category: 'Overstock Reduction',
      priority: 'high',
      action: `Reduce overstock for ${overstockedItems.length} items through promotions or menu specials`,
      expectedImpact: 'Reduce carrying costs and prevent spoilage',
      implementation: {
        effort: 'Medium',
        timeline: '1-2 weeks',
        resources: ['Marketing team', 'Kitchen staff'],
        cost: 500
      },
      metrics: {
        costSavings: overstockedItems.reduce((sum, item) => sum + ((item.currentStock - item.maximumStock) * item.costPerUnit * 0.2), 0),
        wastageReduction: 15,
        serviceImprovement: 5
      }
    });
  }

  // High spoilage items
  const highSpoilageItems = inventory.filter(item => item.perishability.spoilageRate > 10);
  if (highSpoilageItems.length > 0) {
    recommendations.push({
      category: 'Spoilage Reduction',
      priority: 'medium',
      action: 'Implement FIFO rotation and improve storage conditions for high-spoilage items',
      expectedImpact: 'Reduce food waste and associated costs',
      implementation: {
        effort: 'Medium',
        timeline: '2-3 weeks',
        resources: ['Kitchen staff', 'Storage equipment'],
        cost: 1000
      },
      metrics: {
        costSavings: highSpoilageItems.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit * item.perishability.spoilageRate / 100), 0),
        wastageReduction: 30,
        serviceImprovement: 0
      }
    });
  }

  return recommendations;
}

function identifyWasteReduction(inventory: InventoryItem[], salesData: SalesHistoryData): WasteReduction[] {
  return inventory
    .filter(item => item.perishability.spoilageRate > 5)
    .map(item => {
      const currentWastage = item.currentStock * (item.perishability.spoilageRate / 100);
      const wasteValue = currentWastage * item.costPerUnit;
      
      return {
        itemId: item.id,
        itemName: item.name,
        currentWastage,
        wasteValue,
        rootCauses: [
          'Over-ordering due to inaccurate demand forecasting',
          'Poor inventory rotation (FIFO not followed)',
          'Inadequate storage conditions',
          'Lack of real-time inventory tracking'
        ],
        solutions: [
          {
            solution: 'Implement automated inventory tracking system',
            potentialReduction: 40,
            implementationDifficulty: 'High',
            costBenefit: 3.2
          },
          {
            solution: 'Staff training on proper FIFO rotation',
            potentialReduction: 25,
            implementationDifficulty: 'Low',
            costBenefit: 8.5
          },
          {
            solution: 'Improve storage temperature control',
            potentialReduction: 20,
            implementationDifficulty: 'Medium',
            costBenefit: 4.1
          }
        ]
      };
    })
    .slice(0, 10); // Top 10 waste reduction opportunities
}

function performCostAnalysis(inventory: InventoryItem[], salesData: SalesHistoryData): CostAnalysis {
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);
  const carryingCosts = totalInventoryValue * 0.25; // 25% carrying cost assumption
  const orderingCosts = inventory.length * 50; // $50 per order assumption
  const spoilageCosts = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit * item.perishability.spoilageRate / 100), 0);
  
  return {
    totalInventoryValue,
    carryingCosts,
    orderingCosts,
    stockoutCosts: 2500, // Mock stockout cost
    spoilageCosts,
    optimizationOpportunities: [
      {
        area: 'Inventory Level Optimization',
        currentCost: carryingCosts,
        optimizedCost: carryingCosts * 0.8,
        savings: carryingCosts * 0.2,
        paybackPeriod: '3 months'
      },
      {
        area: 'Waste Reduction',
        currentCost: spoilageCosts,
        optimizedCost: spoilageCosts * 0.6,
        savings: spoilageCosts * 0.4,
        paybackPeriod: '2 months'
      }
    ]
  };
}

function assessRisks(inventory: InventoryItem[], salesData: SalesHistoryData): RiskAssessment {
  const suppliers = [...new Set(inventory.map(item => item.supplier))];
  
  return {
    supplyChainRisks: suppliers.map(supplier => ({
      supplier,
      riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      riskFactors: ['Single source dependency', 'Geographic concentration', 'Quality variability'],
      mitigationStrategies: ['Develop backup suppliers', 'Diversify sourcing', 'Regular quality audits']
    })),
    stockoutRisks: inventory
      .filter(item => item.currentStock <= item.minimumStock * 1.2)
      .map(item => ({
        itemId: item.id,
        itemName: item.name,
        riskProbability: Math.min(95, (item.minimumStock - item.currentStock) / item.minimumStock * 100),
        businessImpact: item.averageDailyUsage * item.costPerUnit * 7, // 7 days of lost sales
        preventionActions: ['Increase order frequency', 'Raise minimum stock level', 'Find alternative suppliers']
      }))
      .slice(0, 5),
    overStockRisks: inventory
      .filter(item => item.currentStock > item.maximumStock)
      .map(item => ({
        itemId: item.id,
        itemName: item.name,
        excessQuantity: item.currentStock - item.maximumStock,
        tieUpCapital: (item.currentStock - item.maximumStock) * item.costPerUnit,
        spoilageRisk: item.perishability.spoilageRate
      }))
      .slice(0, 5)
  };
}

function createActionPlan(recommendations: OptimizationRecommendation[]): ActionPlan {
  const immediate = recommendations
    .filter(r => r.priority === 'critical')
    .map((r, i) => ({
      action: r.action,
      priority: i + 1,
      owner: 'Inventory Manager',
      deadline: '24 hours',
      resources: r.implementation.resources,
      successMetrics: [`Reduce stockouts by ${r.metrics.serviceImprovement}%`]
    }));

  const shortTerm = recommendations
    .filter(r => r.priority === 'high')
    .map((r, i) => ({
      action: r.action,
      priority: i + 1,
      owner: 'Operations Team',
      deadline: '2 weeks',
      resources: r.implementation.resources,
      successMetrics: [`Save $${r.metrics.costSavings.toFixed(0)} monthly`]
    }));

  const longTerm = recommendations
    .filter(r => r.priority === 'medium' || r.priority === 'low')
    .map((r, i) => ({
      action: r.action,
      priority: i + 1,
      owner: 'Management Team',
      deadline: '1 month',
      resources: r.implementation.resources,
      successMetrics: [`Improve efficiency by ${r.metrics.wastageReduction}%`]
    }));

  return { immediate, shortTerm, longTerm };
}

function generateAlerts(inventory: InventoryItem[], forecast: DemandForecast): Alert[] {
  const alerts: Alert[] = [];

  // Critical stock alerts
  inventory.forEach(item => {
    if (item.currentStock <= item.minimumStock) {
      alerts.push({
        severity: 'critical',
        message: `${item.name} is at critical stock level (${item.currentStock} ${item.unit})`,
        affectedItems: [item.name],
        recommendedAction: `Order ${item.minimumStock * 2} ${item.unit} immediately`,
        deadline: '24 hours'
      });
    }
  });

  // Expiry alerts
  inventory.forEach(item => {
    if (item.perishability.shelfLife <= 2) {
      alerts.push({
        severity: 'warning',
        message: `${item.name} expires within 2 days`,
        affectedItems: [item.name],
        recommendedAction: 'Use in daily specials or promotional menu',
        deadline: '48 hours'
      });
    }
});

// Handle photo-based inventory analysis
async function handlePhotoInventoryAnalysis(requestBody: any, geminiApiKey: string) {
  const { image, imageType } = requestBody;

  console.log('Processing photo-based inventory analysis');

  const prompt = `Analyze this inventory photo and identify all food and beverage items visible. For each item you can identify, provide:

1. Item name (be specific - e.g., "Roma Tomatoes" not just "Tomatoes")
2. Category (produce, dairy, meat, pantry, beverages, etc.)
3. Estimated quantity (count, weight, or volume)
4. Unit of measurement (pieces, lbs, kg, liters, etc.)
5. Visible condition (fresh, good, fair, poor based on appearance)
6. Confidence level (0.0 to 1.0) in your identification
7. Estimated expiry/best-by timeframe if applicable
8. Suggested storage location (refrigerator, freezer, pantry, etc.)

Look for:
- Fresh produce (fruits, vegetables, herbs)
- Packaged goods with visible labels
- Dairy products
- Meat and seafood
- Beverages
- Condiments and sauces
- Dry goods and pantry items
- Prepared foods

Consider factors like:
- Item freshness and quality based on visual appearance
- Packaging condition
- Expiration dates if visible
- Proper storage requirements
- Quantity estimation based on size and packaging

Respond in valid JSON format:
{
  "items": [
    {
      "name": "string",
      "category": "string", 
      "quantity": number,
      "unit": "string",
      "condition": "fresh|good|fair|poor",
      "confidence": number,
      "expiryEstimate": "string (optional)",
      "location": "string (optional)"
    }
  ],
  "summary": {
    "totalItems": number,
    "categoriesFound": ["string"],
    "averageConfidence": number
  }
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            text: prompt
          },
          {
            inline_data: {
              mime_type: imageType,
              data: image
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
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
  console.log('Gemini photo analysis response received');

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid response from Gemini API');
  }

  let generatedText = data.candidates[0].content.parts[0].text;
  
  // Clean up the response - remove markdown formatting
  generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  let analysisResult;
  
  try {
    analysisResult = JSON.parse(generatedText);
  } catch (parseError) {
    console.error('Failed to parse AI response:', generatedText);
    
    // Fallback result
    analysisResult = {
      items: [
        {
          name: "Unidentified Items",
          category: "mixed",
          quantity: 1,
          unit: "batch",
          condition: "good",
          confidence: 0.5,
          expiryEstimate: "Review manually",
          location: "Storage area"
        }
      ],
      summary: {
        totalItems: 1,
        categoriesFound: ["mixed"],
        averageConfidence: 0.5
      }
    };
  }

  // Validate and ensure proper structure
  if (!analysisResult.items || !Array.isArray(analysisResult.items)) {
    analysisResult.items = [];
  }

  // Calculate summary if missing
  if (!analysisResult.summary) {
    const categories = [...new Set(analysisResult.items.map((item: any) => item.category))];
    const avgConfidence = analysisResult.items.length > 0 
      ? analysisResult.items.reduce((sum: number, item: any) => sum + (item.confidence || 0), 0) / analysisResult.items.length
      : 0;

    analysisResult.summary = {
      totalItems: analysisResult.items.length,
      categoriesFound: categories,
      averageConfidence: avgConfidence
    };
  }

  return new Response(JSON.stringify(analysisResult), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

  return alerts;
}

function calculatePerformanceMetrics(inventory: InventoryItem[], salesData: SalesHistoryData): PerformanceMetrics {
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);
  const totalUsageValue = inventory.reduce((sum, item) => sum + (item.averageDailyUsage * item.costPerUnit * 30), 0);
  
  return {
    turnoverRatio: totalUsageValue / totalValue,
    serviceLevel: 95.5, // Mock service level
    fillRate: 92.3, // Mock fill rate
    accuracyRate: 97.8, // Mock accuracy
    costEfficiency: 87.2, // Mock efficiency score
    wastagePercentage: inventory.reduce((sum, item) => sum + item.perishability.spoilageRate, 0) / inventory.length
  };
}

// Handle photo-based inventory analysis
async function handlePhotoInventoryAnalysis(requestBody: any, geminiApiKey: string) {
  const { image, imageType } = requestBody;

  console.log('Processing photo-based inventory analysis');

  const prompt = `Analyze this inventory photo and identify all food and beverage items visible. For each item you can identify, provide:

1. Item name (be specific - e.g., "Roma Tomatoes" not just "Tomatoes")
2. Category (produce, dairy, meat, pantry, beverages, etc.)
3. Estimated quantity (count, weight, or volume)
4. Unit of measurement (pieces, lbs, kg, liters, etc.)
5. Visible condition (fresh, good, fair, poor based on appearance)
6. Confidence level (0.0 to 1.0) in your identification
7. Estimated expiry/best-by timeframe if applicable
8. Suggested storage location (refrigerator, freezer, pantry, etc.)

Look for:
- Fresh produce (fruits, vegetables, herbs)
- Packaged goods with visible labels
- Dairy products
- Meat and seafood
- Beverages
- Condiments and sauces
- Dry goods and pantry items
- Prepared foods

Consider factors like:
- Item freshness and quality based on visual appearance
- Packaging condition
- Expiration dates if visible
- Proper storage requirements
- Quantity estimation based on size and packaging

Respond in valid JSON format:
{
  "items": [
    {
      "name": "string",
      "category": "string", 
      "quantity": number,
      "unit": "string",
      "condition": "fresh|good|fair|poor",
      "confidence": number,
      "expiryEstimate": "string (optional)",
      "location": "string (optional)"
    }
  ],
  "summary": {
    "totalItems": number,
    "categoriesFound": ["string"],
    "averageConfidence": number
  }
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            text: prompt
          },
          {
            inline_data: {
              mime_type: imageType,
              data: image
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
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
  console.log('Gemini photo analysis response received');

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid response from Gemini API');
  }

  let generatedText = data.candidates[0].content.parts[0].text;
  
  // Clean up the response - remove markdown formatting
  generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  let analysisResult;
  
  try {
    analysisResult = JSON.parse(generatedText);
  } catch (parseError) {
    console.error('Failed to parse AI response:', generatedText);
    
    // Fallback result
    analysisResult = {
      items: [
        {
          name: "Unidentified Items",
          category: "mixed",
          quantity: 1,
          unit: "batch",
          condition: "good",
          confidence: 0.5,
          expiryEstimate: "Review manually",
          location: "Storage area"
        }
      ],
      summary: {
        totalItems: 1,
        categoriesFound: ["mixed"],
        averageConfidence: 0.5
      }
    };
  }

  // Validate and ensure proper structure
  if (!analysisResult.items || !Array.isArray(analysisResult.items)) {
    analysisResult.items = [];
  }

  // Calculate summary if missing
  if (!analysisResult.summary) {
    const categories = [...new Set(analysisResult.items.map((item: any) => item.category))];
    const avgConfidence = analysisResult.items.length > 0 
      ? analysisResult.items.reduce((sum: number, item: any) => sum + (item.confidence || 0), 0) / analysisResult.items.length
      : 0;

    analysisResult.summary = {
      totalItems: analysisResult.items.length,
      categoriesFound: categories,
      averageConfidence: avgConfidence
    };
  }

  return new Response(JSON.stringify(analysisResult), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}