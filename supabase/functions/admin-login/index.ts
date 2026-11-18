import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { signJwt } from '../_shared/jwt.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Please enter administrator credentials.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
    const jwtSecret = Deno.env.get('JWT_SECRET') || 'chexyhub-atelier-default-secret-key-2026!';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call custom PostgreSQL RPC function with crypt blowfish verification
    const { data: admin, error } = await supabase.rpc('custom_admin_login', {
      p_email: email,
      p_password: password,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sign custom Admin JWT Bearer token
    const token = await signJwt(
      {
        sub: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role || 'super_admin',
      },
      jwtSecret
    );

    return new Response(
      JSON.stringify({ success: true, token, user: admin }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Administrator authentication failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
