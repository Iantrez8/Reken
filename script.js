/* ═══════════════════════════════════════════
   REKEN — Interactive Features + SPA Router
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════
  // SPA HASH ROUTER
  // ═══════════════════════════════════════════
  const pages = {
    home: document.getElementById('page-home'),
    signup: document.getElementById('page-signup'),
    contact: document.getElementById('page-contact'),
    dashboard: document.getElementById('page-dashboard'),
  };

  function navigateTo(hash) {
    // Hide all pages
    Object.values(pages).forEach(p => { if (p) p.classList.remove('active'); });

    const route = hash.replace('#/', '').split('/');
    const pageName = route[0] || 'home';

    if (pageName === 'signup' && pages.signup) {
      pages.signup.classList.add('active');
      resetSignup();
    } else if (pageName === 'contact' && pages.contact) {
      pages.contact.classList.add('active');
    } else if (pageName === 'dashboard' && pages.dashboard) {
      const role = route[1] || 'user';
      pages.dashboard.classList.add('active');
      const dashRole = document.getElementById('dashRole');
      const dashMsg = document.getElementById('dashMessage');
      if (dashRole) dashRole.textContent = `— ${capitalise(role)} Dashboard —`;
      if (dashMsg) dashMsg.textContent = `Welcome, ${capitalise(role)}. Your personalised command center is being prepared. Full dashboard access coming soon.`;
    } else {
      if (pages.home) pages.home.classList.add('active');
    }

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-run reveal observer for new page
    setTimeout(initReveal, 100);
  }

  function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    navigateTo(location.hash);
  });

  // Initial route
  if (location.hash && location.hash !== '#/' && location.hash !== '#') {
    navigateTo(location.hash);
  }

  // ═══════════════════════════════════════════
  // SIGNUP FLOW STATE
  // ═══════════════════════════════════════════
  let signupState = {
    step: 1,
    name: '',
    email: '',
    password: '',
    occupation: '',
    goals: [],
    source: '',
  };

  function resetSignup() {
    signupState = { step: 1, name: '', email: '', password: '', occupation: '', goals: [], source: '' };
    showStep(1);
    // Reset selections
    document.querySelectorAll('.occupation-card.selected').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.goal-chip.selected').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.source-chip.selected').forEach(c => c.classList.remove('selected'));
  }

  function showStep(step) {
    signupState.step = step;
    // Hide all steps
    document.querySelectorAll('.signup-step').forEach(s => s.classList.remove('active'));
    // Show target step
    const target = document.querySelector(`.signup-step[data-step="${step}"]`);
    if (target) target.classList.add('active');
    // Update step indicator
    updateStepIndicator(step);
  }

  function updateStepIndicator(currentStep) {
    const dots = document.querySelectorAll('.step-dot');
    const lines = document.querySelectorAll('.step-line');
    dots.forEach((dot, i) => {
      const stepNum = i + 1;
      dot.classList.remove('active', 'completed');
      if (stepNum === currentStep) dot.classList.add('active');
      else if (stepNum < currentStep) dot.classList.add('completed');
    });
    lines.forEach((line, i) => {
      line.classList.remove('completed');
      if (i + 1 < currentStep) line.classList.add('completed');
    });
  }

  // Step 1 → 2
  const step1Next = document.getElementById('step1Next');
  if (step1Next) {
    step1Next.addEventListener('click', () => {
      signupState.name = document.getElementById('signup-name')?.value || '';
      signupState.email = document.getElementById('signup-email')?.value || '';
      signupState.password = document.getElementById('signup-password')?.value || '';
      showStep(2);
    });
  }

  // Step 2: Occupation selection
  const occGrid = document.getElementById('occupationGrid');
  if (occGrid) {
    occGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.occupation-card');
      if (!card) return;
      occGrid.querySelectorAll('.occupation-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      signupState.occupation = card.dataset.occupation;
    });
  }

  // Step 2 → 3
  const step2Next = document.getElementById('step2Next');
  if (step2Next) step2Next.addEventListener('click', () => showStep(3));
  const step2Back = document.getElementById('step2Back');
  if (step2Back) step2Back.addEventListener('click', () => showStep(1));

  // Step 3: Goals multi-select
  const goalsGrid = document.getElementById('goalsGrid');
  if (goalsGrid) {
    goalsGrid.addEventListener('click', (e) => {
      const chip = e.target.closest('.goal-chip');
      if (!chip) return;
      chip.classList.toggle('selected');
      const goal = chip.dataset.goal;
      if (signupState.goals.includes(goal)) {
        signupState.goals = signupState.goals.filter(g => g !== goal);
      } else {
        signupState.goals.push(goal);
      }
    });
  }

  // Step 3 → 4
  const step3Next = document.getElementById('step3Next');
  if (step3Next) step3Next.addEventListener('click', () => showStep(4));
  const step3Back = document.getElementById('step3Back');
  if (step3Back) step3Back.addEventListener('click', () => showStep(2));

  // Step 4: Source selection
  const sourceGrid = document.getElementById('sourceGrid');
  if (sourceGrid) {
    sourceGrid.addEventListener('click', (e) => {
      const chip = e.target.closest('.source-chip');
      if (!chip) return;
      sourceGrid.querySelectorAll('.source-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      signupState.source = chip.dataset.source;
    });
  }

  // Step 4 Back
  const step4Back = document.getElementById('step4Back');
  if (step4Back) step4Back.addEventListener('click', () => showStep(3));

  // Submit
  const signupSubmit = document.getElementById('signupSubmit');
  if (signupSubmit) {
    signupSubmit.addEventListener('click', () => {
      // Show loading
      showStep('loading');
      // Simulate provisioning, then redirect to dashboard
      const occupation = signupState.occupation || 'user';
      setTimeout(() => {
        location.hash = `#/dashboard/${occupation}`;
      }, 2000);
    });
  }

  // ═══════════════════════════════════════════
  // CONTACT FORM
  // ═══════════════════════════════════════════
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-transmit');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span>Message Transmitted ✓</span>';
      btn.style.borderColor = 'rgba(200,149,76,0.4)';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.borderColor = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ═══════════════════════════════════════════
  // NAVBAR SCROLL EFFECT
  // ═══════════════════════════════════════════
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ═══════════════════════════════════════════
  // MOBILE MENU TOGGLE
  // ═══════════════════════════════════════════
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileBtn.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ═══════════════════════════════════════════
  // SCROLL REVEAL (Intersection Observer)
  // ═══════════════════════════════════════════
  function initReveal() {
    const revealElements = document.querySelectorAll('.reveal-up:not(.revealed)');
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
  }

  initReveal();

  // ═══════════════════════════════════════════
  // METRIC COUNTER ANIMATION
  // ═══════════════════════════════════════════
  const metricValues = document.querySelectorAll('.metric-value[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  metricValues.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const duration = 2000;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = eased * target;

      if (isDecimal) {
        el.textContent = current.toFixed(2);
      } else {
        el.textContent = Math.floor(current);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isDecimal ? target.toFixed(2) : target;
      }
    }

    requestAnimationFrame(update);
  }

  // ═══════════════════════════════════════════
  // SMOOTH ANCHOR SCROLL (home page only)
  // ═══════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // Skip router links (they start with #/)
      if (href.startsWith('#/')) return;
      if (href === '#') return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ═══════════════════════════════════════════
  // BENTO CARD TILT EFFECT (subtle)
  // ═══════════════════════════════════════════
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

  // ═══════════════════════════════════════════
  // PARALLAX ORBS ON MOUSE MOVE
  // ═══════════════════════════════════════════
  const orbs = document.querySelectorAll('.ambient-orb');

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

  // Send on Enter key
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && chatInput.value.trim()) {
        // TODO: Connect to AI — trigger chatSend click
        chatSend && chatSend.click();
      }
    });
  }

  // Send button placeholder (AI integration point)
  if (chatSend) {
    chatSend.addEventListener('click', () => {
      const msg = chatInput ? chatInput.value.trim() : '';
      if (!msg) return;
      // TODO: Send `msg` to your AI endpoint here
      if (chatInput) chatInput.value = '';
    });
  }

});

