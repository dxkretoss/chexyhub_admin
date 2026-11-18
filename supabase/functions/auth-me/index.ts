import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyJwt } from '../_shared/jwt.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or malformed Bearer authorization token.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const jwtSecret = Deno.env.get('JWT_SECRET') || 'chexyhub-atelier-default-secret-key-2026!';
    const decoded = await verifyJwt(token, jwtSecret);

    if (!decoded || !decoded.sub) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired Bearer token.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let user = null;
    if (decoded.role === 'super_admin' || decoded.role === 'admin') {
      const { data } = await supabase
        .from('admins')
        .select('id, name, email, role, avatar, created_at')
        .eq('id', decoded.sub)
        .single();
      user = data;
    } else {
      const { data } = await supabase
        .from('users')
        .select('id, name, email, phone, avatar, role, created_at')
        .eq('id', decoded.sub)
        .single();
      user = data;
    }

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User record not found.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, user }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Verification failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
