import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Eye, EyeOff, ArrowRight, Shield, Zap, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-transparent">
              <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FIR Legal Auditor</h1>
              <p className="text-xs text-gray-500">AI-Powered NDPS Validation</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            {isRegister ? 'Start analyzing FIRs with AI-powered legal auditing' : 'Sign in to continue to your dashboard'}
          </p>

          {error && (
            <div className="mb-6 p-3 bg-danger-50 border border-danger-500/20 rounded-xl text-sm text-danger-600 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Inspector Sharma"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                             transition-all placeholder:text-gray-400"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="officer@police.gov.in"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                           transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                             transition-all placeholder:text-gray-400 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isRegister && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800
                         text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2
                         shadow-lg shadow-primary-500/25 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                className="text-primary-600 font-semibold hover:text-primary-700"
              >
                {isRegister ? 'Sign In' : 'Register'}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 text-center">
              Protected by enterprise-grade security. For authorized law enforcement personnel only.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-900 via-primary-800 to-sidebar items-center justify-center p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
        </div>

        <div className="relative text-white max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium mb-6 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            AI-Powered Legal Validation
          </div>

          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Validate FIRs with<br />
            <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
              AI Precision
            </span>
          </h2>
          <p className="text-lg text-primary-200 mb-8 leading-relaxed">
            Automated 5-module audit for NDPS cases. Detect blockers, verify sections,
            and ensure procedural compliance before submission.
          </p>

          <div className="space-y-4">
            {[
              { icon: Shield, text: 'NDPS Section Auto-Validation' },
              { icon: Zap, text: '5-Module Comprehensive Audit' },
              { icon: Lock, text: 'Panchanama & Evidence Verification' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <item.icon className="w-4 h-4 text-primary-300" />
                </div>
                <span className="text-sm text-primary-100">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
