# Publicação do backend de convites — Team Bianchi

O front-end já chama a Edge Function `invite-user`. Para o convite por e-mail funcionar, publique esta função no projeto Supabase.

## Opção recomendada: Supabase CLI

Na pasta que contém a pasta `supabase/`, faça login e vincule o projeto:

```bash
supabase login
supabase link --project-ref lsoyimrnsisfeigfvjoe
supabase secrets set SUPABASE_URL=https://lsoyimrnsisfeigfvjoe.supabase.co
supabase secrets set SUPABASE_ANON_KEY=SEU_PUBLISHABLE_OU_ANON_KEY
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=SUA_SECRET_SERVICE_ROLE_KEY
supabase functions deploy invite-user
```

A chave `SUPABASE_SERVICE_ROLE_KEY` é secreta e deve ser configurada somente nos secrets do backend. Nunca a coloque em HTML, JavaScript público, GitHub ou no campo de configuração do navegador. Não compartilhe essa chave no chat.

Opcionalmente, defina `INVITE_REDIRECT_URL` como:
`https://arturbianchi-dev.github.io/Escalas-psiqui-tricas-/team-bianchi/index.html`

## Dashboard

Se não puder usar o CLI, abra Supabase → Edge Functions e crie uma função chamada `invite-user`, copiando o conteúdo de `supabase/functions/invite-user/index.ts`. Configure os mesmos secrets em Edge Functions → Secrets e publique.

## Teste após publicar

1. Entre no app com uma conta cujo `profiles.role` seja `admin`.
2. Abra a aba **Alunos**.
3. Convide um e-mail que ainda não tenha conta.
4. Confirme que o e-mail chegou e que o link de confirmação volta para a página do Team Bianchi.
5. Teste o chat individual e o coletivo com duas contas diferentes.

A função verifica a sessão e consulta o papel do usuário no banco antes de usar a chave administrativa. O navegador nunca recebe a chave service-role.
