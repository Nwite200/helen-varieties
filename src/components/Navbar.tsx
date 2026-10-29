import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock,
  Search, 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  Menu, 
  X, 
  ChevronDown, 
  Layers, 
  Package, 
  HelpCircle, 
  Phone,
  ShieldCheck,
  Plane,
  Clock
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../mockData';

export const Navbar: React.FC = () => {
  const { cart, wishlist, user, customerLogout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}&category=${encodeURIComponent(selectedCategory)}`);
    } else {
      navigate('/shop');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Pre-Order', path: '/pre-order' },
    { name: 'Track Order', path: '/track' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="w-full sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#0070DC] text-white text-xs font-medium py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
              <Plane className="w-3 h-3" /> 1688 Direct
            </span>
            <span>Your Trusted Sourcing Partner from 1688, China & Global Markets</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[12px] opacity-95">
            <Link to="/track" className="hover:underline flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Track Order
            </Link>
            <Link to="/contact" className="hover:underline flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Help Center
            </Link>
            <Link to="/admin/login" className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-full font-semibold transition">
              <Lock className="w-3.5 h-3.5" /> Admin
            </Link>
            <a href="tel:+2348000000000" className="hover:underline flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Contact Us
            </a>
            <div className="flex items-center gap-2 pl-2 border-l border-white/30 text-white/80">
              <span className="hover:text-white cursor-pointer">FB</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">IG</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">TikTok</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar with Logo, Big Search Bar & Profile/Cart Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Logo size="md" />

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl items-center relative">
            <div className="flex w-full items-center border-2 border-[#0070DC] rounded-lg overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-200">
              {/* Category dropdown toggle */}
              <div className="relative border-r border-slate-200 hidden lg:block">
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className="h-11 px-3.5 bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-100 transition"
                >
                  <span className="truncate max-w-[130px]">{selectedCategory}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isCategoryMenuOpen && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 max-h-72 overflow-y-auto">
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-blue-50 text-slate-800"
                      onClick={() => {
                        setSelectedCategory('All Categories');
                        setIsCategoryMenuOpen(false);
                      }}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 text-slate-600"
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setIsCategoryMenuOpen(false);
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />

              {/* Search button */}
              <button
                type="submit"
                aria-label="Search"
                className="bg-[#0070DC] hover:bg-[#005BB5] text-white px-5 h-11 flex items-center justify-center font-medium transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Action Buttons: Account, Wishlist, Cart */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Account */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 text-slate-700 hover:text-[#0070DC] transition p-1 text-left"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="hidden lg:block">
                  <div className="text-[11px] text-slate-500 font-medium">
                    {user ? `Hello, ${user.name.split(' ')[0]}` : 'Sign In'}
                  </div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-0.5">
                    Account <ChevronDown className="w-3 h-3 text-slate-500" />
                  </div>
                </div>
              </button>

              {isUserDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2"
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  {user ? (
                    <div>
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role === 'admin' ? 'Administrator' : 'Customer Account'}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          to={user.role === 'admin' ? '/admin' : '/dashboard'}
                          className="flex items-center px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          {user.role === 'admin' ? 'Admin Dashboard' : 'My Orders & Dashboard'}
                        </Link>
                        {user.role === 'customer' && (
                          <Link
                            to="/admin"
                            className="flex items-center px-3 py-2 text-xs text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            Switch to Admin View
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            customerLogout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-semibold"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2 text-center">
                      <p className="text-xs text-slate-600 mb-3">Sign in to track orders and save pre-order items.</p>
                      <Link
                        to="/auth/login"
                        className="block w-full py-2 bg-[#0070DC] text-white text-xs font-bold rounded-lg hover:bg-[#005BB5] transition"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/auth/register"
                        className="block w-full py-1.5 mt-2 text-xs text-slate-600 hover:text-[#0070DC] font-medium"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Create an Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="flex items-center gap-1.5 text-slate-700 hover:text-[#0070DC] transition relative p-1"
            >
              <div className="relative">
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline text-xs font-semibold">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="flex items-center gap-2 bg-[#0070DC]/10 hover:bg-[#0070DC]/20 text-[#0070DC] px-3.5 py-2 rounded-lg font-semibold text-xs transition"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-[#0070DC]" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#0070DC] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">Cart</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden">
          <div className="flex w-full items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Search products, brands, 1688 items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#0070DC] text-white px-4 py-2 flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Secondary Bar: Categories Dropdown & Main Navigation Links */}
      <div className="border-t border-slate-100 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
          {/* All Categories Button */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-2 bg-[#0070DC] hover:bg-[#005BB5] text-white px-5 h-11 text-xs font-bold uppercase tracking-wider transition rounded-t-sm"
            >
              <Layers className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isCategoryMenuOpen && (
              <div 
                className="absolute left-0 top-full w-64 bg-white border border-slate-200 rounded-b-xl shadow-2xl z-50 py-2 divide-y divide-slate-100"
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                {CATEGORIES.map(category => (
                  <Link
                    key={category.id}
                    to={`/shop?category=${encodeURIComponent(category.name)}`}
                    onClick={() => setIsCategoryMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0070DC] transition font-medium"
                  >
                    <span>{category.name}</span>
                    <span className="text-[10px] text-slate-500">({category.itemCount || 40}+)</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-7 text-sm font-semibold text-slate-700">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`hover:text-[#0070DC] transition relative py-2 ${
                    isActive ? 'text-[#0070DC] font-bold' : ''
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0070DC] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sourcing guarantee badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pre-Order Verification Protected</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0070DC] rounded-lg"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0070DC] rounded-lg flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Admin Login
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs text-slate-600 hover:text-[#0070DC] py-1.5 px-2 rounded hover:bg-slate-50 truncate"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

