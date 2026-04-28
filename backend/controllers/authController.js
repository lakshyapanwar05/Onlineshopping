import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/db.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendAuthResponse = (res, statusCode, user, token) =>
  res.status(statusCode).json({
    success: true, token,
    user: { id: user.id, name: user.name, email: user.email },
  });

// ── POST /api/auth/register ───────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    // Check duplicate email
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (existing)
      return res.status(409).json({ success: false, message: 'Email already registered.' });

    // Hash & insert
    const hashed = await bcrypt.hash(password, 12);
    const { data: user, error } = await supabase
      .from('users')
      .insert({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed })
      .select('id, name, email')
      .single();

    if (error) throw error;

    sendAuthResponse(res, 201, user, signToken(user.id));
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error) throw error;
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    let isMatch = false;
    // Fallback to plain text comparison if the password is not bcrypt hashed
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (password === user.password);
    }

    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    sendAuthResponse(res, 200, user, signToken(user.id));
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
