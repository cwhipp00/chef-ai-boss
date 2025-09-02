import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  estimatedTime: number;
  assignee?: string;
}

interface ChecklistRequest {
  items: ChecklistItem[];
  requestType: 'optimize' | 'suggest' | 'analyze';
  context?: string;
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

    const { items, requestType, context = 'restaurant opening procedures' }: ChecklistRequest = await req.json();

    let prompt = '';
    
    switch (requestType) {
      case 'optimize':
        prompt = `Analyze this restaurant checklist and provide optimization suggestions:

Current Checklist Items:
${JSON.stringify(items, null, 2)}

Context: ${context}

Please provide optimization suggestions in JSON format with:
- priorityRecommendations: array of items that should be reprioritized with new priority levels
- sequenceOptimization: recommended order of tasks for maximum efficiency
- timeEstimates: improved time estimates based on restaurant best practices
- additionalTasks: suggested tasks that might be missing from this checklist
- efficiencyTips: specific tips to complete tasks faster or better

Focus on restaurant operational efficiency, safety, and compliance.`;
        break;

      case 'suggest':
        prompt = `Based on this restaurant checklist progress, provide helpful suggestions:

Current Status:
${JSON.stringify(items, null, 2)}

Context: ${context}

Provide actionable suggestions in JSON format with:
- immediateActions: what should be done right now based on incomplete high-priority tasks
- riskAlerts: potential risks from incomplete tasks
- resourceAllocation: how to best allocate staff and time
- qualityChecks: important quality checkpoints to add
- suggestions: general helpful tips for the current situation

Focus on maintaining food safety, service quality, and operational efficiency.`;
        break;

      case 'analyze':
        prompt = `Analyze this restaurant checklist completion and provide insights:

Checklist Data:
${JSON.stringify(items, null, 2)}

Context: ${context}

Provide analysis in JSON format with:
- completionInsights: analysis of completion patterns and efficiency
- performanceMetrics: key metrics about the checklist execution
- bottlenecks: identified bottlenecks or problem areas
- recommendations: recommendations for improvement
- compliance: assessment of safety and compliance status

Focus on operational performance and continuous improvement.`;
        break;
    }

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
          temperature: 0.4,
          topK: 1,
          topP: 1,
          maxOutputTokens: 1536,
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
    
    let result;
    try {
      result = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      // Fallback suggestions based on request type
      const completedCount = items.filter(item => item.completed).length;
      const highPriorityIncomplete = items.filter(item => !item.completed && item.priority === 'high').length;
      
      result = {
        immediateActions: highPriorityIncomplete > 0 
          ? [`Focus on ${highPriorityIncomplete} high-priority tasks first`]
          : ['Continue with remaining tasks at steady pace'],
        suggestions: [
          `${completedCount}/${items.length} tasks completed - good progress!`,
          'Maintain food safety standards throughout all tasks',
          'Communicate any delays to the team immediately'
        ]
      };
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error with AI checklist optimizer:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process checklist request',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});