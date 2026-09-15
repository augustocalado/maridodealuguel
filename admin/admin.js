// ==========================================
// ADMIN.JS — Shared Logic
// Marido de Aluguel — Painel Administrativo
// ==========================================

// Supabase Client (global)
let db;
function initSupabase() {
  const { createClient } = supabase;
  db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return db;
}

// ---- Auth ---- 
async function requireAuth() {
  initSupabase();
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
    return null;
  }
  await loadUserInfo(session.user);
  return session;
}

async function loadUserInfo(user) {
  if (!user) {
    const { data: { user: u } } = await db.auth.getUser();
    user = u;
  }
  if (!user) return;
  const emailPrefix = user.email?.split('@')[0] || 'Admin';
  const initial = emailPrefix[0].toUpperCase();
  const nameEl = document.getElementById('user-name');
  const avatarEl = document.getElementById('user-avatar');
  if (nameEl) nameEl.textContent = emailPrefix;
  if (avatarEl) avatarEl.textContent = initial;
}

async function logout() {
  await db.auth.signOut();
  window.location.href = 'index.html';
}

// ---- Toast Notifications ----
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.success}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

// ---- Modal ----
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ---- Currency / Date Helpers ----
function formatCurrency(value) {
  return (parseFloat(value) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function parseCurrency(str) {
  return parseFloat(String(str).replace(/[^\d,]/g, '').replace(',', '.')) || 0;
}
function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}
function formatPhone(phone) {
  if (!phone) return '-';
  const d = phone.replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return phone;
}

// ---- Status Badge ----
function statusBadge(status) {
  const labels = { rascunho: 'Rascunho', enviado: 'Enviado', aprovado: 'Aprovado', executado: 'Executado', cancelado: 'Cancelado' };
  return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
}

// ---- Active Nav ----
function setActiveNav() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'dashboard.html')) {
      link.classList.add('active');
    }
  });
}

// ---- Sidebar (shared HTML injected by each page) ----
function getSidebarHTML(active = '') {
  const items = [
    { href: 'dashboard.html', icon: 'fa-gauge-high', label: 'Dashboard' },
    { href: 'orcamentos.html', icon: 'fa-file-invoice-dollar', label: 'Orçamentos' },
    { href: 'clientes.html', icon: 'fa-users', label: 'Clientes' },
    { href: 'produtos.html', icon: 'fa-toolbox', label: 'Serviços & Produtos' },
  ];
  const navHTML = items.map(i => `
    <a href="${i.href}" class="nav-item ${active === i.href ? 'active' : ''}">
      <i class="fas ${i.icon}"></i> ${i.label}
    </a>`).join('');

  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <a href="dashboard.html" class="sidebar-logo">
        <div class="sidebar-logo-icon">🔧</div>
        <div class="sidebar-logo-text">
          <strong>Marido de Aluguel</strong>
          <span>Painel Admin</span>
        </div>
      </a>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Menu Principal</div>
      ${navHTML}
      <div class="nav-section-label" style="margin-top:8px;">Ações Rápidas</div>
      <a href="orcamento-novo.html" class="nav-item">
        <i class="fas fa-plus-circle"></i> Novo Orçamento
      </a>
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="user-avatar" id="user-avatar">A</div>
        <div class="user-info">
          <div class="user-name" id="user-name">Admin</div>
          <div class="user-role">Administrador</div>
        </div>
        <button class="btn-logout" onclick="logout()" title="Sair">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  </aside>
  <div id="toast-container" class="toast-container"></div>`;
}

document.addEventListener('DOMContentLoaded', setActiveNav);
