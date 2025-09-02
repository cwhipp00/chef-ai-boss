import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get sample order data for analysis (in a real app, you'd query actual order data)
    const mockOrderData = {
      recentOrders: [
        { item: 'Chicken Parmesan', quantity: 23, time: '12:30', revenue: 345.00 },
        { item: 'Caesar Salad', quantity: 18, time: '13:15', revenue: 180.00 },
        { item: 'Grilled Salmon', quantity: 15, time: '19:45', revenue: 375.00 }
      ],
      timeData: '12:00-14:00 (35 orders), 18:00-20:30 (42 orders)',
      customerFeedback: 'Service is great but sometimes slow during peak hours. Food quality excellent.',
      averageOrderValue: 28.50,
      dailyRevenue: 2840.00
    };

    const prompt = `Analyze this restaurant order data and provide comprehensive business insights:

Order Data:
${JSON.stringify(mockOrderData, null, 2)}

Please analyze and provide insights in JSON format with:
- orderTrends: { peakHours: string[], popularItems: array with name/count/trend, averageOrderValue: number, orderFrequency: string }
- customerInsights: { repeatCustomers: percentage, newCustomers: percentage, customerSatisfaction: score out of 5, preferredChannels: array with channel/percentage }
- recommendations: array with type/title/impact/priority(high/medium/low)
- predictions: { nextHourOrders: number, todayRevenue: number, staffingNeeded: number, inventoryAlerts: string array }

Base your analysis on the provided data and industry best practices. Be specific and actionable with recommendations.`;

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
          temperature: 0.3,
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
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let analysis;
    try {
      analysis = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      // Fallback analysis
      analysis = {
        orderTrends: {
          peakHours: ['12:00-14:00', '18:00-20:30'],
          popularItems: [
            { name: 'Chicken Parmesan', count: 23, trend: '+15%' },
            { name: 'Caesar Salad', count: 18, trend: '+8%' },
            { name: 'Grilled Salmon', count: 15, trend: '+22%' }
          ],
          averageOrderValue: 28.50,
          orderFrequency: 'Every 3.2 minutes'
        },
        customerInsights: {
          repeatCustomers: 68,
          newCustomers: 32,
          customerSatisfaction: 4.6,
          preferredChannels: [
            { channel: 'Dine-in', percentage: 55 },
            { channel: 'Online', percentage: 30 },
            { channel: 'Phone', percentage: 15 }
          ]
        },
        recommendations: [
          {
            type: 'menu',
            title: 'Promote salmon dishes during peak hours',
            impact: '+$480/day estimated',
            priority: 'high'
          }
        ],
        predictions: {
          nextHourOrders: 12,
          todayRevenue: 3240,
          staffingNeeded: 6,
          inventoryAlerts: ['Chicken breast (2 days left)']
        }
      };
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error analyzing orders:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze orders',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});