export interface Venda {
  id: string;
  cliente: string;
  pedido: number;
  valor: number;
  comissaoPct: number;
  comissao: number;
  bonus: number;
  status: "pago" | "pendente";
  data: string;
}

export interface Affiliate {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  pix: string;
  senha: string; // demo only
  codigo: string;
  criadoEm: string;
  vendas: Venda[];
  totalComissao: number;
  totalBonus: number;
  clientesUnicos?: number;
  pedidos?: number;
  totalPago?: number;
  totalPendente?: number;
}

export interface Session {
  id: string;
  nome: string;
  email: string;
  codigo: string;
}
