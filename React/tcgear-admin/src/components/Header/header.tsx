// components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './header.css';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Feather icons
    if (typeof window !== 'undefined') {
      const feather = (window as any).feather;
      if (feather) {
        feather.replace();
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen, profileOpen]);

  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
    // Fix: Re-init Feather icons sau khi toggle để update icons trong dropdown
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).feather) {
        (window as any).feather.replace();
      }
    }, 0);
  };

  const toggleProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileOpen(!profileOpen);
    setNotificationsOpen(false);
    // Fix: Re-init Feather icons sau khi toggle để update icons trong dropdown
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).feather) {
        (window as any).feather.replace();
      }
    }, 0);
  };

  return (
    <header className="relative flex items-center justify-between px-4 py-4 bg-secondary border-b border-primary/20 md:px-6 transition-all duration-300 animate-slideUpFromBottom z-[1000]">
      <div className="flex items-center flex-1">
        <button
          id="sidebar-toggle"
          onClick={onToggleSidebar}
          className="text-accent hover:text-primary focus:outline-none lg:hidden mr-2 transition-transform duration-200 hover:scale-110"
        >
          <i data-feather="menu" className="w-6 h-6" />
        </button>
        <div className="header-search-container relative mx-2 lg:mx-0 max-w-md">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            <i data-feather="search" className="w-5 h-5 text-accent transition-transform duration-200 hover:scale-110" />
          </span>
          <input
            className="w-full pl-4 pr-10 py-2 rounded-md border-2 border-primary/30 bg-secondary text-accent focus:outline-none focus:border-primary font-open-sans"
            type="text"
            placeholder="Tìm kiếm"
          />
        </div>
      </div>
      <div className="mobile-header-right flex items-center">
        <div className="relative" ref={notificationsRef}>
          <button
            id="notifications-toggle"
            onClick={toggleNotifications}
            className="flex items-center text-accent hover:text-primary mx-2 lg:mx-4 relative transition-all duration-200 hover:scale-110"
          >
            <i data-feather="bell" className="w-5 h-5" />
            <span className="counter">3</span>
          </button>
          {notificationsOpen && (
            <div id="notifications-dropdown" className="dropdown-content w-64 show z-[999] absolute right-0 mt-2 bg-secondary border border-primary/20 rounded-lg shadow-xl">
              <div className="p-4 border-b border-primary/20 animate-slideUpFromBottom">
                <h3 className="text-accent font-semibold font-orbitron">Thông Báo</h3>
              </div>
              <div className="p-4 max-h-64 overflow-y-auto">
                <div className="flex items-center mb-4 animate-slideUpFromBottom">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <i data-feather="shopping-cart" className="w-4 h-4 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-accent font-open-sans">Đã nhận đơn hàng mới</p>
                    <p className="text-xs text-accent/70 font-open-sans">2 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center mb-4 animate-slideUpFromBottom">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <i data-feather="user-plus" className="w-4 h-4 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-accent font-open-sans">Khách hàng mới đăng ký</p>
                    <p className="text-xs text-accent/70 font-open-sans">5 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center animate-slideUpFromBottom">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <i data-feather="alert-triangle" className="w-4 h-4 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-accent font-open-sans">Tải máy chủ cao</p>
                    <p className="text-xs text-accent/70 font-open-sans">10 phút trước</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-primary/20 bg-primary/10">
                <Link
                  to="/notifications"
                  className="text-primary text-sm font-semibold font-open-sans text-center block transition-colors duration-200 hover:text-primary/80"
                >
                  Xem tất cả thông báo
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="relative mx-2 lg:mx-4" ref={profileRef}>
          <button onClick={toggleProfile} className="flex items-center text-accent hover:text-primary transition-all duration-200 hover:scale-105">
            <img
              className="h-8 w-8 rounded-full object-cover transition-transform duration-200 hover:scale-110"
              src="http://static.photos/people/200x200/1"
              alt="Người dùng quản trị"
            />
            <i data-feather="chevron-down" id="profile-chevron" className={`h-4 w-4 ml-1 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
          {profileOpen && (
            <div id="profile-dropdown" className="dropdown-content w-48 show z-[999] absolute right-0 mt-2 bg-secondary border border-primary/20 rounded-lg shadow-xl">
              <Link to="/admin-profile" className="font-open-sans transition-all duration-200 hover:bg-primary/10 block p-2">
                <i data-feather="user" className="h-5 w-5 inline mr-2" />
                Hồ Sơ
              </Link>
              <Link to="/settings" className="font-open-sans transition-all duration-200 hover:bg-primary/10 block p-2">
                <i data-feather="settings" className="h-5 w-5 inline mr-2" />
                Cài Đặt
              </Link>
              <Link to="/logout" className="font-open-sans transition-all duration-200 hover:bg-primary/10 block p-2">
                <i data-feather="log-out" className="h-5 w-5 inline mr-2" />
                Đăng Xuất
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;