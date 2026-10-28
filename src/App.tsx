import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { JazzAudioProvider } from './context/JazzAudioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIAssistant } from './components/AIAssistant';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { LogoIntroAnimation } from './components/LogoIntroAnimation';

// Public Store Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { PreOrderInfoPage } from './pages/PreOrderInfoPage';
import { ContactPage } from './pages/ContactPage';

// Customer Auth & Dashboards
import { CustomerAuthPage } from './pages/CustomerAuthPage';
import { CustomerAccountDashboard } from './pages/CustomerAccountDashboard';

// Admin System
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminAppLayout } from './pages/AdminAppLayout';

export function App() {
  return (
    <AppProvider>
      <JazzAudioProvider>
        <BrowserRouter>
          {/* Central Logo Intro Animation for initial load & client route transitions */}
          <LogoIntroAnimation />

          <div className="min-h-screen flex flex-col bg-[#F7F7F8]">
            <Navbar />
            <div className="flex-1">
              <Routes>
                {/* Public Retail Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/track" element={<TrackOrderPage />} />
                <Route path="/pre-order" element={<PreOrderInfoPage />} />
                <Route path="/about" element={<PreOrderInfoPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/wishlist" element={<ShopPage />} />

                {/* Customer Authentication Routes */}
                <Route path="/login" element={<CustomerAuthPage mode="login" />} />
                <Route path="/register" element={<CustomerAuthPage mode="register" />} />
                <Route path="/forgot-password" element={<CustomerAuthPage mode="forgot" />} />
                <Route path="/reset-password" element={<CustomerAuthPage mode="reset" />} />

                {/* Customer Account Routes */}
                <Route path="/account" element={<CustomerAccountDashboard />} />
                <Route path="/account/orders" element={<CustomerAccountDashboard />} />
                <Route path="/account/pre-orders" element={<CustomerAccountDashboard />} />
                <Route path="/account/addresses" element={<CustomerAccountDashboard />} />
                <Route path="/account/profile" element={<CustomerAccountDashboard />} />
                <Route path="/account/wishlist" element={<CustomerAccountDashboard />} />
                {/* Backward compatibility */}
                <Route path="/dashboard" element={<Navigate to="/account" replace />} />
                <Route path="/auth/login" element={<Navigate to="/login" replace />} />
                <Route path="/auth/register" element={<Navigate to="/register" replace />} />

                {/* Administrator System Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminAppLayout />} />
                <Route path="/admin/products" element={<AdminAppLayout />} />
                <Route path="/admin/categories" element={<AdminAppLayout />} />
                <Route path="/admin/orders" element={<AdminAppLayout />} />
                <Route path="/admin/pre-orders" element={<AdminAppLayout />} />
                <Route path="/admin/customers" element={<AdminAppLayout />} />
                <Route path="/admin/payments" element={<AdminAppLayout />} />
                <Route path="/admin/shipping" element={<AdminAppLayout />} />
                <Route path="/admin/banners" element={<AdminAppLayout />} />
                <Route path="/admin/whatsapp" element={<AdminAppLayout />} />
                <Route path="/admin/ai-assistant" element={<AdminAppLayout />} />
                <Route path="/admin/reports" element={<AdminAppLayout />} />
                <Route path="/admin/settings" element={<AdminAppLayout />} />
                <Route path="/admin/audit-logs" element={<AdminAppLayout />} />
              </Routes>
            </div>
            <Footer />
            <AIAssistant />
            <WhatsAppFloatingButton />
          </div>
        </BrowserRouter>
      </JazzAudioProvider>
    </AppProvider>
  );
}

export default App;
