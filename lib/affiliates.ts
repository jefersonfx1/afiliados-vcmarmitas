import type { Affiliate, Session, Venda } from "./types";

const STORAGE_KEY = "vcm_afiliados";
const SESSION_KEY = "vcm_afiliado_logado";

// URL base do site de vendas (ajuste quando tiver o domínio real)
export const SITE_VENDAS_URL = "https://vcmarmitas.com.br";

export function getAffiliates(): Affiliate[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveAffiliates(list: Affiliate[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function setSession(user: Session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function generateCode(nome: string): string {
  const base = (nome || "AFF").substring(0, 4).toUpperCase().replace(/\s/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return base + rand;
}

export function formatMoney(v: number): string {
  return (
    "R$ " +
    Number(v)
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

export function formatDate(iso: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function recalcularTotais(user: Affiliate): void {
  user.totalComissao = user.vendas.reduce((s, v) => s + (v.comissao || 0), 0);
  user.totalBonus = user.vendas.reduce((s, v) => s + (v.bonus || 0), 0);
  user.clientesUnicos = [...new Set(user.vendas.map((v) => v.cliente))].length;
  user.pedidos = user.vendas.length;
  user.totalPago = user.vendas
    .filter((v) => v.status === "pago")
    .reduce((s, v) => s + (v.comissao || 0) + (v.bonus || 0), 0);
  user.totalPendente = user.vendas
    .filter((v) => v.status === "pendente")
    .reduce((s, v) => s + (v.comissao || 0) + (v.bonus || 0), 0);
}

export function gerarVendasDemo(): Venda[] {
  const agora = Date.now();
  return [
    {
      id: "v1",
      cliente: "Maria Silva",
      pedido: 1,
      valor: 119.9,
      comissaoPct: 8,
      comissao: 9.59,
      bonus: 0,
      status: "pago",
      data: new Date(agora - 86400000 * 12).toISOString(),
    },
    {
      id: "v2",
      cliente: "Maria Silva",
      pedido: 2,
      valor: 229.9,
      comissaoPct: 6,
      comissao: 13.79,
      bonus: 0,
      status: "pago",
      data: new Date(agora - 86400000 * 5).toISOString(),
    },
    {
      id: "v3",
      cliente: "João Santos",
      pedido: 1,
      valor: 378.0,
      comissaoPct: 8,
      comissao: 30.24,
      bonus: 0,
      status: "pendente",
      data: new Date(agora - 86400000 * 2).toISOString(),
    },
    {
      id: "v4",
      cliente: "Ana Costa",
      pedido: 1,
      valor: 119.9,
      comissaoPct: 8,
      comissao: 9.59,
      bonus: 0,
      status: "pago",
      data: new Date(agora - 86400000 * 1).toISOString(),
    },
  ];
}

export function createAffiliate(data: {
  nome: string;
  email: string;
  telefone: string;
  pix: string;
  senha: string;
}): Affiliate {
  const novo: Affiliate = {
    id: Date.now().toString(36),
    nome: data.nome,
    email: data.email,
    telefone: data.telefone,
    pix: data.pix,
    senha: data.senha,
    codigo: generateCode(data.nome),
    criadoEm: new Date().toISOString(),
    vendas: gerarVendasDemo(),
    totalComissao: 0,
    totalBonus: 0,
  };
  recalcularTotais(novo);
  return novo;
}
