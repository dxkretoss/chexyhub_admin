import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { signJwt } from '../_shared/jwt.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and password are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
    const jwtSecret = Deno.env.get('JWT_SECRET') || 'chexyhub-atelier-default-secret-key-2026!';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call custom PostgreSQL RPC function with crypt blowfish hashing
    const { data: user, error } = await supabase.rpc('custom_user_register', {
      p_name: name,
      p_email: email,
      p_password: password,
      p_phone: phone || null,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sign custom JWT Bearer token
    const token = await signJwt(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: 'customer',
      },
      jwtSecret
    );

    return new Response(
      JSON.stringify({ success: true, token, user }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
