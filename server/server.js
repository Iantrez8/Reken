/* ═══════════════════════════════════════════
   REKEN — server.js
   Express Application Entry Point
   ═══════════════════════════════════════════ */

require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const viewRoutes = require('./routes/viewRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────
app.use(cors({ origin: true })); // Allow all origins for now until production domain is known
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static Files ─────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'public')));

// ── API Routes ───────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// ── View Routes ──────────────────────────────
app.use('/', viewRoutes);

// ── Start Server ─────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   REKEN Platform Server Running       ║
  ║   http://localhost:${PORT}              ║
  ╚═══════════════════════════════════════╝
  `);
});
