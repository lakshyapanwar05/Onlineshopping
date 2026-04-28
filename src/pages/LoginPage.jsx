import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C6FF00 0%, transparent 70%)' }} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(198,255,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(198,255,0,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-12 group">
          <div className="w-8 h-8 bg-neon rounded-sm flex items-center justify-center">
            <Zap size={18} className="text-black" fill="black" />
          </div>
          <span className="font-display text-2xl tracking-widest text-white uppercase">
            The<span className="text-neon">Outdoors</span>
          </span>
        </Link>

        {/* Card */}
        <div className="glass border border-white/8 rounded-sm p-8">
          {/* Tab Toggle */}
          <div className="flex border-b border-white/5 mb-8">
            {['login', 'signup'].map(tab => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-200 ${
                  mode === tab
                    ? 'text-neon border-b-2 border-neon -mb-px'
                    : 'text-white/30 hover:text-white/60'
                }`}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-white/40 block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={set('name')}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-neon/50 transition-colors"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-white/40 block mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                required
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-neon/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-white/40 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 pr-12 text-white text-sm placeholder-white/20 focus:outline-none focus:border-neon/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-white/40 block mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={set('confirm')}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-neon/50 transition-colors"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-400 text-xs tracking-wide bg-red-400/10 border border-red-400/20 rounded-sm px-3 py-2">
                {error}
              </p>
            )}

            {/* Forgot (login only) */}
            {mode === 'login' && (
              <div className="text-right">
                <a href="#" className="text-xs text-white/30 hover:text-neon transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon text-black font-bold py-4 rounded-sm text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neon-dim transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 neon-glow"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card-bg px-3 text-xs text-white/20 tracking-widest">OR</span>
            </div>
          </div>

          {/* Toggle mode */}
          <p className="text-center text-sm text-white/30">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-neon hover:text-white transition-colors font-medium"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Back to shop */}
        <p className="text-center mt-6">
          <Link to="/" className="text-white/20 text-xs hover:text-neon transition-colors tracking-widest uppercase flex items-center justify-center gap-1">
            ← Back to Store
          </Link>
        </p>
      </div>
    </div>
  );
}
