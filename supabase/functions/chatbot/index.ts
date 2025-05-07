
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, context = [] } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Conversation history is required');
    }

    console.log('Processing chat request with messages:', JSON.stringify(messages).slice(0, 100) + '...');
    
    // Log if context was provided
    if (context.length > 0) {
      console.log('Context provided for RAG:', context.length, 'items');
    }

    // Build system message with enhanced RAG context if available
    let systemMessage = { 
      role: 'system', 
      content: 'You are a helpful, friendly, and intelligent AI assistant based on advanced Retrieval-Augmented Generation. Provide clear, concise, and accurate responses to user queries. Be supportive and engaging.' 
    };
    
    // If context is provided, enhance system message
    if (context.length > 0) {
      systemMessage.content += '\n\nThe following information has been extracted from user-provided documents and should be used as context for answering questions:\n\n' + 
        context.map((item: string) => `- ${item}`).join('\n');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          systemMessage,
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content.trim();

    console.log('Generated response:', botResponse.slice(0, 100) + '...');

    return new Response(
      JSON.stringify({ message: botResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Chatbot Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
