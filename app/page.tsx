"use client";

import { useState } from "react";
import Link from "next/link";
import AuthModal from "@/components/AuthModal";
import {
  Percent,
  Gift,
  Rocket,
  Link as LinkIcon,
  ChartLine,
  Wallet,
  UserPlus,
  Share2,
  Banknote,
} from "lucide-react";

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "cadastro">("login");

  function openAuth(mode: "login" | "cadastro") {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <>
      {/* Top nav */}
      <div className="bg-dark text-white py-3 text-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-[5%]">
          <span>Programa de Afiliados VC Marmitas</span>
          <div className="flex gap-5">
            <Link href="/termos" className="hover:text-primary">
              Regras
            </Link>
            <button onClick={() => openAuth("login")} className="hover:text-primary">
              Entrar
            </button>
            <button
              onClick={() => openAuth("cadastro")}
              className="font-semibold text-primary"
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <header className="bg-gradient-to-br from-dark to-[#2d2d2d] py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-[5%]">
          <div className="mb-5 text-2xl font-bold">
            VC <span className="text-primary">Marmitas</span>
          </div>
          <span className="mb-5 inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
            Ganhe comissão indicando refeições saudáveis
          </span>
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
            Transforme indicações em renda extra
          </h1>
          <p className="mb-8 text-lg text-gray-300">
            Indique o Cardápio Fitness Congelado da Vani Aguiar e receba
            comissões de até 8% + bônus por recorrência. Simples, transparente e
            100% online.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openAuth("cadastro")}
              className="btn btn-primary btn-large"
            >
              Quero ser Afiliado <Rocket className="h-5 w-5" />
            </button>
            <Link href="/termos" className="btn btn-secondary btn-large">
              Ver Regras
            </Link>
          </div>
        </div>
      </header>

      {/* Benefícios */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-[5%]">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold text-dark">Por que ser afiliado?</h2>
            <p className="text-gray-500">Vantagens pensadas para quem quer faturar de verdade</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Percent,
                title: "Comissão progressiva",
                text: "8% no 1º pedido, 6% no 2º, 5% no 3º e 3% no 4º. Você ganha enquanto o cliente compra.",
              },
              {
                icon: Gift,
                title: "Bônus de recorrência",
                text: "R$ 15 extras no 3º e no 4º pedido do mesmo cliente. Fidelização paga.",
              },
              {
                icon: Rocket,
                title: "Acelerador inicial",
                text: "Nos primeiros 7 dias, 3 clientes válidos = bônus de R$ 20. Comece ganhando rápido.",
              },
              {
                icon: LinkIcon,
                title: "Link exclusivo",
                text: "Gere seu link personalizado e compartilhe no WhatsApp, Instagram ou onde quiser.",
              },
              {
                icon: ChartLine,
                title: "Dashboard completo",
                text: "Acompanhe vendas, comissões e extrato em tempo real na sua área logada.",
              },
              {
                icon: Wallet,
                title: "Pagamento via PIX",
                text: "Comissões liberadas após entrega confirmada. Você cadastra sua chave PIX.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1"
              >
                <item.icon className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-lg font-bold text-dark">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabela de comissões */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-3xl px-[5%]">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-dark">Tabela de Comissionamento</h2>
            <p className="text-gray-500">Valores sobre o total pago em produtos (pedido mínimo R$ 45)</p>
          </div>
          <div className="overflow-hidden rounded-xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-dark text-white">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Pedido do Cliente</th>
                  <th className="px-5 py-3.5 font-semibold">Comissão</th>
                  <th className="px-5 py-3.5 font-semibold">Bônus extra</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1º Pedido", "8%", "—"],
                  ["2º Pedido", "6%", "—"],
                  ["3º Pedido", "5%", "R$ 15,00"],
                  ["4º Pedido", "3%", "R$ 15,00"],
                ].map(([pedido, pct, bonus]) => (
                  <tr key={pedido} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-3.5 font-medium">{pedido}</td>
                    <td className="px-5 py-3.5">{pct}</td>
                    <td className="px-5 py-3.5">{bonus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">
            * O vínculo se encerra automaticamente após o 4º pedido (ou 90 dias).
          </p>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-[5%]">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold text-dark">Como funciona</h2>
            <p className="text-gray-500">Em 3 passos simples</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: UserPlus,
                title: "1. Cadastre-se",
                text: "Crie sua conta grátis, receba seu código e link de indicação.",
              },
              {
                icon: Share2,
                title: "2. Compartilhe",
                text: "Envie o link para amigos, grupos ou redes sociais. O cliente compra normalmente.",
              },
              {
                icon: Banknote,
                title: "3. Receba",
                text: "Acompanhe no dashboard e receba as comissões via PIX após a entrega.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"
              >
                <item.icon className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-lg font-bold text-dark">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-dark to-black py-20 text-center text-white">
        <div className="mx-auto max-w-xl px-[5%]">
          <h2 className="mb-4 text-3xl font-bold">Pronto para faturar?</h2>
          <p className="mb-8 text-gray-300">
            Junte-se ao time de afiliados da Vani Aguiar e transforme cada
            indicação em comissão.
          </p>
          <button
            onClick={() => openAuth("cadastro")}
            className="btn btn-primary btn-large"
          >
            Criar minha conta grátis
          </button>
        </div>
      </section>

      <footer className="border-t border-gray-800 bg-black py-8 text-center text-sm text-gray-500">
        <p>
          &copy; 2026 Vani Aguiar Personal Chef ·{" "}
          <Link href="/termos" className="text-gray-400 hover:text-primary">
            Termos do Programa
          </Link>
        </p>
      </footer>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
