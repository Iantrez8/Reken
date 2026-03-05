/* ═══════════════════════════════════════════
   REKEN — dashboard.js
   Sidebar Toggles, Chart Init, User Greeting
   ═══════════════════════════════════════════ */

// ── Theme Initialization (Run immediately) ───
if (localStorage.getItem('reken_theme') === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
}

document.addEventListener('DOMContentLoaded', () => {

    // ── Get role from URL params ──────────────
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role') || 'user';

    // ── Set user greeting ─────────────────────
    const welcomeEl = document.getElementById('dashWelcome');
    if (welcomeEl) {
        const capitalised = role.charAt(0).toUpperCase() + role.slice(1);
        welcomeEl.innerHTML = `Welcome back, <span class="text-gradient">${capitalised}</span>`;
    }

    const roleEl = document.getElementById('dashRoleBadge');
    if (roleEl) {
        roleEl.textContent = role.charAt(0).toUpperCase() + role.slice(1) + ' Dashboard';
    }

    // ── Sidebar Toggle ────────────────────────
    const sidebar = document.getElementById('dashSidebar');
    const mainContent = document.getElementById('dashMain');
    const toggleBtn = document.getElementById('dashToggle');

    if (toggleBtn && sidebar && mainContent) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            sidebar.classList.toggle('open');
            mainContent.classList.toggle('expanded');
        });
    }

    // ── Active Nav Link ───────────────────────
    const currentPage = window.location.pathname.split('/').pop() || 'overview.html';
    const navLinks = document.querySelectorAll('.dash-nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });

    // ── Close sidebar on mobile link click ────
    if (sidebar) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                    sidebar.classList.add('collapsed');
                }
            });
        });
    }

    // ── Theme Toggle Logic ────────────────────
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.checked = localStorage.getItem('reken_theme') === 'light';
        themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('reken_theme', 'light');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('reken_theme', 'dark');
            }
        });
    }

});
