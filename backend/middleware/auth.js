import jwt from 'jsonwebtoken';
import supabase from '../config/db.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ success: false, message: 'No token provided.' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', decoded.id)
      .maybeSingle();

    if (error) throw error;
    if (!user)
      return res.status(401).json({ success: false, message: 'User no longer exists.' });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};
