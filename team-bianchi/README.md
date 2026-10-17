# Team Bianchi — ativar autenticação e API

O front-end usa Supabase Auth + Postgres. O repositório estático do GitHub Pages não consegue enviar e-mails nem manter contas sozinho.

## 1. Criar o projeto
1. Crie um projeto em https://supabase.com/.
2. Em **Project Settings → API** (ou Connect), copie a Project URL e a chave **anon/publishable**.
3. Edite `team-bianchi/supabase-config.js` e substitua os dois valores de exemplo. Essa chave pública pode estar no front-end apenas porque as tabelas usam RLS. **Nunca use a chave service_role.**

## 2. Criar as tabelas e políticas
No Supabase, abra **SQL Editor**, cole o conteúdo de `team-bianchi/supabase-schema.sql` e execute.

## 3. Ativar confirmação de e-mail
Em **Authentication → Providers → Email**, mantenha a confirmação de e-mail habilitada. Em **URL Configuration**, adicione:
- Site URL: `https://arturbianchi-dev.github.io/Escalas-psiqui-tricas-/team-bianchi/`
- Redirect URL: `https://arturbianchi-dev.github.io/Escalas-psiqui-tricas-/team-bianchi/index.html`
Ajuste a URL se o endereço de Pages do repositório for diferente. Para entrega real de e-mails, configure SMTP próprio em Authentication → SMTP Settings; o serviço padrão tem limitações de envio.

## 4. Autorizar o administrador
1. Na tela do app, abra **Administrador** e cadastre o e-mail do responsável.
2. Confirme o e-mail recebido.
3. No SQL Editor do Supabase, execute (substituindo o e-mail):
```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'SEU_EMAIL_ADMIN');
```
O cadastro público de administrador **não concede privilégios automaticamente**. Isso impede que qualquer visitante vire administrador. Depois, o responsável entra pela aba Administrador.

## 5. Atualizar o banco para o painel e chat compartilhado\n\nSe você já executou uma versão anterior do SQL, execute novamente o arquivo atualizado `supabase-schema.sql` no SQL Editor. Ele cria a tabela `chat_messages` e as políticas para o administrador consultar alunos e trocar mensagens individualmente.\n\n## 8. Publicar
Faça commit dos arquivos e aguarde o GitHub Pages atualizar. A autenticação só funcionará depois dos passos acima.

## O que esta versão faz
- cadastro e login por e-mail/senha;
- confirmação de e-mail e recuperação de senha;
- entrada de administrador separada e autorização de função no banco;
- área interna protegida por sessão;
- dados do plano sincronizados por conta em `user_app_data`.

O administrador pode selecionar um aluno no painel **Alunos**, editar o plano de treino/dieta dele e conversar pelo chat individual. Para refletir alterações, é necessário que o esquema SQL atualizado tenha sido executado no Supabase.
