/* ═══════════════════════════════════════════
   REKEN — authController.js
   In-Memory Auth Logic (swap for DB later)
   ═══════════════════════════════════════════ */

// In-memory user store
const users = [];

/**
 * POST /api/auth/signup
 */
function signup(req, res) {
    const { name, email, password, occupation, goals, source } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and password are required.',
        });
    }

    // Check if user already exists
    const existing = users.find(u => u.email === email);
    if (existing) {
        return res.status(409).json({
            success: false,
            message: 'An account with this email already exists.',
        });
    }

    // Create user
    const user = {
        id: Date.now().toString(36),
        name,
        email,
        password, // In production, hash this!
        occupation: occupation || 'user',
        goals: goals || [],
        source: source || '',
        createdAt: new Date().toISOString(),
    };

    users.push(user);

    console.log(`[AUTH] New user signed up: ${email} (${occupation})`);

    return res.json({
        success: true,
        message: 'Account created successfully.',
        occupation: user.occupation,
        userId: user.id,
    });
}

/**
 * POST /api/auth/login
 */
function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required.',
        });
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password.',
        });
    }

    console.log(`[AUTH] User logged in: ${email}`);

    return res.json({
        success: true,
        message: 'Authentication successful.',
        occupation: user.occupation,
        userId: user.id,
    });
}

module.exports = { signup, login };
