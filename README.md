# Afiliados VC Marmitas | Vani Aguiar Personal Chef

Portal de afiliados do **VC Marmitas / Vani Aguiar** — agora em **Next.js 15 + TypeScript + Tailwind CSS**.

**Repositório:** https://github.com/jefersonfx1/afiliados-vcmarmitas  
**Site de vendas principal:** https://github.com/jefersonfx1/vcmarmitas

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (ícones)
- localStorage (demo — pronto para migrar para Supabase)

## Funcionalidades

- Landing page de atração de afiliados
- Cadastro e Login (modal)
- Dashboard do afiliado
  - Link de indicação personalizado (`?ref=SEUCODIGO`)
  - Stats: comissões, bônus, pago vs pendente, clientes, pedidos
  - Extrato detalhado de vendas
  - Dados do afiliado (e-mail, WhatsApp, PIX)
  - Compartilhar no WhatsApp + share nativo
  - Simulador de vendas (demo)
- Página de Regras e Termos do programa

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Estrutura

```
app/
  page.tsx              # Landing
  dashboard/page.tsx    # Área logada
  termos/page.tsx       # Regras
  layout.tsx
  globals.css
components/
  AuthModal.tsx
lib/
  types.ts
  affiliates.ts         # storage + helpers
```

## Integração com o site de vendas

No site principal (`vcmarmitas`), capture o `?ref=`:

```ts
const urlParams = new URLSearchParams(window.location.search);
const ref = urlParams.get("ref");
if (ref) {
  localStorage.setItem("afiliado_ref", ref);
  document.cookie = `afiliado_ref=${ref}; max-age=7776000; path=/`;
}
```

E envie o `ref` junto com o pedido no checkout.

## Próximos passos

1. Conectar ao mesmo projeto Supabase do site de vendas
2. Criar tabelas `affiliates`, `orders`, `commissions`
3. Substituir localStorage por Supabase Auth
4. Painel admin para aprovar e pagar comissões

---

© 2026 Vani Aguiar Personal Chef
