import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssistantRequest {
  assistantType: string;
  message: string;
  conversationHistory?: Array<{role: 'user' | 'assistant', content: string}>;
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

    const { assistantType, message, conversationHistory = [] }: AssistantRequest = await req.json();

    const assistantContext = {
      'training-coach': 'You are an expert restaurant training and learning coach. Help with staff training, onboarding, skill development, and creating effective training programs. Focus on practical, actionable advice for restaurant management.',
      'problem-solver': 'You are a restaurant operations problem-solving expert. Help solve operational challenges with step-by-step solutions, best practices, and proven strategies for restaurant management.',
      'compliance-guide': 'You are a restaurant compliance and safety expert. Provide guidance on health codes, safety protocols, regulatory compliance, HACCP, food safety, and legal requirements for restaurants.',
      'leadership-mentor': 'You are a restaurant leadership and management mentor. Help with management techniques, team building, leadership skills, employee motivation, and creating positive workplace culture.',
      'procedure-builder': 'You are a restaurant operations procedure specialist. Help create and optimize standard operating procedures, workflows, checklists, and systematic approaches to restaurant operations.',
      'knowledge-base': 'You are a comprehensive restaurant industry knowledge expert. Provide information on best practices, industry standards, guides, trends, and proven methodologies in restaurant management.',
      'performance-coach': 'You are a restaurant performance and HR coach. Help with employee performance management, feedback systems, improvement plans, and creating high-performing restaurant teams.',
      'crisis-manager': 'You are a restaurant crisis management expert. Help handle difficult situations, customer complaints, emergency protocols, conflict resolution, and maintaining operations during challenges.',
      'research-assistant': 'You are a restaurant industry research specialist. Provide current industry trends, competitor analysis, market insights, and data-driven recommendations for restaurant success.',
      'troubleshooter': 'You are a restaurant equipment and systems troubleshooting expert. Help with equipment issues, POS systems, technical problems, and maintenance solutions for restaurant operations.',
      'transcription': 'You are an AI assistant that helps create realistic meeting transcripts. Generate natural conversation flow with professional meeting content that includes multiple speakers discussing restaurant operations, planning, and decision-making.',
      'action-items': 'You are an AI assistant specialized in extracting action items from meeting transcripts. Identify specific tasks, responsibilities, deadlines, and priorities. Always respond with a JSON array in this exact format: [{"task": "description", "assignee": "person name or null", "dueDate": "date string or null", "priority": "low|medium|high", "completed": false}]'
    };

    const systemPrompt = `${assistantContext[assistantType as keyof typeof assistantContext] || assistantContext['problem-solver']}

Always provide:
1. Practical, actionable advice
2. Specific steps when possible
3. Industry best practices
4. Safety considerations when relevant
5. Cost-effective solutions

Keep responses concise but comprehensive. Focus on real-world restaurant management challenges and solutions.`;

    // Build conversation history for context
    const conversationMessages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: conversationMessages.filter(msg => msg.role !== 'system').map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.role === 'user' ? `${systemPrompt}\n\nUser: ${msg.content}` : msg.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 1024,
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

    const assistantResponse = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ response: assistantResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error with AI assistant:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get assistant response',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});