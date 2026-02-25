// categories.tsx
import React, { useEffect } from 'react';
import './categories.css';
import AddCate from '../Modal/Add/add-cate';
import EditCate from '../Modal/Edit/edit-cate';

interface Category {
  code: string;
  name: string;
  image: string;
  productsCount: number;
  status: 'active' | 'inactive';
  description: string;
}

const categories: Category[] = [
  {
    code: 'AO_DAU_ESPORTS',
    name: 'Áo Đấu Esports',
    image: 'http://static.photos/technology/640x360/1',
    productsCount: 15,
    status: 'active',
    description: 'Áo đấu chính thức của các đội tuyển Esports hàng đầu',
  },
  {
    code: 'TAI_NGHE_GAMING',
    name: 'Tai Nghe Gaming',
    image: 'http://static.photos/technology/640x360/2',
    productsCount: 22,
    status: 'active',
    description: 'Tai nghe chuyên dụng cho game thủ với âm thanh surround 7.1',
  },
  {
    code: 'BAN_PHIM_CO',
    name: 'Bàn Phím Cơ',
    image: 'http://static.photos/technology/640x360/3',
    productsCount: 18,
    status: 'active',
    description: 'Bàn phím cơ chuyên nghiệp với đèn LED RGB',
  },
  // Add more categories as needed
];

const Categories: React.FC = () => {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);

  const stats = {
    total: 24,
    active: 18,
    empty: 3,
    subcategories: 45,
  };

  useEffect(() => {
    // Initialize Feather icons
    if (typeof window !== 'undefined' && (window as any).feather) {
      (window as any).feather.replace();
    }

    // Trigger animations
    const timer = setTimeout(() => {
      document.querySelectorAll('.animate-slideUpFromBottom').forEach((el) => {
        el.classList.add('opacity-100');
      });
      document.querySelectorAll('.grid-cols-3 > div').forEach((el, index) => {
        setTimeout(() => el.classList.add('animate-in'), index * 100);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedCategory(null);
  };

  const handleSaveEdit = (updated: Partial<Category>) => {
    // Handle save logic here (e.g., API call)
    console.log('Updated category:', { ...selectedCategory, ...updated });
    handleCloseEdit();
  };

  const handleCloseAdd = () => setShowAddModal(false);

  const handleSaveAdd = (newCategory: Omit<Category, 'productsCount' | 'status'>) => {
    // Handle add logic here (e.g., API call)
    console.log('New category:', newCategory);
    handleCloseAdd();
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 max-w-7xl mx-auto md:p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 animate-slideUpFromBottom">
        <div>
          <h1 className="text-3xl font-bold text-accent font-orbitron">Quản Lý Danh Mục</h1>
          <p className="text-accent/70 font-open-sans mt-2">Quản lý danh mục sản phẩm TCGear</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/90 text-accent py-2 px-4 rounded-md flex items-center font-open-sans transition-all duration-200 hover:scale-105"
          >
            <i data-feather="plus" className="w-5 h-5 mr-2"></i>
            Thêm Danh Mục
          </button>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:gap-8 md:mb-12 animate-slideUpFromBottom">
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-in">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10">
              <i data-feather="layers" className="w-6 h-6 text-primary"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Tổng Số Danh Mục</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{stats.total}</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-in">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/10">
              <i data-feather="check-circle" className="w-6 h-6 text-green-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Danh Mục Đang Hoạt Động</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{stats.active}</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-in">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500/10">
              <i data-feather="alert-circle" className="w-6 h-6 text-yellow-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Danh Mục Chưa Có Sản Phẩm</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{stats.empty}</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-in">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/10">
              <i data-feather="layers" className="w-6 h-6 text-blue-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Tổng Số Danh Mục Phụ</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{stats.subcategories}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 md:gap-8 md:mb-12 animate-slideUpFromBottom">
        {categories.map((category, index) => (
          <div
            key={category.code}
            className="category-card bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20 animate-in"
            data-code={category.code}
            data-name={category.name}
            data-image={category.image}
          >
            <div className="h-48 overflow-hidden">
              <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-accent font-orbitron">{category.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full font-open-sans ${
                  category.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'
                }`}>
                  {category.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                </span>
              </div>
              <p className="text-accent/70 mb-4 font-open-sans">{category.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-accent/70 font-open-sans">{category.productsCount} sản phẩm</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-accent/70 hover:text-primary rounded-full hover:bg-primary/10 edit-btn transition-all duration-200 hover:scale-110"
                  >
                    <i data-feather="edit" className="w-4 h-4"></i>
                  </button>
                  <button className="p-2 text-accent/70 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-all duration-200 hover:scale-110">
                    <i data-feather="trash" className="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination for Main Categories */}
      <div className="flex justify-center items-center mt-8 mb-8 animate-slideUpFromBottom">
        <nav className="flex items-center space-x-2">
          <button className="px-3 py-1 rounded border border-primary/20 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 hover:scale-105">
            <i data-feather="chevron-left" className="w-4 h-4"></i>
          </button>
          <button className="px-3 py-1 rounded border border-primary bg-primary text-accent font-open-sans">1</button>
          <button className="px-3 py-1 rounded border border-primary/20 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 hover:scale-105">2</button>
          <button className="px-3 py-1 rounded border border-primary/20 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 hover:scale-105">3</button>
          <span className="px-2 py-1 text-accent/70 font-open-sans">...</span>
          <button className="px-3 py-1 rounded border border-primary/20 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 hover:scale-105">8</button>
          <button className="px-3 py-1 rounded border border-primary/20 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 hover:scale-105">
            <i data-feather="chevron-right" className="w-4 h-4"></i>
          </button>
        </nav>
      </div>

      {showAddModal && <AddCate onClose={handleCloseAdd} onSave={handleSaveAdd} />}
      {showEditModal && selectedCategory && <EditCate category={selectedCategory} onClose={handleCloseEdit} onSave={handleSaveEdit} />}
    </main>
  );
};

export default Categories;