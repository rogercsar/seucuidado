# SeuCuidado - Conectando você ao cuidado certo

SeuCuidado é uma plataforma web full-stack desenvolvida para conectar pessoas a profissionais da área da saúde para atendimentos domiciliares (home care). O projeto foi construído com Next.js, TypeScript, TailwindCSS, Supabase e Mercado Pago, com foco em usabilidade, empatia e confiança.

---

## 🚀 Começando

Estas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Uma conta no [Supabase](https://supabase.com/)
- Uma conta no [Mercado Pago](https://mercadopago.com.br/)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seucuidado.git
    cd seucuidado
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    - Renomeie o arquivo `.env.local.example` para `.env.local`.
    - Preencha as variáveis com suas chaves do Supabase e Mercado Pago.

    ```env
    # Supabase (o prefixo NEXT_PUBLIC_ é OBRIGATÓRIO)
    NEXT_PUBLIC_SUPABASE_URL=SUA_URL_DO_SUPABASE
    NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_DO_SUPABASE

    # Mercado Pago (chaves do modo Sandbox para desenvolvimento)
    MERCADO_PAGO_ACCESS_TOKEN=SEU_ACCESS_TOKEN_DO_MERCADO_PAGO
    NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=SUA_PUBLIC_KEY_DO_MERCADO_PAGO
    ```

4.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

---

## 🔑 Configuração das Chaves

### Supabase

1.  Crie um novo projeto no [Supabase](https://app.supabase.io).
2.  Vá para **Project Settings > API**.
3.  Copie a **Project URL** e a **anon public key** e cole-as no seu arquivo `.env.local`. **Lembre-se de manter o prefixo `NEXT_PUBLIC_`**.
4.  **Tabelas do Banco de Dados:**
    - Vá para o **Table Editor** e crie as tabelas necessárias. Para o MVP, a tabela `messages` é essencial para o chat.
    - **Tabela `messages`:**
        - `id` (int8, primary key, identity)
        - `created_at` (timestamptz, default: `now()`)
        - `user_id` (uuid, foreign key para `auth.users(id)`)
        - `chat_id` (text)
        - `content` (text)
    - **Habilite o RLS (Row Level Security)** para as tabelas e configure as políticas de acesso conforme necessário (ex: usuários só podem ver e escrever suas próprias mensagens).

### Mercado Pago

1.  Acesse o [Painel de Desenvolvedores](https://www.mercadopago.com.br/developers) do Mercado Pago.
2.  Vá para **Suas Aplicações** e crie uma nova aplicação.
3.  Em **Credenciais de teste**, você encontrará o **Access Token** e a **Public Key**. Use estas credenciais no seu arquivo `.env.local`.

---

## 🚀 Deploy na Netlify

Este projeto está configurado para um deploy integrado (frontend e backend) na Netlify.

1.  **Conecte seu repositório Git:**
    - Faça o login na [Netlify](https://app.netlify.com/).
    - Clique em "Add new site" > "Import an existing project" e selecione seu provedor Git.
    - Escolha o repositório do SeuCuidado.

2.  **Configurações de Build:**
    - A Netlify deve detectar automaticamente que é um projeto Next.js. As configurações padrão geralmente funcionam:
        - **Build command:** `npm run build`
        - **Publish directory:** `.next`

3.  **Adicione as Variáveis de Ambiente:**
    - Vá para **Site settings > Build & deploy > Environment**.
    - Adicione as mesmas variáveis de ambiente que você configurou no seu arquivo `.env.local`.
    - **IMPORTANTE:** Para as variáveis do Supabase, certifique-se de que os nomes das variáveis na Netlify incluam o prefixo `NEXT_PUBLIC_` (ex: `NEXT_PUBLIC_SUPABASE_URL`).

4.  **Clique em "Deploy site"**.
    - A Netlify irá construir e fazer o deploy do seu site. As funções da API (como a de criar preferência de pagamento) estarão disponíveis automaticamente como Netlify Functions.

---

## 🔧 Troubleshooting

### Erro: `Missing Supabase URL or anonymous key.` no Navegador

Se a navegação para o login/cadastro não funcionar e você vir este erro no console do navegador, significa que as variáveis de ambiente do Supabase não foram configuradas corretamente no seu serviço de deploy (Netlify).

**Solução:**
1.  Vá para o painel do seu site na Netlify.
2.  Navegue até **Site settings > Build & deploy > Environment**.
3.  Verifique se as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` existem e se os valores estão corretos.
4.  **É crucial que os nomes das variáveis na Netlify sejam exatamente iguais aos do arquivo `.env.local`, incluindo o prefixo `NEXT_PUBLIC_`**.
5.  Após adicionar ou corrigir as variáveis, vá para a aba **Deploys** e acione um novo deploy clicando em "Trigger deploy" > "Deploy site".

---

## ⚙️ Stack Tecnológica

- **Framework:** [Next.js](https://nextjs.org/) (React, TypeScript)
- **Estilização:** [TailwindCSS](https://tailwindcss.com/)
- **Banco de Dados & Autenticação:** [Supabase](https://supabase.io/)
- **Pagamentos:** [Mercado Pago](https://www.mercadopago.com.br/developers)
- **Hospedagem:** [Netlify](https://www.netlify.com/)
