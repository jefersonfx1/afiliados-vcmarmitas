import Link from "next/link";
import { Percent, Gift, Rocket, Shield, ArrowLeft } from "lucide-react";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-dark to-[#2d2d2d] py-12 text-center text-white">
        <div className="mx-auto max-w-3xl px-[5%]">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao Início
          </Link>
          <div className="mb-4 text-2xl font-bold">
            VC <span className="text-primary">Marmitas</span>
          </div>
          <h1 className="mb-3 text-3xl font-bold">Regras do Programa de Afiliados</h1>
          <p className="text-gray-300">
            Leia atentamente as diretrizes abaixo para aproveitar ao máximo o
            programa.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-[5%] py-12">
        {/* 1 */}
        <div className="mb-6 rounded-2xl bg-white p-8 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-primary">
            <Percent className="h-5 w-5" /> 1. Estrutura de Comissionamento
          </h3>
          <p className="mb-4 text-gray-600">
            O afiliado recebe comissões percentuais sobre o valor total do pedido
            das marmitas congeladas e adicionais efetuados pelos seus indicados:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 font-semibold text-dark">
                    Pedido do Cliente
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold text-dark">
                    Comissão
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold text-dark">
                    Escopo
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1º Pedido", "8%", "Sobre o valor pago em produtos"],
                  ["2º Pedido", "6%", "Sobre o valor pago em produtos"],
                  ["3º Pedido", "5%", "Sobre o valor pago em produtos"],
                  ["4º Pedido", "3%", "Sobre o valor pago em produtos"],
                ].map(([pedido, pct, escopo]) => (
                  <tr key={pedido}>
                    <td className="border border-gray-200 px-4 py-3 font-medium">
                      {pedido}
                    </td>
                    <td className="border border-gray-200 px-4 py-3">{pct}</td>
                    <td className="border border-gray-200 px-4 py-3">{escopo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm italic text-gray-500">
            *O vínculo entre o afiliado e o cliente encerra-se automaticamente
            após a conclusão do 4º pedido do mesmo cliente.
          </p>
        </div>

        {/* 2 */}
        <div className="mb-6 rounded-2xl bg-white p-8 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-primary">
            <Gift className="h-5 w-5" /> 2. Sistema de Bônus por Recorrência
          </h3>
          <p className="mb-3 text-gray-600">
            Incentivamos a fidelização de clientes com prêmios fixos em dinheiro:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5 text-gray-600">
            <li>
              <strong>3º pedido do cliente:</strong> Bônus adicional de R$ 15,00.
            </li>
            <li>
              <strong>4º pedido do cliente:</strong> Bônus adicional de R$ 15,00.
            </li>
          </ul>
          <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-800">
            <strong>Condição de Valor Mínimo:</strong> O bônus e a comissão são
            liberados para pedidos com valor mínimo a partir de R$ 45,00.
          </div>
        </div>

        {/* 3 */}
        <div className="mb-6 rounded-2xl bg-white p-8 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-primary">
            <Rocket className="h-5 w-5" /> 3. Incentivo de Ativação (Acelerador)
          </h3>
          <p className="text-gray-600">
            Nos seus primeiros 7 dias de cadastro como afiliado, ao alcançar{" "}
            <strong>3 novos clientes válidos</strong> com pedidos entregues, você
            recebe um bônus especial de <strong>R$ 20,00</strong>. Os clientes
            indicados devem possuir endereços de entrega distintos.
          </p>
        </div>

        {/* 4 */}
        <div className="mb-6 rounded-2xl bg-white p-8 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-primary">
            <Shield className="h-5 w-5" /> 4. Validação de Pedidos e Antifraude
          </h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-600">
            <li>
              <strong>Validação:</strong> A comissão só é considerada válida após
              a confirmação de pagamento e entrega concluída do pedido.
            </li>
            <li>
              <strong>Identificação Única:</strong> O vínculo do cliente é
              registrado via número de WhatsApp ou CPF no primeiro pedido.
            </li>
            <li>
              <strong>Proibição de Auto-Indicação:</strong> Não são permitidas
              indicações utilizando o mesmo telefone ou dados do próprio afiliado.
            </li>
            <li>
              <strong>Janela de Vínculo:</strong> O ciclo de até 4 pedidos deve
              ocorrer dentro de um prazo máximo de 90 dias a partir da primeira
              compra.
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border-t-4 border-primary bg-gradient-to-br from-dark to-black p-10 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Pronto para Faturar?</h2>
          <p className="mx-auto mb-6 max-w-md text-gray-300">
            Crie sua conta de afiliado agora e comece a indicar. Você recebe seu
            link exclusivo na hora e acompanha tudo no dashboard.
          </p>
          <Link href="/" className="btn btn-primary btn-large">
            Quero me Cadastrar
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        &copy; 2026 Vani Aguiar Personal Chef ·{" "}
        <Link href="/" className="text-gray-400 hover:text-primary">
          Portal de Afiliados
        </Link>
      </footer>
    </div>
  );
}
