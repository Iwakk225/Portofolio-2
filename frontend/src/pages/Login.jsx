import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.email?.[0];
      setError(msg || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-black border-2 border-black shadow-[5px_5px_0px_0px_#00C2FF] mb-4">
            <Zap size={24} className="text-[#00C2FF]" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-widest">Admin Login</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Enter the Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="neo-card p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="neo-input"
                placeholder="admin@portfolio.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="neo-input pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black p-1"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="border-2 border-red-600 bg-red-50 p-3 text-xs font-bold text-red-600">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-neo w-full justify-center text-sm mt-2"
            >
              {loading ? 'Authenticating...' : '⚡ Enter Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center mt-4">
          <a href="/" className="text-xs font-bold text-gray-500 hover:text-black underline">
            ← Back to Portfolio
          </a>
        </p>
      </div>
    </div>
  );
}
