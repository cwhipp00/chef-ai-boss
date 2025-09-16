import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CashTransaction {
  id: string;
  type: 'in' | 'out';
  amount: number;
  reason: string;
  serverName: string;
  timestamp: string;
  notes?: string;
}

interface AnalysisRequest {
  transactions: CashTransaction[];
  currentBalance: number;
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

    const { transactions, currentBalance }: AnalysisRequest = await req.json();

    // Calculate totals
    const totalIn = transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
    const totalOut = transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
    const netFlow = totalIn - totalOut;

    // Prepare data for AI analysis
    const transactionSummary = transactions.map(t => ({
      type: t.type,
      amount: t.amount,
      reason: t.reason,
      server: t.serverName,
      time: new Date(t.timestamp).toLocaleTimeString()
    }));

    const prompt = `Analyze these cash drawer transactions and provide insights:

Current Balance: $${currentBalance.toFixed(2)}
Total Cash In: $${totalIn.toFixed(2)}
Total Cash Out: $${totalOut.toFixed(2)}
Net Cash Flow: $${netFlow.toFixed(2)}

Transactions:
${JSON.stringify(transactionSummary, null, 2)}

Please provide:
1. Cash flow status (positive/negative and by how much)
2. Key patterns or concerns
3. Recommendations for cash management
4. Any red flags or unusual activity

Format your response as JSON with these fields:
- status: "positive" | "negative" | "balanced"
- netAmount: number
- summary: string (2-3 sentences)
- patterns: string array (key observations)
- recommendations: string array (actionable advice)
- alerts: string array (any concerns or red flags)`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
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
          topP: 0.8,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error:', errorData);
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    // Try to parse JSON from the response
    let analysis;
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback analysis
      analysis = {
        status: netFlow >= 0 ? "positive" : "negative",
        netAmount: netFlow,
        summary: `Cash flow is ${netFlow >= 0 ? 'positive' : 'negative'} with a net of $${Math.abs(netFlow).toFixed(2)}. ${transactions.length} transactions processed.`,
        patterns: [
          `Total cash in: $${totalIn.toFixed(2)}`,
          `Total cash out: $${totalOut.toFixed(2)}`,
          `Most common reason: ${getMostCommonReason(transactions)}`
        ],
        recommendations: [
          netFlow < 0 ? "Monitor cash outflow - you're paying out more than receiving" : "Cash flow looks healthy",
          "Track server tip-outs and settlements carefully"
        ],
        alerts: netFlow < -100 ? ["High negative cash flow detected"] : []
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-cash-analyzer:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getMostCommonReason(transactions: CashTransaction[]): string {
  const reasonCounts: { [key: string]: number } = {};
  transactions.forEach(t => {
    reasonCounts[t.reason] = (reasonCounts[t.reason] || 0) + 1;
  });
  
  return Object.entries(reasonCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
}