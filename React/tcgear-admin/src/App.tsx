// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/sidebar';
import Header from './components/Header/header';
import MainContent from './components/Dashboard/dashboard';
import Product from './components/Product/product';
import Preloader from './components/Preloader/preloader';
import Categories from './components/Categories/categories';
import SubCategories from './components/Sub-Categories/sub-categories';
import Orders from './components/Orders/orders';
import User from './components/User/users';
import Teams from './components/Teams/teams';
import Blogs from './components/Blogs/blogs';
import BlogCategories from './components/Blog-Categories/blog-categories';
import Messages from './components/Messages/messages';
import Comments from './components/Comments/comments';
import Settings from './components/Settings/settings';
import Profile from './components/Profile/profile';

const App: React.FC = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (showPreloader) {
    return <Preloader visible={true} />;
  }

  return (
    <Router>
      <div className="bg-secondary text-accent flex h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleSidebar={toggleSidebar} />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/admin-product" element={<Product />} />
            <Route path="/admin-categories" element={<Categories />} />
            <Route path="/admin_sub-categories" element={<SubCategories />} />
            <Route path="/admin-orders" element={<Orders />} />
            <Route path="/admin-users" element={<User />} />
            <Route path="/admin-teams" element={<Teams />} />
            <Route path="/admin-blogs" element={<Blogs />} />
            <Route path="/admin_blogs-categories" element={<BlogCategories />} />
            <Route path="/admin-messages" element={<Messages />} />
            <Route path="/admin-comments" element={<Comments />} />
            <Route path="/admin-settings" element={<Settings />} />
            <Route path="/admin-profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;