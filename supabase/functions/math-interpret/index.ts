
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
    const { formula } = await req.json();

    if (!formula) {
      throw new Error('Mathematical formula is required');
    }

    console.log('Processing mathematical formula interpretation request:', formula);

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
            content: 'You are an expert in mathematics and physics. Your task is to interpret mathematical formulas and explain them in plain language. Provide clear explanations about what each formula means, what each variable represents, and how the formula is used in practice. Also mention any historical context or importance of the formula if relevant.'
          },
          { 
            role: 'user', 
            content: `Please explain this mathematical formula in plain language: ${formula}` 
          }
        ],
        temperature: 0.3,
        max_tokens: 400
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const interpretation = data.choices[0].message.content.trim();

    console.log('Generated interpretation length:', interpretation.length);

    return new Response(
      JSON.stringify({ interpretation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Mathematical Formula Interpretation Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
