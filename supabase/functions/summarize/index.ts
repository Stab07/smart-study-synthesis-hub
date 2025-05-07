
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
    const { text, length = 'medium' } = await req.json();

    if (!text) {
      throw new Error('Text is required for summarization');
    }

    console.log('Processing summarization request for text of length:', text.length, 'with summary length:', length);

    // Configure system message based on length parameter
    let systemMessage = 'You are an expert summarizer using the PEGASUS model approach. ';
    
    switch(length) {
      case 'short':
        systemMessage += 'Create a very concise summary focusing only on the most essential points. The summary should be around 2-3 sentences.';
        break;
      case 'long':
        systemMessage += 'Create a detailed summary that covers all main points and important supporting details. The summary should be comprehensive while still being more concise than the original.';
        break;
      case 'medium':
      default:
        systemMessage += 'Provide a concise, clear summary that captures the key points of the text. Focus on the main ideas and essential information.';
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
          { 
            role: 'system', 
            content: systemMessage
          },
          { 
            role: 'user', 
            content: `Please summarize the following text:\n\n${text}` 
          }
        ],
        temperature: 0.5,
        max_tokens: length === 'short' ? 150 : (length === 'long' ? 600 : 300)
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content.trim();

    console.log('Generated summary of length:', summary.length);

    return new Response(
      JSON.stringify({ summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Summarization Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
