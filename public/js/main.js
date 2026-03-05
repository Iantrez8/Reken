/* ═══════════════════════════════════════════
   REKEN — main.js
   Global: Nav, Scroll Reveal, Counters, Tilt
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar Scroll Effect ──────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ── Mobile Menu Toggle ────────────────────
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                mobileMenu.classList.remove('open');
            });
        });
    }

    // ── Scroll Reveal (Intersection Observer) ──
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── Metric Counter Animation ──────────────
    const metricValues = document.querySelectorAll('.metric-value[data-target]');

    if (metricValues.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        metricValues.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const duration = 2000;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = eased * target;

            el.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = isDecimal ? target.toFixed(2) : target;
            }
        }

        requestAnimationFrame(update);
    }

    // ── Smooth Anchor Scroll ──────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const targetEl = document.querySelector(href);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Bento Card Tilt Effect ────────────────
    const bentoCards = document.querySelectorAll('.bento-card');

    bentoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -2;
            const rotateY = ((x - centerX) / centerX) * 2;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // ── Parallax Orbs on Mouse Move ───────────
    const orbs = document.querySelectorAll('.ambient-orb');

    if (orbs.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 0.01;
                const x = (clientX - centerX) * speed;
                const y = (clientY - centerY) * speed;
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
        }, { passive: true });
    }

    // ═══════════════════════════════════════════
    // FLOATING AI CHAT WIDGET
    // ═══════════════════════════════════════════
    const chatTrigger = document.getElementById('chatTrigger');
    const chatPanel = document.getElementById('chatPanel');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    function openChat() {
        if (!chatPanel || !chatTrigger) return;
        chatPanel.classList.add('open');
        chatTrigger.classList.add('open');
        chatTrigger.setAttribute('aria-expanded', 'true');
        setTimeout(() => chatInput && chatInput.focus(), 350);
    }

    function closeChat() {
        if (!chatPanel || !chatTrigger) return;
        chatPanel.classList.remove('open');
        chatTrigger.classList.remove('open');
        chatTrigger.setAttribute('aria-expanded', 'false');
    }

    if (chatTrigger) {
        chatTrigger.setAttribute('aria-expanded', 'false');
        chatTrigger.addEventListener('click', () => {
            chatPanel.classList.contains('open') ? closeChat() : openChat();
        });
    }

    if (chatClose) {
        chatClose.addEventListener('click', closeChat);
    }

    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim()) {
                chatSend && chatSend.click();
            }
        });
    }

    function appendMessage(sender, text) {
        if (!chatPanel) return;
        const body = chatPanel.querySelector('.chat-panel-body');
        if (!body) return;

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';

        if (sender === 'user') {
            bubble.style.flexDirection = 'row-reverse';
            bubble.innerHTML = `
                <div class="chat-bubble-avatar" style="background:var(--clr-sapphire-500); color:white;">U</div>
                <div class="chat-bubble-text" style="background:rgba(255,255,255,0.1); border-color:transparent;">${text}</div>
            `;
        } else {
            bubble.innerHTML = `
                <div class="chat-bubble-avatar">
                    <img src="/images/reken_logo.png" alt="AI Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">
                </div>
                <div class="chat-bubble-text">${text}</div>
            `;
        }

        body.appendChild(bubble);
        body.scrollTop = body.scrollHeight;
    }

    if (chatSend) {
        chatSend.addEventListener('click', async () => {
            const msg = chatInput ? chatInput.value.trim() : '';
            if (!msg) return;
            if (chatInput) chatInput.value = '';

            // 1. Show User message
            appendMessage('user', msg);

            // 2. Show Typing Indicator
            const typingId = 'typing-' + Date.now();
            if (chatPanel) {
                const body = chatPanel.querySelector('.chat-panel-body');
                const bubble = document.createElement('div');
                bubble.className = 'chat-bubble';
                bubble.id = typingId;
                bubble.innerHTML = `
                    <div class="chat-bubble-avatar">
                        <img src="/images/reken_logo.png" alt="AI Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">
                     </div>
                    <div class="chat-bubble-text">Typing...</div>
                `;
                body.appendChild(bubble);
                body.scrollTop = body.scrollHeight;
            }

            // 3. Fetch from API
            try {
                const res = await fetch('https://reken-api-313523212713.us-central1.run.app/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: msg })
                });
                const data = await res.json();

                // 4. Remove Typing Indicator
                const tb = document.getElementById(typingId);
                if (tb) tb.remove();

                // 5. Append AI message
                if (data.reply) {
                    appendMessage('ai', data.reply);
                } else {
                    appendMessage('ai', 'Sorry, I encountered an error. Please try again later.');
                }

            } catch (err) {
                console.error('Chat error:', err);
                const tb = document.getElementById(typingId);
                if (tb) tb.remove();
                appendMessage('ai', 'Network error. Please try again.');
            }
        });
    }

});
