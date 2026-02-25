// App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header/header';
import Footer from './components/Footer/footer';
import Preloader from './components/Preloader/preloader';
import Newsletter from './components/NewLetter/newletter';
import Home from './components/Home/home';
import Shop from './components/Shop/shop';
import Teams from './components/Teams/teams';
import Blog from './components/Blog/blog';
import BlogDetail from './components/Detail/Blog-Detail/blog-detail';
import Contact from './components/Contact/contact';
import About from './components/About/about';
import Cart from './components/Cart/cart';
import Wishlist from './components/Wishlist/wishlist';
import Profile from './components/Profile/profile';
import Orders from './components/Order/orders';
import Vouchers from './components/Vouchers/vouchers';
import Login from './components/Login/login';
import ForgotPassword from './components/Forgot-password/forgot-password';
import Register from './components/Register/register';
import TovPrivacy from './components/Tov-privacy/tov-privacy';
import OrderSuccess from './components/Order-notifications/order-success/order-success';
import OrderFail from './components/Order-notifications/order-fail/order-fail';
import Checkout from './components/Checkout/checkout';
import ProductDetail from './components/Detail/Product-Detail/product-detail';

// TẤT CẢ CÁC PROVIDER
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';  // ĐÃ IMPORT

import './i18n';

declare global {
  interface Window {
    AOS: any;
  }
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && window.AOS) {
      window.AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
      });
    }
  }, [loading]);

  return (
    <GoogleOAuthProvider clientId="973827648524-lhn84q1r885u537rnmttd8pktj1gpq7o.apps.googleusercontent.com">
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <SearchProvider>
                <Router>
                  <Preloader visible={loading} />
                  {!loading && (
                    <>
                      <Header />
                      <main className="min-h-screen bg-background text-primary font-open-sans">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/shop" element={<Shop />} />
                          <Route path="/teams" element={<Teams />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog-detail/:id" element={<BlogDetail />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/vouchers" element={<Vouchers />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/tov-privacy" element={<TovPrivacy />} />
                          <Route path="/order-success" element={<OrderSuccess />} />
                          <Route path="/order-fail" element={<OrderFail />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/product-detail/:id" element={<ProductDetail />} />
                        </Routes>
                      </main>
                      <Newsletter />
                      <Footer />
                    </>
                  )}
                </Router>
              </SearchProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
};

export default App;