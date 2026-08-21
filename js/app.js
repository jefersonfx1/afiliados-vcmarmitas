/**
 * Afiliados VC Marmitas - App JS
 * Demo com localStorage. Pronto para migrar para Supabase.
 */

const STORAGE_KEY = 'vcm_afiliados';
const SESSION_KEY = 'vcm_afiliado_logado';

// URL base do site de vendas (ajuste para o domínio real)
const SITE_VENDAS_URL = 'https://vcmarmitas.com.br';

// ---------- Helpers ----------
function getAffiliates() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveAffiliates(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function generateCode(nome) {
  const base = (nome || 'AFF').substring(0, 4).toUpperCase().replace(/\s/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return base + rand;
}

function formatMoney(v) {
  return 'R$ ' + Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
}

// ---------- Auth ----------
function abrirModalAuth(modo = 'login') {
  const modal = document.getElementById('modal-auth');
  if (!modal) return;
  modal.classList.add('active');
  const titulo = document.getElementById('auth-titulo');
  const btn = document.getElementById('btn-auth-submit');
  const groupNome = document.getElementById('group-nome');
  const groupTel = document.getElementById('group-telefone');
  const groupPix = document.getElementById('group-pix');

  if (modo === 'cadastro') {
    titulo.textContent = 'Criar Conta de Afiliado';
    btn.textContent = 'Cadastrar';
    groupNome.style.display = 'block';
    groupTel.style.display = 'block';
    if (groupPix) groupPix.style.display = 'block';
  } else {
    titulo.textContent = 'Entrar na Conta';
    btn.textContent = 'Entrar';
    groupNome.style.display = 'none';
    groupTel.style.display = 'none';
    if (groupPix) groupPix.style.display = 'none';
  }
  modal.dataset.modo = modo;
}

function fecharModalAuth() {
  const modal = document.getElementById('modal-auth');
  if (modal) modal.classList.remove('active');
}

function processarAuth(e) {
  e.preventDefault();
  const modo = document.getElementById('modal-auth').dataset.modo || 'login';
  const email = document.getElementById('auth-email').value.trim().toLowerCase();
  const senha = document.getElementById('auth-senha').value;

  if (!email || senha.length < 6) {
    alert('Preencha e-mail e senha (mínimo 6 caracteres).');
    return;
  }

  let list = getAffiliates();

  if (modo === 'cadastro') {
    const nome = document.getElementById('auth-nome').value.trim();
    const telefone = document.getElementById('auth-telefone').value.trim();
    const pix = document.getElementById('auth-pix') ? document.getElementById('auth-pix').value.trim() : '';

    if (!nome || !telefone) {
      alert('Nome e WhatsApp são obrigatórios.');
      return;
    }
    if (list.find(a => a.email === email)) {
      alert('Já existe uma conta com este e-mail.');
      return;
    }

    const novo = {
      id: Date.now().toString(36),
      nome,
      email,
      telefone,
      pix,
      senha, // demo only — em produção use hash + Supabase Auth
      codigo: generateCode(nome),
      criadoEm: new Date().toISOString(),
      vendas: [], // mock
      totalComissao: 0,
      totalBonus: 0
    };

    // Gera algumas vendas de demonstração
    novo.vendas = gerarVendasDemo(novo.codigo);
    recalcularTotais(novo);

    list.push(novo);
    saveAffiliates(list);
    setSession({ id: novo.id, nome: novo.nome, email: novo.email, codigo: novo.codigo });
    fecharModalAuth();
    window.location.href = 'dashboard.html';
  } else {
    const user = list.find(a => a.email === email && a.senha === senha);
    if (!user) {
      alert('E-mail ou senha incorretos.');
      return;
    }
    setSession({ id: user.id, nome: user.nome, email: user.email, codigo: user.codigo });
    fecharModalAuth();
    window.location.href = 'dashboard.html';
  }
}

function deslogar() {
  clearSession();
  window.location.href = 'index.html';
}

// ---------- Demo data ----------
function gerarVendasDemo(codigo) {
  const agora = Date.now();
  return [
    {
      id: 'v1',
      cliente: 'Cliente A',
      pedido: 1,
      valor: 119.9,
      comissaoPct: 8,
      comissao: 9.59,
      bonus: 0,
      status: 'pago',
      data: new Date(agora - 86400000 * 12).toISOString()
    },
    {
      id: 'v2',
      cliente: 'Cliente A',
      pedido: 2,
      valor: 229.9,
      comissaoPct: 6,
      comissao: 13.79,
      bonus: 0,
      status: 'pago',
      data: new Date(agora - 86400000 * 5).toISOString()
    },
    {
      id: 'v3',
      cliente: 'Cliente B',
      pedido: 1,
      valor: 378.0,
      comissaoPct: 8,
      comissao: 30.24,
      bonus: 0,
      status: 'pendente',
      data: new Date(agora - 86400000 * 2).toISOString()
    },
    {
      id: 'v4',
      cliente: 'Cliente C',
      pedido: 1,
      valor: 119.9,
      comissaoPct: 8,
      comissao: 9.59,
      bonus: 0,
      status: 'pago',
      data: new Date(agora - 86400000 * 1).toISOString()
    }
  ];
}

function recalcularTotais(user) {
  user.totalComissao = user.vendas.reduce((s, v) => s + (v.comissao || 0), 0);
  user.totalBonus = user.vendas.reduce((s, v) => s + (v.bonus || 0), 0);
  user.clientesUnicos = [...new Set(user.vendas.map(v => v.cliente))].length;
  user.pedidos = user.vendas.length;
}

// ---------- Dashboard ----------
function initDashboard() {
  const session = getSession();
  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  const list = getAffiliates();
  const user = list.find(a => a.id === session.id);
  if (!user) {
    clearSession();
    window.location.href = 'index.html';
    return;
  }

  // Header
  document.getElementById('nome-usuario').textContent = user.nome.split(' ')[0];
  document.getElementById('avatar-inicial').textContent = user.nome.charAt(0).toUpperCase();

  // Stats
  document.getElementById('stat-comissao').textContent = formatMoney(user.totalComissao);
  document.getElementById('stat-bonus').textContent = formatMoney(user.totalBonus || 0);
  document.getElementById('stat-clientes').textContent = user.clientesUnicos || 0;
  document.getElementById('stat-pedidos').textContent = user.pedidos || 0;

  // Link
  const link = `${SITE_VENDAS_URL}/?ref=${user.codigo}`;
  const inputLink = document.getElementById('link-afiliado');
  if (inputLink) inputLink.value = link;
  document.getElementById('codigo-afiliado').textContent = user.codigo;

  // Extrato
  const tbody = document.getElementById('extrato-body');
  if (!user.vendas || user.vendas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state"><i class="fas fa-inbox"></i><br>Nenhuma venda registrada ainda.<br>Compartilhe seu link!</td></tr>`;
  } else {
    tbody.innerHTML = user.vendas
      .slice()
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .map(v => `
        <tr>
          <td>${formatDate(v.data)}</td>
          <td>${v.cliente}</td>
          <td>${v.pedido}º</td>
          <td>${formatMoney(v.valor)}</td>
          <td>${v.comissaoPct}%</td>
          <td>${formatMoney(v.comissao + (v.bonus || 0))}</td>
          <td><span class="badge-status ${v.status}">${v.status === 'pago' ? 'Pago' : 'Pendente'}</span></td>
        </tr>
      `).join('');
  }
}

function copiarLink() {
  const input = document.getElementById('link-afiliado');
  if (!input) return;
  input.select();
  navigator.clipboard.writeText(input.value).then(() => {
    const btn = document.getElementById('btn-copiar');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
    setTimeout(() => { btn.innerHTML = original; }, 2000);
  });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  // Se estiver no dashboard
  if (document.body.classList.contains('page-dashboard')) {
    initDashboard();
  }

  // Fecha modal ao clicar fora
  const modal = document.getElementById('modal-auth');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) fecharModalAuth();
    });
  }
});
