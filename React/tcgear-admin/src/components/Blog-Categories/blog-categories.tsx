// blog-categories.tsx
import React, { useEffect, useState } from 'react';
import feather from 'feather-icons';
import AddBlogCategory from '../Modal/Add/add_blog-categories';
import EditBlogCategory from '../Modal/Edit/edit_blog-categories';
import './blog-categories.css';

interface BlogCategory {
  code: string;
  name: string;
  image: string;
  description: string;
  articleCount: number;
  status: 'active' | 'inactive';
}

const BlogCategories: React.FC = () => {
  const initialCategories: BlogCategory[] = [
    {
      code: 'ESPORTS_NEWS',
      name: 'Tin Tức Esports',
      image: 'http://static.photos/technology/640x360/1',
      description: 'Cập nhật tin tức mới nhất về các giải đấu esports và đội tuyển',
      articleCount: 25,
      status: 'active',
    },
    {
      code: 'GAMING_TIPS',
      name: 'Hướng Dẫn Chơi Game',
      image: 'http://static.photos/technology/640x360/2',
      description: 'Mẹo và hướng dẫn chi tiết để nâng cao kỹ năng chơi game',
      articleCount: 18,
      status: 'active',
    },
    {
      code: 'GEAR_REVIEWS',
      name: 'Đánh Giá Thiết Bị',
      image: 'http://static.photos/technology/640x360/3',
      description: 'Review chi tiết về các thiết bị gaming và phụ kiện',
      articleCount: 12,
      status: 'active',
    },
    {
      code: 'TEAM_PROFILES',
      name: 'Hồ Sơ Đội Tuyển',
      image: 'http://static.photos/technology/640x360/4',
      description: 'Giới thiệu về các đội tuyển esports nổi bật',
      articleCount: 8,
      status: 'active',
    },
    {
      code: 'EVENT_UPDATES',
      name: 'Cập Nhật Sự Kiện',
      image: 'http://static.photos/technology/640x360/5',
      description: 'Thông tin về các sự kiện và giải đấu sắp tới',
      articleCount: 14,
      status: 'active',
    },
    {
      code: 'PLAYER_INTERVIEWS',
      name: 'Phỏng Vấn Game Thủ',
      image: 'http://static.photos/technology/640x360/6',
      description: 'Cuộc trò chuyện với các game thủ chuyên nghiệp',
      articleCount: 12,
      status: 'active',
    },
  ];

  const [categories, setCategories] = useState<BlogCategory[]>(initialCategories);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | undefined>(undefined);

  useEffect(() => {
    // Initialize Feather icons
    feather.replace();
  }, []);

  const handleEdit = (category: BlogCategory) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const handleDelete = (code: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      setCategories(prev => prev.filter(cat => cat.code !== code));
    }
  };

  const handleAddSave = (data: { code: string; name: string; file?: File }) => {
    const newImage = data.file ? URL.createObjectURL(data.file) : 'http://static.photos/technology/640x360/default';
    const newCategory: BlogCategory = {
      code: data.code,
      name: data.name,
      image: newImage,
      description: 'Mô tả mặc định cho danh mục mới',
      articleCount: 0,
      status: 'active' as const,
    };
    setCategories(prev => [...prev, newCategory]);
    setIsAddOpen(false);
  };

  const handleEditSave = (data: { code: string; name: string; file?: File }) => {
    if (selectedCategory) {
      setCategories(prev =>
        prev.map(cat =>
          cat.code === selectedCategory.code
            ? {
                ...cat,
                code: data.code,
                name: data.name,
                image: data.file ? URL.createObjectURL(data.file) : cat.image,
              }
            : cat
        )
      );
    }
    setIsEditOpen(false);
    setSelectedCategory(undefined);
  };

  // Compute stats dynamically
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.status === 'active').length;
  const emptyCategories = categories.filter(c => c.articleCount === 0).length;
  const totalArticles = categories.reduce((sum, c) => sum + c.articleCount, 0);

  return (
    <main className="flex-1 overflow-y-auto p-4 max-w-7xl mx-auto md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 animate-slideUpFromBottom">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-accent font-orbitron">Quản Lý Danh Mục Blog</h1>
          <p className="text-accent/70 font-open-sans mt-1">Quản lý danh mục bài viết blog TCGear</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            className="bg-primary hover:bg-primary/90 text-accent py-2 px-4 rounded-md flex items-center font-open-sans transition-all duration-200 hover:scale-105"
            onClick={() => setIsAddOpen(true)}
          >
            <i data-feather="plus" className="w-5 h-5 mr-2" />
            Thêm Danh Mục Blog
          </button>
        </div>
      </div>

      {/* Blog Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:gap-8 md:mb-12">
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="layers" className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Tổng Số Danh Mục</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{totalCategories}</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="check-circle" className="w-6 h-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Danh Mục Đang Hoạt Động</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{activeCategories}</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="alert-circle" className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Danh Mục Chưa Có Bài Viết</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{emptyCategories}</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="file-text" className="w-6 h-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Tổng Số Bài Viết</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{totalArticles}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 md:gap-8 md:mb-12">
        {categories.map((category, index) => (
          <div
            key={category.code}
            className="category-card bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20 animate-in"
            data-code={category.code}
            data-name={category.name}
            data-image={category.image}
          >
            <div className="h-48 overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-accent font-orbitron">{category.name}</h3>
                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-open-sans">
                  {category.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                </span>
              </div>
              <p className="text-accent/70 mb-4 font-open-sans">{category.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-accent/70 font-open-sans">{category.articleCount} bài viết</span>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-accent/70 hover:text-primary rounded-full hover:bg-primary/10 edit-btn transition-all duration-200 hover:scale-110"
                    onClick={() => handleEdit(category)}
                  >
                    <i data-feather="edit" className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-accent/70 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-all duration-200 hover:scale-110"
                    onClick={() => handleDelete(category.code)}
                  >
                    <i data-feather="trash" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination for Blog Categories */}
      <div className="flex justify-center items-center mt-8 mb-8 animate-slideUpFromBottom">
        <nav className="flex items-center space-x-2">
          <a href="#" className="px-3 py-1 rounded border border-primary/20 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 hover:scale-105">
            <i data-feather="chevron-left" className="w-4 h-4" />
          </a>
          <a href="#" className="px-3 py-1 rounded border border-primary bg-primary text-accent font-open-sans transition-all duration-200">1</a>
          <a href="#" className="px-3 py-1 rounded border border-primary/20 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 hover:scale-105">2</a>
          <a href="#" className="px-3 py-1 rounded border border-primary/20 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 hover:scale-105">3</a>
          <span className="px-2 py-1 text-accent/70 font-open-sans">...</span>
          <a href="#" className="px-3 py-1 rounded border border-primary/20 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 hover:scale-105">4</a>
          <a href="#" className="px-3 py-1 rounded border border-primary/20 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 hover:scale-105">
            <i data-feather="chevron-right" className="w-4 h-4" />
          </a>
        </nav>
      </div>

      {/* System Status */}
      <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
        <h3 className="text-lg font-semibold text-accent font-orbitron mb-4">Trạng Thái Hệ Thống</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/10 p-4 rounded-lg animate-in">
            <div className="flex items-center">
              <i data-feather="server" className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110" />
              <span className="ml-2 text-sm font-semibold text-accent font-open-sans">Máy Chủ</span>
            </div>
            <p className="text-xs text-accent/70 mt-2 font-open-sans">Tất cả hệ thống hoạt động bình thường</p>
          </div>
          <div className="bg-primary/10 p-4 rounded-lg animate-in">
            <div className="flex items-center">
              <i data-feather="database" className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110" />
              <span className="ml-2 text-sm font-semibold text-accent font-open-sans">Cơ Sở Dữ Liệu</span>
            </div>
            <p className="text-xs text-accent/70 mt-2 font-open-sans">Thời gian phản hồi: 42ms</p>
          </div>
          <div className="bg-primary/10 p-4 rounded-lg animate-in">
            <div className="flex items-center">
              <i data-feather="hard-drive" className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110" />
              <span className="ml-2 text-sm font-semibold text-accent font-open-sans">Lưu Trữ</span>
            </div>
            <p className="text-xs text-accent/70 mt-2 font-open-sans">78% đã sử dụng - 12.4GB trống</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddBlogCategory
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddSave}
      />
      <EditBlogCategory
        isOpen={isEditOpen}
        category={selectedCategory}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedCategory(undefined);
        }}
        onSave={handleEditSave}
      />
    </main>
  );
};

export default BlogCategories;