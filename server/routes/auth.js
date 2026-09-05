const express = require('express');
const rateLimit = require('express-rate-limit');
const { supabase } = require('../config/supabase');
const { verifyAuth } = require('../middleware/supabaseAuth');

const router = express.Router();

// Rate limiting untuk login (mencegah brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // maksimal 10 percobaan per IP
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Use Supabase Auth API for authentication
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: username, // Assuming username is email, adjust if needed
      password: password
    });

    if (authError || !authData.user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Get user details from profiles table
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('User lookup error:', userError);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    res.json({
      token: authData.session.access_token,
      user: {
        id: userData.id,
        username: userData.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/auth/verify
router.get('/verify', verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', req.userId)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'User not found.' });
    }

    res.json({
      valid: true,
      user: {
        id: data.id,
        username: data.username
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
    }
    
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.json({ message: 'Logged out successfully.' });
  }
});

// POST /api/auth/forgot-password - kirim email reset (Supabase)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // Verifikasi: cek apakah email terdaftar di Supabase Auth
    let emailExists = false;
    try {
      const { data, error: listError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 100,
      });

      if (!listError && data && data.users) {
        emailExists = data.users.some(u => u.email?.toLowerCase() === email.toLowerCase());
      }
    } catch (listErr) {
      console.error('List users error:', listErr);
    }

    // Jika email TIDAK terdaftar, jangan kirim email (return generic message)
    if (!emailExists) {
      return res.json({ message: 'If this email is registered, a password reset link has been sent.' });
    }

    // Kirim email reset password via Supabase
    const redirectTo = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });

    if (error) {
      console.error('Forgot password error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'If this email is registered, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/auth/reset-password - set password baru (dengan token dari email link)
router.post('/reset-password', async (req, res) => {
  try {
    const { password, accessToken, refreshToken } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    if (!accessToken) {
      return res.status(400).json({ error: 'Session token is required.' });
    }

    // Set session dari token yang ada di URL (dari email reset link)
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || '',
    });

    if (sessionError) {
      console.error('Set session error:', sessionError);
      return res.status(400).json({ error: 'Invalid or expired reset link.' });
    }

    // Update password user yang sedang login
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error('Reset password error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
