// components/Sidebar.tsx
import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Feather icons
    if (typeof window !== 'undefined') {
      const feather = (window as any).feather;
      if (feather) {
        feather.replace();
      }
    }
  }, []);

  const toggleSubmenu = (id: string) => {
    const submenu = document.getElementById(`${id}-submenu`);
    const chevron = document.getElementById(`${id}-chevron`);
    const isOpenSub = submenu?.classList.contains('show');

    // Close all submenus
    document.querySelectorAll('.sidebar-submenu').forEach((s) => s.classList.remove('show'));
    document.querySelectorAll('[id$="-chevron"]').forEach((c) => c.classList.remove('rotate-180'));

    // Toggle current
    if (!isOpenSub && submenu && chevron) {
      submenu.classList.add('show');
      chevron.classList.add('rotate-180');
    }
  };

  // helper function để set class active cho main links
  const mainLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 ${isActive ? 'active' : ''}`;

  // helper function cho sub links
  const subLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center pl-12 pr-4 py-1 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 ${isActive ? 'active' : ''}`;

  // Kiểm tra active cho parent categories
  const isCategoriesActive = location.pathname === '/admin-categories' || location.pathname === '/admin_sub-categories';

  // Kiểm tra active cho parent blogs
  const isBlogsActive = location.pathname === '/admin-blogs' || location.pathname === '/admin_blogs-categories';

  const parentClass = (isActive: boolean) =>
    `flex items-center px-4 py-2 text-accent hover:bg-primary/10 hover:text-primary font-open-sans cursor-pointer transition-all duration-200 ${isActive ? 'active' : ''}`;

  return (
    <>
      {/* Backdrop for mobile sidebar */}
      <div
        className={`fixed inset-0 z-[1000] bg-secondary/50 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div
        className={`fixed inset-y-0 left-0 z-[1001] w-64 bg-secondary border-r border-primary/20 lg:static lg:inset-0 transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 animate-slideInFromLeft`}
      >
        <div className="flex items-center justify-center h-16 bg-secondary border-b border-primary/20">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/T1_esports_logo.svg/1200px-T1_esports_logo.svg.png"
            className="h-8 w-auto transition-transform duration-200 hover:scale-110"
            alt="TCGear Logo"
          />
          <span className="ml-2 text-lg font-bold text-primary font-orbitron">TCGear Admin</span>
        </div>

        <nav className="mt-5">
          <NavLink to="/" className={mainLinkClass} end onClick={isOpen ? onClose : undefined}>
            <i data-feather="home" className="w-5 h-5" />
            <span className="mx-4">Bảng Điều Khiển</span>
          </NavLink>

          <NavLink to="/admin-product" className={mainLinkClass} end onClick={isOpen ? onClose : undefined}>
            <i data-feather="package" className="w-5 h-5" />
            <span className="mx-4">Sản Phẩm</span>
          </NavLink>

          <div className="sidebar-item">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu('categories');
              }}
              className={parentClass(isCategoriesActive)}
            >
              <i data-feather="layers" className="w-5 h-5" />
              <span className="mx-4">Danh Mục</span>
              <i data-feather="chevron-down" id="categories-chevron" className="w-4 h-4 ml-auto transition-transform duration-200" />
            </a>
            <div id="categories-submenu" className="sidebar-submenu bg-secondary/50">
              <NavLink to="/admin-categories" className={subLinkClass} end onClick={isOpen ? onClose : undefined}>
                <i data-feather="layers" className="w-4 h-4 mr-2" />
                <span>Danh mục chính</span>
              </NavLink>
              <NavLink to="/admin_sub-categories" className={subLinkClass} end onClick={isOpen ? onClose : undefined}>
                <i data-feather="list" className="w-4 h-4 mr-2" />
                <span>Danh mục phụ</span>
              </NavLink>
            </div>
          </div>

          <NavLink to="/admin-orders" className={mainLinkClass} end onClick={isOpen ? onClose : undefined}>
            <i data-feather="shopping-cart" className="w-5 h-5" />
            <span className="mx-4">Đơn Hàng</span>
          </NavLink>

          <NavLink to="/admin-users" className={mainLinkClass} end onClick={isOpen ? onClose : undefined}>
            <i data-feather="users" className="w-5 h-5" />
            <span className="mx-4">Người Dùng</span>
          </NavLink>

          <NavLink to="/admin-teams" className={mainLinkClass} end onClick={isOpen ? onClose : undefined}>
            <i data-feather="grid" className="w-5 h-5" />
            <span className="mx-4">Đội Tuyển</span>
          </NavLink>

          <div className="sidebar-item">
            <a
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu('blogs');
              }}
              className={parentClass(isBlogsActive)}
            >
              <i data-feather="file-text" className="w-5 h-5" />
              <span className="mx-4">Bài Viết Blog</span>
              <i data-feather="chevron-down" id="blogs-chevron" className="w-4 h-4 ml-auto transition-transform duration-200" />
            </a>
            <div id="blogs-submenu" className="sidebar-submenu bg-secondary/50">
              <NavLink to="/admin-blogs" className={subLinkClass} end onClick={isOpen ? onClose : undefined}>
                <i data-feather="file-text" className="w-4 h-4 mr-2" />
                <span>Blog</span>
              </NavLink>
              <NavLink to="/admin_blogs-categories" className={subLinkClass} end onClick={isOpen ? onClose : undefined}>
                <i data-feather="folder" className="w-4 h-4 mr-2" />
                <span>Danh mục blog</span>
              </NavLink>
            </div>
          </div>

          <NavLink to="/admin-messages" className={mainLinkClass} end onClick={isOpen ? onClose : undefined}>
            <i data-feather="message-circle" className="w-5 h-5" />
            <span className="mx-4">Tin Nhắn</span>
          </NavLink>

          <NavLink to="/admin-comments" className={mainLinkClass} end onClick={isOpen ? onClose : undefined}>
            <i data-feather="message-square" className="w-5 h-5" />
            <span className="mx-4">Bình Luận</span>
          </NavLink>

          <NavLink to="/admin-settings" className={mainLinkClass} end onClick={isOpen ? onClose : undefined}>
            <i data-feather="settings" className="w-5 h-5" />
            <span className="mx-4">Cài Đặt</span>
          </NavLink>

          {/* Đường kẻ ngăn cách bên trên nút đăng xuất */}
          <div className="border-t border-white/20 mx-4 my-4"></div>

          <NavLink to="/logout" className={mainLinkClass} end onClick={isOpen ? onClose : undefined}>
            <i data-feather="log-out" className="w-5 h-5" />
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfu2l_-fwZZXdNqTOioCCYTKMaRtGDNpiS9w&s" 
              alt="User Avatar" 
              className="w-5 h-5 rounded-full mx-2" 
            />
            <span className="mx-2">Đăng Xuất</span>
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;