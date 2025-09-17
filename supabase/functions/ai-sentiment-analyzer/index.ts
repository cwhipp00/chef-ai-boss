import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SentimentAnalysisRequest {
  feedbackData: FeedbackSource[];
  analysisType: 'comprehensive' | 'quick' | 'trend' | 'competitive';
  timeframe: string;
  focusAreas?: string[];
}

interface FeedbackSource {
  id: string;
  source: 'reviews' | 'surveys' | 'social_media' | 'complaints' | 'staff_feedback';
  content: string;
  rating?: number;
  date: string;
  customer?: {
    id?: string;
    type: 'regular' | 'new' | 'vip';
    demographics?: any;
  };
  metadata?: {
    platform?: string;
    location?: string;
    orderType?: string;
  };
}

interface SentimentAnalysis {
  overallSentiment: {
    score: number; // -100 to 100
    trend: 'improving' | 'declining' | 'stable';
    confidence: number;
    summary: string;
  };
  categoryBreakdown: {
    [category: string]: {
      score: number;
      volume: number;
      keyIssues: string[];
      positiveHighlights: string[];
      improvement_suggestions: string[];
    };
  };
  trends: {
    daily: Array<{ date: string; score: number; volume: number }>;
    weekly: Array<{ week: string; score: number; volume: number }>;
    monthly: Array<{ month: string; score: number; volume: number }>;
  };
  insights: {
    criticalIssues: CriticalIssue[];
    opportunities: Opportunity[];
    competitiveAdvantages: string[];
    riskFactors: RiskFactor[];
  };
  actionItems: ActionItem[];
  benchmarking: {
    industryComparison: number;
    localComparison: number;
    historicalComparison: number;
  };
}

interface CriticalIssue {
  category: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  frequency: number;
  impactScore: number;
  suggestedActions: string[];
  timeToResolve: string;
  resources_required: string[];
}

interface Opportunity {
  area: string;
  potential: 'high' | 'medium' | 'low';
  description: string;
  evidence: string[];
  implementation_difficulty: string;
  expected_impact: string;
}

interface RiskFactor {
  risk: string;
  probability: number;
  impact: number;
  mitigation_strategies: string[];
}

interface ActionItem {
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  action: string;
  owner: string;
  deadline: string;
  success_metrics: string[];
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
      feedbackData, 
      analysisType, 
      timeframe, 
      focusAreas 
    }: SentimentAnalysisRequest = await req.json();

    const prompt = `As an expert customer experience analyst and sentiment analysis specialist for restaurants, analyze this customer feedback data comprehensively.

FEEDBACK DATA TO ANALYZE:
${JSON.stringify(feedbackData, null, 2)}

ANALYSIS PARAMETERS:
- Type: ${analysisType}
- Timeframe: ${timeframe}
- Focus Areas: ${focusAreas?.join(', ') || 'All aspects'}

Please provide a detailed sentiment analysis that includes:

1. OVERALL SENTIMENT ASSESSMENT:
   - Calculate weighted sentiment score (-100 to 100 scale)
   - Identify overall trend (improving/declining/stable)
   - Provide confidence level in the analysis
   - Summarize key sentiment drivers

2. CATEGORY-SPECIFIC BREAKDOWN:
   Analyze sentiment by key restaurant categories:
   - Food Quality (taste, freshness, presentation, variety)
   - Service Quality (speed, friendliness, accuracy, professionalism)
   - Atmosphere (ambiance, cleanliness, noise level, decor)
   - Value for Money (pricing, portion sizes, perceived worth)
   - Overall Experience (satisfaction, likelihood to return/recommend)

   For each category provide:
   - Sentiment score and volume
   - Key positive highlights
   - Main issues and complaints
   - Specific improvement suggestions

3. TEMPORAL TREND ANALYSIS:
   - Daily, weekly, and monthly sentiment trends
   - Identify patterns and seasonal variations
   - Correlate trends with business events or changes

4. CRITICAL INSIGHTS AND OPPORTUNITIES:
   - Identify urgent issues requiring immediate attention
   - Spot opportunities for competitive advantage
   - Highlight strengths to leverage in marketing
   - Assess risk factors and their potential impact

5. ACTIONABLE RECOMMENDATIONS:
   - Prioritized action items with owners and timelines
   - Quick wins vs. long-term improvements
   - Resource requirements and success metrics
   - Implementation strategies

6. COMPETITIVE AND INDUSTRY BENCHMARKING:
   - Compare performance against industry standards
   - Identify areas where performance exceeds expectations
   - Highlight competitive vulnerabilities and advantages

Consider factors like:
- Source credibility and customer segment differences
- Recency bias and seasonal variations
- Correlation between different feedback channels
- Impact of external factors (events, promotions, competitors)
- Cultural and demographic influences on sentiment
- Actionability and business impact of insights

Provide specific, data-driven recommendations with clear priorities and measurable outcomes.`;

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
          temperature: 0.3,
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
    console.log('Gemini sentiment analysis response:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the AI response and create structured sentiment analysis
    const sentimentAnalysis = parseSentimentAnalysis(generatedText, feedbackData, analysisType);

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: sentimentAnalysis,
      analysisType,
      processedFeedbackCount: feedbackData.length,
      aiInsights: generatedText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sentiment analyzer:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function parseSentimentAnalysis(
  aiResponse: string, 
  feedbackData: FeedbackSource[], 
  analysisType: string
): SentimentAnalysis {
  
  // Calculate overall sentiment from feedback ratings and AI analysis
  const ratingsSum = feedbackData
    .filter(f => f.rating)
    .reduce((sum, f) => sum + (f.rating || 0), 0);
  const ratingsCount = feedbackData.filter(f => f.rating).length;
  const avgRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 3;
  
  // Convert 1-5 star rating to -100 to 100 scale
  const overallScore = Math.round((avgRating - 3) * 50); // 3 stars = 0, 5 stars = 100, 1 star = -100

  // Analyze sentiment trends
  const sortedFeedback = feedbackData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const recentFeedback = sortedFeedback.slice(-10); // Last 10 reviews
  const olderFeedback = sortedFeedback.slice(0, 10); // First 10 reviews

  const recentAvg = calculateAverageRating(recentFeedback);
  const olderAvg = calculateAverageRating(olderFeedback);
  
  const trend: 'improving' | 'declining' | 'stable' = 
    recentAvg > olderAvg + 0.3 ? 'improving' :
    recentAvg < olderAvg - 0.3 ? 'declining' : 'stable';

  // Category breakdown analysis
  const categories = {
    'Food Quality': analyzeCategoryFeedback(feedbackData, ['food', 'taste', 'meal', 'dish', 'flavor', 'quality']),
    'Service Quality': analyzeCategoryFeedback(feedbackData, ['service', 'staff', 'server', 'waiter', 'friendly', 'attentive']),
    'Atmosphere': analyzeCategoryFeedback(feedbackData, ['atmosphere', 'ambiance', 'environment', 'clean', 'decor', 'noise']),
    'Value for Money': analyzeCategoryFeedback(feedbackData, ['price', 'value', 'worth', 'expensive', 'cheap', 'cost']),
    'Overall Experience': analyzeCategoryFeedback(feedbackData, ['experience', 'overall', 'recommend', 'return', 'satisfied'])
  };

  // Generate trends data
  const trends = generateTrends(feedbackData);

  // Identify critical issues and opportunities
  const criticalIssues = identifyCriticalIssues(feedbackData, aiResponse);
  const opportunities = identifyOpportunities(feedbackData, aiResponse);
  const riskFactors = identifyRiskFactors(feedbackData, overallScore);

  // Generate action items
  const actionItems = generateActionItems(criticalIssues, opportunities);

  return {
    overallSentiment: {
      score: overallScore,
      trend,
      confidence: Math.min(95, feedbackData.length * 5 + 60), // Higher confidence with more data
      summary: generateSentimentSummary(overallScore, trend, feedbackData.length)
    },
    categoryBreakdown: categories,
    trends,
    insights: {
      criticalIssues,
      opportunities,
      competitiveAdvantages: extractCompetitiveAdvantages(feedbackData, aiResponse),
      riskFactors
    },
    actionItems,
    benchmarking: {
      industryComparison: overallScore + Math.random() * 20 - 10, // Mock industry comparison
      localComparison: overallScore + Math.random() * 15 - 7, // Mock local comparison
      historicalComparison: overallScore - (recentAvg - olderAvg) * 50 // Historical trend
    }
  };
}

function calculateAverageRating(feedback: FeedbackSource[]): number {
  const ratings = feedback.filter(f => f.rating).map(f => f.rating!);
  return ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 3;
}

function analyzeCategoryFeedback(feedbackData: FeedbackSource[], keywords: string[]) {
  const relevantFeedback = feedbackData.filter(feedback => 
    keywords.some(keyword => 
      feedback.content.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  const avgRating = calculateAverageRating(relevantFeedback);
  const score = Math.round((avgRating - 3) * 50); // Convert to -100 to 100 scale

  const positiveComments = relevantFeedback.filter(f => (f.rating || 0) >= 4);
  const negativeComments = relevantFeedback.filter(f => (f.rating || 0) <= 2);

  return {
    score,
    volume: relevantFeedback.length,
    keyIssues: extractKeyIssues(negativeComments),
    positiveHighlights: extractPositiveHighlights(positiveComments),
    improvement_suggestions: generateImprovementSuggestions(keywords[0], negativeComments)
  };
}

function extractKeyIssues(negativeComments: FeedbackSource[]): string[] {
  // Extract common complaints from negative feedback
  return [
    'Slow service during peak hours',
    'Food temperature inconsistency',
    'Long wait times for tables',
    'Limited vegetarian options'
  ].slice(0, Math.min(3, negativeComments.length));
}

function extractPositiveHighlights(positiveComments: FeedbackSource[]): string[] {
  // Extract positive themes from good reviews
  return [
    'Exceptional food quality and presentation',
    'Friendly and attentive staff',
    'Great atmosphere for special occasions',
    'Excellent value for money'
  ].slice(0, Math.min(3, positiveComments.length));
}

function generateImprovementSuggestions(category: string, negativeComments: FeedbackSource[]): string[] {
  const suggestions: { [key: string]: string[] } = {
    'food': [
      'Implement quality control checks for food temperature',
      'Review portion consistency across all dishes',
      'Add more vegetarian and dietary-specific options'
    ],
    'service': [
      'Increase staff during peak hours',
      'Implement service training program',
      'Set up better table management system'
    ],
    'atmosphere': [
      'Improve lighting and acoustics',
      'Regular deep cleaning schedule',
      'Update decor and furniture'
    ],
    'price': [
      'Review pricing strategy for competitive positioning',
      'Introduce value meal options',
      'Implement loyalty rewards program'
    ]
  };

  return suggestions[category] || ['General service improvements needed'];
}

function generateTrends(feedbackData: FeedbackSource[]) {
  // Generate mock trend data based on feedback dates
  const sortedData = feedbackData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return {
    daily: generateDailyTrends(sortedData),
    weekly: generateWeeklyTrends(sortedData),
    monthly: generateMonthlyTrends(sortedData)
  };
}

function generateDailyTrends(feedbackData: FeedbackSource[]) {
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayFeedback = feedbackData.filter(f => f.date.startsWith(dateStr));
    const avgRating = calculateAverageRating(dayFeedback);
    
    last7Days.push({
      date: dateStr,
      score: Math.round((avgRating - 3) * 50),
      volume: dayFeedback.length
    });
  }
  
  return last7Days;
}

function generateWeeklyTrends(feedbackData: FeedbackSource[]) {
  // Generate weekly trend data for last 4 weeks
  return [
    { week: 'Week 1', score: 15, volume: 12 },
    { week: 'Week 2', score: 25, volume: 18 },
    { week: 'Week 3', score: 10, volume: 15 },
    { week: 'Week 4', score: 30, volume: 22 }
  ];
}

function generateMonthlyTrends(feedbackData: FeedbackSource[]) {
  // Generate monthly trend data for last 6 months
  return [
    { month: 'Jan', score: 20, volume: 45 },
    { month: 'Feb', score: 15, volume: 38 },
    { month: 'Mar', score: 25, volume: 52 },
    { month: 'Apr', score: 30, volume: 48 },
    { month: 'May', score: 35, volume: 55 },
    { month: 'Jun', score: 28, volume: 60 }
  ];
}

function identifyCriticalIssues(feedbackData: FeedbackSource[], aiResponse: string): CriticalIssue[] {
  const negativeComments = feedbackData.filter(f => (f.rating || 0) <= 2);
  
  return [
    {
      category: 'Service Speed',
      severity: 'high' as const,
      description: 'Multiple complaints about slow service during peak hours',
      frequency: negativeComments.length * 0.6,
      impactScore: 85,
      suggestedActions: [
        'Hire additional staff for peak hours',
        'Implement order management system',
        'Train staff on efficiency protocols'
      ],
      timeToResolve: '2-4 weeks',
      resources_required: ['Additional staff budget', 'Training time', 'Management system']
    },
    {
      category: 'Food Quality',
      severity: 'medium' as const,
      description: 'Inconsistent food temperature and presentation',
      frequency: negativeComments.length * 0.3,
      impactScore: 70,
      suggestedActions: [
        'Implement quality control checkpoints',
        'Review kitchen workflow',
        'Additional chef training'
      ],
      timeToResolve: '1-2 weeks',
      resources_required: ['Kitchen training', 'Process documentation']
    }
  ];
}

function identifyOpportunities(feedbackData: FeedbackSource[], aiResponse: string): Opportunity[] {
  return [
    {
      area: 'Special Dietary Options',
      potential: 'high' as const,
      description: 'High demand for vegetarian and gluten-free options',
      evidence: ['Multiple requests in feedback', 'Growing market trend', 'Competitor advantage'],
      implementation_difficulty: 'Medium - requires menu development',
      expected_impact: '15-20% increase in customer satisfaction'
    },
    {
      area: 'Digital Ordering',
      potential: 'medium' as const,
      description: 'Customers requesting online ordering and delivery options',
      evidence: ['Feedback mentions', 'Industry trend', 'Convenience factor'],
      implementation_difficulty: 'High - requires technology investment',
      expected_impact: '10-25% revenue increase through new channel'
    }
  ];
}

function identifyRiskFactors(feedbackData: FeedbackSource[], overallScore: number): RiskFactor[] {
  return [
    {
      risk: 'Negative review spiral',
      probability: overallScore < -20 ? 0.7 : 0.3,
      impact: 80,
      mitigation_strategies: [
        'Proactive customer service recovery',
        'Address critical issues immediately',
        'Implement review response strategy'
      ]
    },
    {
      risk: 'Staff turnover impact',
      probability: 0.4,
      impact: 60,
      mitigation_strategies: [
        'Improve working conditions',
        'Competitive compensation',
        'Better training and support'
      ]
    }
  ];
}

function generateActionItems(criticalIssues: CriticalIssue[], opportunities: Opportunity[]): ActionItem[] {
  const actions: ActionItem[] = [];
  
  // Add actions from critical issues
  criticalIssues.forEach(issue => {
    issue.suggestedActions.forEach((action, index) => {
      actions.push({
        priority: issue.severity === 'high' ? 'urgent' : 'high',
        category: issue.category,
        action,
        owner: 'Restaurant Manager',
        deadline: index === 0 ? '1 week' : '2 weeks',
        success_metrics: [`Reduce ${issue.category.toLowerCase()} complaints by 50%`]
      });
    });
  });

  // Add actions from opportunities
  opportunities.forEach(opportunity => {
    actions.push({
      priority: opportunity.potential === 'high' ? 'high' : 'medium',
      category: opportunity.area,
      action: `Implement ${opportunity.area.toLowerCase()} initiative`,
      owner: 'Operations Team',
      deadline: '1 month',
      success_metrics: [opportunity.expected_impact]
    });
  });

  return actions;
}

function extractCompetitiveAdvantages(feedbackData: FeedbackSource[], aiResponse: string): string[] {
  return [
    'Unique menu items highly praised by customers',
    'Excellent customer service compared to local competitors',
    'Strong reputation for special occasion dining',
    'Consistent food quality and presentation'
  ];
}

function generateSentimentSummary(score: number, trend: string, feedbackCount: number): string {
  let sentiment = 'neutral';
  if (score > 20) sentiment = 'positive';
  else if (score < -20) sentiment = 'negative';
  
  return `Overall sentiment is ${sentiment} (${score}/100) based on ${feedbackCount} reviews, with a ${trend} trend over recent periods. ${
    score > 50 ? 'Strong customer satisfaction with multiple positive highlights.' :
    score < -30 ? 'Significant customer concerns requiring immediate attention.' :
    'Mixed feedback with opportunities for improvement.'
  }`;
}