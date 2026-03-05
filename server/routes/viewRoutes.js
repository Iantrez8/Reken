/* ═══════════════════════════════════════════
   REKEN — viewRoutes.js
   Serves HTML pages for clean URL paths
   ═══════════════════════════════════════════ */

const express = require('express');
const path = require('path');
const router = express.Router();

const publicDir = path.join(__dirname, '..', '..', 'public');

// Landing page
router.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

// Auth pages
router.get('/signup', (req, res) => {
    res.sendFile(path.join(publicDir, 'signup.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(publicDir, 'login.html'));
});

// Contact
router.get('/contact', (req, res) => {
    res.sendFile(path.join(publicDir, 'contact.html'));
});

// Dashboard routes
router.get('/dashboard', (req, res) => {
    res.redirect('/dashboard/overview');
});

router.get('/dashboard/overview', (req, res) => {
    res.sendFile(path.join(publicDir, 'dashboard', 'overview.html'));
});

router.get('/dashboard/campaigns', (req, res) => {
    res.sendFile(path.join(publicDir, 'dashboard', 'campaigns.html'));
});

router.get('/dashboard/analytics', (req, res) => {
    res.sendFile(path.join(publicDir, 'dashboard', 'analytics.html'));
});

router.get('/dashboard/settings', (req, res) => {
    res.sendFile(path.join(publicDir, 'dashboard', 'settings.html'));
});

module.exports = router;
