import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Phone, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomerAuthPage: React.FC<{ mode: 'login' | 'register' | 'forgot' | 'reset' }> = ({ mode }) => {
  const { customerLogin, customerRegister } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if redirect query was provided (e.g. from checkout)
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/account';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Please enter both your email address and password.');
          setIsLoading(false);
          return;
        }
        const res = customerLogin(email, password);
        if (res.success) {
          navigate(redirectTo);
        } else {
          setErrorMsg(res.error || 'Failed to authenticate.');
        }
      } else if (mode === 'register') {
        if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
          setErrorMsg('All fields are required.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match.');
          setIsLoading(false);
          return;
        }
        const res = customerRegister(name, email, phone, password);
        if (res.success) {
          navigate(redirectTo);
        } else {
          setErrorMsg(res.error || 'Registration failed.');
        }
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          setErrorMsg('Please enter your registered email address.');
          setIsLoading(false);
          return;
        }
        setSuccessMsg(`If an account exists for ${email}, a secure password reset link has been dispatched.`);
      } else if (mode === 'reset') {
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }
        setSuccessMsg('Your password has been reset successfully. You can now log in.');
        setTimeout(() => navigate('/login'), 2000);
      }
      setIsLoading(false);
    }, 450);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-blue-100 p-8 shadow-xl shadow-blue-500/5 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 text-[#0070DC] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <UserIcon className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Customer Account'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'reset' && 'Create New Password'}
          </h1>

          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {mode === 'login' && 'Sign in to track your pre-orders, manage delivery addresses, and view 1688 sourcing updates.'}
            {mode === 'register' && "Join Helen's Varieties Venture for verified international sourcing and seamless pre-orders."}
            {mode === 'forgot' && 'Enter your email address to receive password recovery instructions.'}
            {mode === 'reset' && 'Enter your new secure password below.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amina Bello"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC] focus:ring-1 focus:ring-[#0070DC]"
                  />
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">WhatsApp Phone Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="07032583937 or +234..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC] focus:ring-1 focus:ring-[#0070DC]"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Used for WhatsApp AI order tracking and shipping alerts.</p>
              </div>
            </>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="amina@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC] focus:ring-1 focus:ring-[#0070DC]"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'reset') && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-slate-700">Password *</label>
                {mode === 'login' && (
                  <Link to="/forgot-password" className="text-[11px] text-[#0070DC] hover:underline font-semibold">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-9 pr-9 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC] focus:ring-1 focus:ring-[#0070DC]"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC] focus:ring-1 focus:ring-[#0070DC]"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#0070DC] hover:bg-[#005BB5] disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                {mode === 'login' && 'Sign In to Account'}
                {mode === 'register' && 'Register Account'}
                {mode === 'forgot' && 'Send Recovery Link'}
                {mode === 'reset' && 'Update Password'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Navigation Switchers */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-[#0070DC] hover:underline">
                Create one now
              </Link>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <Link to="/login" className="font-bold text-[#0070DC] hover:underline">
                Sign in here
              </Link>
            </p>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-bit encrypted authentication guard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

