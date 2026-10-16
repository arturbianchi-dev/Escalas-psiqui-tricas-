// Configuração pública do Supabase. Use apenas a Project URL e a chave anon/publishable.
// Nunca coloque service_role keys, senhas ou segredos administrativos neste arquivo.
window.TEAM_BIANCHI_SUPABASE_URL = 'COLE_AQUI_A_SUPABASE_PROJECT_URL';
window.TEAM_BIANCHI_SUPABASE_ANON_KEY = 'COLE_AQUI_A_CHAVE_ANON_OU_PUBLISHABLE';
window.teamBianchiSupabase = (window.supabase && window.TEAM_BIANCHI_SUPABASE_URL.startsWith('https://') && window.TEAM_BIANCHI_SUPABASE_ANON_KEY.startsWith('eyJ'))
 ? window.supabase.createClient(window.TEAM_BIANCHI_SUPABASE_URL, window.TEAM_BIANCHI_SUPABASE_ANON_KEY)
 : null;
