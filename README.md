# Afiliados VC Marmitas | Vani Aguiar Personal Chef

Sistema completo de afiliados para o site de vendas de marmitas fitness **VC Marmitas / Vani Aguiar**.

**Repositório:** https://github.com/jefersonfx1/afiliados-vcmarmitas  
**Site de vendas principal:** https://github.com/jefersonfx1/vcmarmitas

## Funcionalidades

- **Landing page** de atração de afiliados
- **Cadastro e Login** (demo com localStorage — pronto para integrar Supabase)
- **Dashboard do afiliado**
  - Link de indicação personalizado (`?ref=SEUCODIGO`)
  - Resumo de comissões, bônus, pago vs pendente
  - Extrato detalhado de vendas
  - Contador de clientes e pedidos
  - Dados do afiliado (e-mail, WhatsApp, PIX)
  - Botões de compartilhar (WhatsApp + nativo)
  - Simulador de vendas (para testes)
- **Regras e Termos** completos do programa (comissões 8%→3%, bônus de recorrência, acelerador inicial)
- Design responsivo alinhado à identidade visual do site principal

## Como funciona o tracking

1. Afiliado gera link: `https://vcmarmitas.com.br/?ref=CODIGO`
2. Cliente acessa e o código é salvo (cookie / localStorage / session)
3. No checkout do site principal, o `ref` é enviado junto com o pedido
4. Backend (ou planilha / Supabase) registra a venda vinculada ao afiliado
5. Comissão é calculada conforme a tabela de regras

> **Importante:** Este repositório contém o **portal do afiliado**.  
> O site de vendas principal precisa de um pequeno ajuste para capturar o `?ref=` e gravar o vínculo (snippet de exemplo abaixo).

## Estrutura do projeto

```
afiliados-vcmarmitas/
├── index.html          # Landing + Login/Cadastro
├── dashboard.html      # Área logada
├── termos.html         # Regras do programa
├── css/
│   └── style.css
├── js/
│   └── app.js           # Auth, dashboard, mock de vendas
└── README.md
```

## Como rodar localmente

Basta abrir os arquivos HTML em um navegador ou usar um servidor local:

```bash
npx serve .
# ou
python -m http.server 8080
```

## Integração com o site de vendas (snippet)

Coloque no `script-vendas.js` (ou equivalente) do site principal **vcmarmitas**:

```js
// Captura ref da URL e salva
const urlParams = new URLSearchParams(window.location.search);
const ref = urlParams.get('ref');
if (ref) {
  localStorage.setItem('afiliado_ref', ref);
  // cookie com 90 dias (janela de vínculo)
  document.cookie = `afiliado_ref=${ref}; max-age=7776000; path=/`;
}

// No momento de enviar o pedido (WhatsApp ou backend):
const afiliado = localStorage.getItem('afiliado_ref') || '';
// incluir no payload / mensagem do WhatsApp, ex:
// `Afiliado: ${afiliado}`
```

## Próximos passos recomendados

1. Conectar ao mesmo projeto Supabase do site de vendas
2. Criar tabelas: `affiliates`, `orders`, `commissions`
3. Substituir localStorage por autenticação real (Supabase Auth)
4. Painel admin para aprovar comissões e pagar via PIX
5. Webhook ou função que calcula comissão automaticamente ao confirmar entrega

---

© 2026 Vani Aguiar Personal Chef
