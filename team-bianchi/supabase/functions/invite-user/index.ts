// Supabase Edge Function: invite-user
// Deploy with: supabase functions deploy invite-user
// Configure secrets: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Método não permitido." }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anonKey || !serviceKey) {
      return new Response(JSON.stringify({ error: "Configuração de secrets incompleta no backend." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Autenticação necessária." }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false, autoRefreshToken: false } });
    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Sessão inválida. Entre novamente." }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const adminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: profile, error: profileError } = await adminClient.from("profiles").select("role").eq("id", authData.user.id).maybeSingle();
    if (profileError || profile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Somente administradores autorizados podem convidar alunos." }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const payload = await req.json();
    const email = String(payload?.email ?? "").trim().toLowerCase();
    const fullName = String(payload?.full_name ?? "").trim().slice(0, 120);
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || email.length > 254 || !fullName) {
      return new Response(JSON.stringify({ error: "Informe nome completo e um e-mail válido." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const redirectTo = Deno.env.get("INVITE_REDIRECT_URL") || "https://arturbianchi-dev.github.io/Escalas-psiqui-tricas-/team-bianchi/index.html";
    const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName, requested_role: "user" },
      redirectTo,
    });
    if (error) {
      const status = /already|registered|exists/i.test(error.message) ? 409 : 400;
      return new Response(JSON.stringify({ error: status === 409 ? "Esse e-mail já possui uma conta. Use a opção de chat na lista de usuários." : error.message }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // The database trigger creates the profile with role='user'; never trust a role sent by the browser.
    return new Response(JSON.stringify({ ok: true, invited: data.user?.email ?? email }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (_error) {
    return new Response(JSON.stringify({ error: "Não foi possível processar o convite." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
