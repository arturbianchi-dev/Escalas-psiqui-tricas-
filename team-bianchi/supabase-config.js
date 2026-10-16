// Configuração pública do Supabase. Use apenas a Project URL e a chave anon/publishable.
// Nunca coloque service_role keys, senhas ou segredos administrativos neste arquivo.
window.TEAM_BIANCHI_SUPABASE_URL = 'https://lsoyimrnsisfeigfvjoe.supabase.co';
window.TEAM_BIANCHI_SUPABASE_ANON_KEY = 'sb_publishable_0wz_7zW42vToZfEhccktHg_MrfWWJeQ';
window.teamBianchiSupabase = (window.supabase && window.TEAM_BIANCHI_SUPABASE_URL.startsWith('https://') && (window.TEAM_BIANCHI_SUPABASE_ANON_KEY.startsWith('eyJ') || window.TEAM_BIANCHI_SUPABASE_ANON_KEY.startsWith('sb_publishable_')))
 ? window.supabase.createClient(window.TEAM_BIANCHI_SUPABASE_URL, window.TEAM_BIANCHI_SUPABASE_ANON_KEY)
 : null;
