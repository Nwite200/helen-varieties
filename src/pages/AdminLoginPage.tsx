import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await adminLogin(email, password);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(res.error || 'Access denied.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#191919] text-white rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#0070DC] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <KeyRound className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-white/10 px-3 py-1 rounded-full">
            Restricted System Boundary
          </span>

          <h1 className="text-2xl font-extrabold tracking-tight">
            Administrator Gateway
          </h1>

          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Authorized administrative access for Helen's Varieties Venture management and WhatsApp operations.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="Administrator email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/15 px-3.5 py-2.5 pl-9 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#0070DC]"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Security Passkey</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/15 px-3.5 py-2.5 pl-9 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#0070DC]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#0070DC] hover:bg-[#005BB5] disabled:opacity-50 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? <span>Verifying credentials...</span> : <>Authenticate & Enter <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 space-y-3 text-center text-xs">
          <Link to="/" className="inline-block text-slate-400 hover:text-white transition text-xs">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

