"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getSession,
  getAffiliates,
  saveAffiliates,
  clearSession,
  formatMoney,
  formatDate,
  recalcularTotais,
  SITE_VENDAS_URL,
} from "@/lib/affiliates";
import type { Affiliate } from "@/lib/types";
import {
  Link as LinkIcon,
  Receipt,
  Lightbulb,
  Copy,
  Check,
  Share2,
  LogOut,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Affiliate | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/");
      return;
    }
    const list = getAffiliates();
    const found = list.find((a) => a.id === session.id);
    if (!found) {
      clearSession();
      router.replace("/");
      return;
    }
    recalcularTotais(found);
    setUser({ ...found });
  }, [router]);

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  function copiarLink() {
    if (!user) return;
    const link = `${SITE_VENDAS_URL}/?ref=${user.codigo}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function compartilharNativo() {
    if (!user) return;
    const link = `${SITE_VENDAS_URL}/?ref=${user.codigo}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Cardápio Fitness VC Marmitas",
          text: "Conheça as marmitas fitness da Vani Aguiar!",
          url: link,
        })
        .catch(() => {});
    } else {
      copiarLink();
    }
  }

  function simularNovaVenda() {
    if (!user) return;
    const list = getAffiliates();
    const idx = list.findIndex((a) => a.id === user.id);
    if (idx === -1) return;

    const current = list[idx];
    const clientes = [
      "Pedro Lima",
      "Carla Mendes",
      "Rafael Souza",
      "Juliana Alves",
      "Bruno Ferreira",
    ];
    const valores = [24.9, 119.9, 229.9, 378.0];
    const valor = valores[Math.floor(Math.random() * valores.length)];
    const cliente = clientes[Math.floor(Math.random() * clientes.length)];

    const pedidosCliente = current.vendas.filter((v) => v.cliente === cliente).length;
    const numPedido = pedidosCliente + 1;
    if (numPedido > 4) {
      alert("Esse cliente já atingiu o 4º pedido (vínculo encerrado). Tente outro.");
      return;
    }

    const pctMap: Record<number, number> = { 1: 8, 2: 6, 3: 5, 4: 3 };
    const pct = pctMap[numPedido];
    const comissao = +(valor * (pct / 100)).toFixed(2);
    const bonus = numPedido === 3 || numPedido === 4 ? 15 : 0;

    current.vendas.push({
      id: "v" + Date.now(),
      cliente,
      pedido: numPedido,
      valor,
      comissaoPct: pct,
      comissao,
      bonus,
      status: Math.random() > 0.4 ? "pago" : "pendente",
      data: new Date().toISOString(),
    });

    recalcularTotais(current);
    list[idx] = current;
    saveAffiliates(list);
    setUser({ ...current });
    alert(`Venda simulada: ${cliente} · ${numPedido}º pedido · ${formatMoney(valor)}`);
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  const link = `${SITE_VENDAS_URL}/?ref=${user.codigo}`;
  const waMsg = encodeURIComponent(
    `Oi! Conheça o Cardápio Fitness Congelado da Vani Aguiar 🥗\nRefeições saudáveis e práticas entregues na sua casa.\nPeça pelo meu link: ${link}`
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-dark text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-[5%] py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold">
              {user.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xs opacity-70">Olá,</div>
              <strong>{user.nome.split(" ")[0]}</strong>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/termos" className="text-sm text-gray-300 hover:text-white">
              Regras
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-white hover:text-primary"
            >
              Sair <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-[5%] py-8">
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Comissões totais", value: formatMoney(user.totalComissao), green: true },
            { label: "Bônus", value: formatMoney(user.totalBonus || 0) },
            { label: "Clientes únicos", value: String(user.clientesUnicos || 0) },
            { label: "Pedidos", value: String(user.pedidos || 0) },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-1 text-xs text-gray-500">{s.label}</div>
              <div className={`text-2xl font-bold ${s.green ? "text-green-700" : "text-dark"}`}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-1 text-xs text-gray-500">Já recebido (pago)</div>
            <div className="text-2xl font-bold text-green-700">
              {formatMoney(user.totalPago || 0)}
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-1 text-xs text-gray-500">A receber (pendente)</div>
            <div className="text-2xl font-bold text-orange-600">
              {formatMoney(user.totalPendente || 0)}
            </div>
          </div>
        </div>

        {/* Link */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-dark">
            <LinkIcon className="h-5 w-5 text-primary" /> Seu link de indicação
          </h3>
          <p className="mb-3 text-sm text-gray-500">
            Código: <strong>{user.codigo}</strong> · Compartilhe este link. Quando o
            cliente comprar, a venda é vinculada a você.
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              readOnly
              value={link}
              className="min-w-[200px] flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm"
            />
            <button onClick={copiarLink} className="btn btn-primary">
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copiar
                </>
              )}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary !px-4 !py-2.5 !text-sm"
            >
              WhatsApp
            </a>
            <button
              onClick={compartilharNativo}
              className="btn btn-secondary !px-4 !py-2.5 !text-sm"
            >
              <Share2 className="h-4 w-4" /> Compartilhar
            </button>
          </div>
        </div>

        {/* Dados */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-dark">Seus dados</h3>
          <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <strong>E-mail:</strong>
              <br />
              {user.email}
            </div>
            <div>
              <strong>WhatsApp:</strong>
              <br />
              {user.telefone || "—"}
            </div>
            <div>
              <strong>Chave PIX:</strong>
              <br />
              {user.pix || "Não cadastrada"}
            </div>
            <div>
              <strong>Membro desde:</strong>
              <br />
              {formatDate(user.criadoEm)}
            </div>
          </div>
        </div>

        {/* Extrato */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-dark">
            <Receipt className="h-5 w-5 text-primary" /> Extrato de comissões
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2.5 font-semibold text-dark">Data</th>
                  <th className="px-3 py-2.5 font-semibold text-dark">Cliente</th>
                  <th className="px-3 py-2.5 font-semibold text-dark">Pedido</th>
                  <th className="px-3 py-2.5 font-semibold text-dark">Valor</th>
                  <th className="px-3 py-2.5 font-semibold text-dark">%</th>
                  <th className="px-3 py-2.5 font-semibold text-dark">Comissão + Bônus</th>
                  <th className="px-3 py-2.5 font-semibold text-dark">Status</th>
                </tr>
              </thead>
              <tbody>
                {user.vendas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">
                      Nenhuma venda registrada ainda.
                      <br />
                      Compartilhe seu link!
                    </td>
                  </tr>
                ) : (
                  [...user.vendas]
                    .sort(
                      (a, b) =>
                        new Date(b.data).getTime() - new Date(a.data).getTime()
                    )
                    .map((v) => (
                      <tr key={v.id} className="border-b border-gray-100">
                        <td className="px-3 py-2.5">{formatDate(v.data)}</td>
                        <td className="px-3 py-2.5">{v.cliente}</td>
                        <td className="px-3 py-2.5">{v.pedido}º</td>
                        <td className="px-3 py-2.5">{formatMoney(v.valor)}</td>
                        <td className="px-3 py-2.5">{v.comissaoPct}%</td>
                        <td className="px-3 py-2.5">
                          {formatMoney(v.comissao + (v.bonus || 0))}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              v.status === "pago"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {v.status === "pago" ? "Pago" : "Pendente"}
                          </span>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dica */}
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-dark">
            <Lightbulb className="h-5 w-5 text-primary" /> Dica de vendas
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            O Kit 10 Marmitas (R$ 229,90) é o mais vendido. Foque nele nas suas
            indicações.
            <br />
            Lembre-se: o vínculo com o cliente dura até o 4º pedido ou 90 dias.
          </p>
          <button
            onClick={simularNovaVenda}
            className="btn btn-secondary !px-5 !py-2.5 !text-sm"
          >
            <Plus className="h-4 w-4" /> Simular nova venda (demo)
          </button>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        &copy; 2026 Vani Aguiar Personal Chef · Portal de Afiliados
      </footer>
    </div>
  );
}
