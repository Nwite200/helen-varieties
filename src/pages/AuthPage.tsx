import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const AuthPage: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
  const { loginAs } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('customer', email || 'johndoe@example.com');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {mode === 'login' ? 'Welcome Back' : 'Create Customer Account'}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === 'login'
              ? 'Sign in to access your pre-order milestones and addresses.'
              : 'Join Helen Varieties to track sourcing orders and receive custom quotes.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+234 801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2"
          >
            {mode === 'login' ? 'Sign In' : 'Create Free Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Shortcut */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-center text-xs">
          <button
            type="button"
            onClick={() => {
              loginAs('admin');
              navigate('/admin');
            }}
            className="text-[11px] font-bold text-red-600 hover:underline bg-red-50 py-1.5 rounded-lg border border-red-100"
          >
            One-Click Login as Admin (Operations Demo)
          </button>

          <p className="text-slate-500">
            {mode === 'login' ? "Don't have an account yet?" : 'Already have an account?'}
            <Link
              to={mode === 'login' ? '/auth/register' : '/auth/login'}
              className="font-bold text-[#0070DC] ml-1 hover:underline"
            >
              {mode === 'login' ? 'Register here' : 'Sign in here'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

