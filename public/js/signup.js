/* ═══════════════════════════════════════════
   REKEN — signup.js
   Multi-Step Signup Flow + API Integration
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── State ─────────────────────────────────
    const state = {
        step: 1,
        name: '',
        email: '',
        password: '',
        occupation: '',
        goals: [],
        source: '',
    };

    // ── Step Navigation ───────────────────────
    function showStep(step) {
        state.step = step;
        document.querySelectorAll('.signup-step').forEach(s => s.classList.remove('active'));
        const target = document.querySelector(`.signup-step[data-step="${step}"]`);
        if (target) target.classList.add('active');
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

    // ── Step 1: Basic Info → Step 2 ───────────
    const step1Next = document.getElementById('step1Next');
    if (step1Next) {
        step1Next.addEventListener('click', () => {
            state.name = document.getElementById('signup-name')?.value.trim() || '';
            state.email = document.getElementById('signup-email')?.value.trim() || '';
            state.password = document.getElementById('signup-password')?.value || '';

            if (!state.name || !state.email || !state.password) {
                alert('Please fill out all fields before continuing.');
                return;
            }

            showStep(2);
        });
    }

    // ── Step 2: Occupation Selection ──────────
    const occGrid = document.getElementById('occupationGrid');
    if (occGrid) {
        occGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.occupation-card');
            if (!card) return;
            occGrid.querySelectorAll('.occupation-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.occupation = card.dataset.occupation;
        });
    }

    const step2Next = document.getElementById('step2Next');
    if (step2Next) {
        step2Next.addEventListener('click', () => {
            if (!state.occupation) {
                alert('Please select an occupation.');
                return;
            }
            showStep(3);
        });
    }
    const step2Back = document.getElementById('step2Back');
    if (step2Back) step2Back.addEventListener('click', () => showStep(1));

    // ── Step 3: Goals Multi-Select ────────────
    const goalsGrid = document.getElementById('goalsGrid');
    if (goalsGrid) {
        goalsGrid.addEventListener('click', (e) => {
            const chip = e.target.closest('.goal-chip');
            if (!chip) return;
            chip.classList.toggle('selected');
            const goal = chip.dataset.goal;
            if (state.goals.includes(goal)) {
                state.goals = state.goals.filter(g => g !== goal);
            } else {
                state.goals.push(goal);
            }
        });
    }

    const step3Next = document.getElementById('step3Next');
    if (step3Next) {
        step3Next.addEventListener('click', () => {
            if (state.goals.length === 0) {
                alert('Please select at least one goal.');
                return;
            }
            showStep(4);
        });
    }
    const step3Back = document.getElementById('step3Back');
    if (step3Back) step3Back.addEventListener('click', () => showStep(2));

    // ── Step 4: Source Selection ───────────────
    const sourceGrid = document.getElementById('sourceGrid');
    if (sourceGrid) {
        sourceGrid.addEventListener('click', (e) => {
            const chip = e.target.closest('.source-chip');
            if (!chip) return;
            sourceGrid.querySelectorAll('.source-chip').forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            state.source = chip.dataset.source;
        });
    }

    const step4Back = document.getElementById('step4Back');
    if (step4Back) step4Back.addEventListener('click', () => showStep(3));

    // ── Submit ────────────────────────────────
    const signupSubmit = document.getElementById('signupSubmit');
    if (signupSubmit) {
        signupSubmit.addEventListener('click', async () => {
            if (!state.source) {
                alert('Please let us know how you heard about REKEN.');
                return;
            }

            showStep('loading');

            try {
                // Call Cloud Run backend API directly — no Firebase SDK auth needed
                const res = await fetch('https://reken-api-313523212713.us-central1.run.app/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: state.name,
                        email: state.email,
                        password: state.password,
                        occupation: state.occupation,
                        goals: state.goals,
                        source: state.source
                    })
                });

                const data = await res.json();

                if (!data.success) {
                    throw new Error(data.message || 'Signup failed. Please try again.');
                }

                // Store user info in sessionStorage for dashboard use
                sessionStorage.setItem('reken_user', JSON.stringify({
                    name: state.name,
                    email: state.email,
                    occupation: data.occupation,
                    userId: data.userId
                }));

                setTimeout(() => {
                    window.location.href = `/dashboard/overview.html?role=${data.occupation}`;
                }, 1500);

            } catch (err) {
                alert(err.message || 'Signup failed. Please try again.');
                showStep(1);
            }
        });
    }

});
