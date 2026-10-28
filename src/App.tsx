import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIAssistant } from './components/AIAssistant';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { PreOrderInfoPage } from './pages/PreOrderInfoPage';
import { AuthPage } from './pages/AuthPage';
import { ContactPage } from './pages/ContactPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F7F7F8]">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/dashboard" element={<CustomerDashboardPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/track" element={<TrackOrderPage />} />
              <Route path="/pre-order" element={<PreOrderInfoPage />} />
              <Route path="/about" element={<PreOrderInfoPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth/login" element={<AuthPage mode="login" />} />
              <Route path="/auth/register" element={<AuthPage mode="register" />} />
              <Route path="/wishlist" element={<ShopPage />} />
            </Routes>
          </div>
          <Footer />
          <AIAssistant />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

