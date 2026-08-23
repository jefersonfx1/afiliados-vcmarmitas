"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAffiliates,
  saveAffiliates,
  setSession,
  createAffiliate,
} from "@/lib/affiliates";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: "login" | "cadastro";
}

export default function AuthModal({
  open,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const router = useRouter();
  const [modo, setModo] = useState<"login" | "cadastro">(initialMode);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [pix, setPix] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function trocarModo() {
    setModo((m) => (m === "login" ? "cadastro" : "login"));
    setErro("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const emailClean = email.trim().toLowerCase();

    if (!emailClean || senha.length < 6) {
      setErro("Preencha e-mail e senha (mínimo 6 caracteres).");
      setLoading(false);
      return;
    }

    const list = getAffiliates();

    if (modo === "cadastro") {
      if (!nome.trim() || !telefone.trim()) {
        setErro("Nome e WhatsApp são obrigatórios.");
        setLoading(false);
        return;
      }
      if (list.find((a) => a.email === emailClean)) {
        setErro("Já existe uma conta com este e-mail.");
        setLoading(false);
        return;
      }

      const novo = createAffiliate({
        nome: nome.trim(),
        email: emailClean,
        telefone: telefone.trim(),
        pix: pix.trim(),
        senha,
      });

      list.push(novo);
      saveAffiliates(list);
      setSession({
        id: novo.id,
        nome: novo.nome,
        email: novo.email,
        codigo: novo.codigo,
      });
      onClose();
      router.push("/dashboard");
    } else {
      const user = list.find(
        (a) => a.email === emailClean && a.senha === senha
      );
      if (!user) {
        setErro("E-mail ou senha incorretos.");
        setLoading(false);
        return;
      }
      setSession({
        id: user.id,
        nome: user.nome,
        email: user.email,
        codigo: user.codigo,
      });
      onClose();
      router.push("/dashboard");
    }

    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-700"
        >
          &times;
        </button>

        <h2 className="mb-6 text-center text-xl font-bold text-dark">
          {modo === "cadastro" ? "Criar Conta de Afiliado" : "Entrar na Conta"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {modo === "cadastro" && (
            <>
              <input
                type="text"
                placeholder="Seu Nome Completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <input
                type="tel"
                placeholder="WhatsApp (DDD + Número)"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Chave PIX (e-mail, CPF ou telefone)"
                value={pix}
                onChange={(e) => setPix(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Seu E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="password"
            placeholder="Sua Senha (mín. 6 caracteres)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />

          {erro && (
            <p className="text-sm text-red-600">{erro}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading
              ? "Aguarde..."
              : modo === "cadastro"
              ? "Cadastrar"
              : "Entrar"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-500">
          {modo === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
          <button onClick={trocarModo} className="btn-link">
            {modo === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
