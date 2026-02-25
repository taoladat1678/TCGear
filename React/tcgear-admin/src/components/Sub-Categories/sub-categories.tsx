// sub-categories.tsx
import React, { useEffect, useState } from 'react';
import feather from 'feather-icons';
import './sub-categories.css';
import AddSubCate from '../Modal/Add/add-sub-cate';
import EditSubCate from '../Modal/Edit/edit-sub-cate';

interface SubCategory {
  code: string;
  name: string;
  image: string;
  parent: string;
  productsCount: number;
  status: 'active';
}

const subCategoriesData: SubCategory[] = [
  { code: 'AO_DAU_T1', name: 'Áo Đấu T1', image: 'http://static.photos/technology/640x360/7', parent: 'Áo Đấu Esports', productsCount: 5, status: 'active' },
  { code: 'AO_DAU_GENG', name: 'Áo Đấu Gen.G', image: 'http://static.photos/technology/640x360/8', parent: 'Áo Đấu Esports', productsCount: 7, status: 'active' },
  { code: 'AO_DAU_DRX', name: 'Áo Đấu DRX', image: 'http://static.photos/technology/640x360/9', parent: 'Áo Đấu Esports', productsCount: 3, status: 'active' },
  { code: 'TAI_NGHE_KD', name: 'Tai Nghe Không Dây', image: 'http://static.photos/technology/640x360/1', parent: 'Tai Nghe Gaming', productsCount: 10, status: 'active' },
  { code: 'TAI_NGHE_CD', name: 'Tai Nghe Có Dây', image: 'http://static.photos/technology/640x360/2', parent: 'Tai Nghe Gaming', productsCount: 8, status: 'active' },
  { code: 'TAI_NGHE_RGB', name: 'Tai Nghe RGB', image: 'http://static.photos/technology/640x360/3', parent: 'Tai Nghe Gaming', productsCount: 4, status: 'active' },
  // Add more as needed
];

export const SubCategories: React.FC = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>(subCategoriesData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubCate, setEditingSubCate] = useState<SubCategory | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6; // Based on grid showing 6 cards

  const totalSubCategories = 45;
  const activeSubCategories = 42;
  const emptySubCategories = 5;
  const totalProducts = 156;

  useEffect(() => {
    // Initialize Feather icons
    feather.replace();

    // Trigger animations on mount
    const timer = setTimeout(() => {
      document.querySelectorAll('.animate-slideUpFromBottom')?.forEach((el: Element) => {
        el.classList.remove('animate-slideUpFromBottom');
      });
      document.querySelectorAll('.sub-category-card')?.forEach((el: Element, index: number) => {
        setTimeout(() => {
          (el as HTMLElement).classList.add('animate-in');
        }, index * 100);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (subCate: SubCategory) => {
    setEditingSubCate(subCate);
    setShowEditModal(true);
  };

  const handleAddSuccess = (newSubCate: SubCategory) => {
    setSubCategories([...subCategories, newSubCate]);
    setShowAddModal(false);
  };

  const handleEditSuccess = (updatedSubCate: SubCategory) => {
    setSubCategories(subCategories.map((sc) => (sc.code === updatedSubCate.code ? updatedSubCate : sc)));
    setShowEditModal(false);
    setEditingSubCate(null);
  };

  const paginatedSubCategories = subCategories.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <main className="flex-1 overflow-y-auto p-4 max-w-7xl mx-auto md:p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 animate-slideUpFromBottom">
        <div>
          <h1 className="text-3xl font-bold text-accent font-orbitron">Quản Lý Danh Mục Phụ</h1>
          <p className="text-accent/70 font-open-sans mt-2">Quản lý danh mục phụ sản phẩm TCGear</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/90 text-accent py-2 px-4 rounded-md flex items-center font-open-sans transition-all duration-200 hover:scale-105"
          >
            <i data-feather="plus" className="w-5 h-5 mr-2"></i>
            Thêm Danh Mục Phụ
          </button>
        </div>
      </div>

      {/* Subcategory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:gap-8 md:mb-12 animate-slideUpFromBottom">
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-in">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="layers" className="w-6 h-6 text-primary"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Tổng Số Danh Mục Phụ</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{totalSubCategories}</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-in">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="check-circle" className="w-6 h-6 text-green-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Danh Mục Phụ Đang Hoạt Động</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{activeSubCategories}</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-in">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="alert-circle" className="w-6 h-6 text-yellow-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Danh Mục Phụ Chưa Có Sản Phẩm</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{emptySubCategories}</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-in">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="database" className="w-6 h-6 text-blue-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Tổng Sản Phẩm Trong Danh Mục Phụ</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{totalProducts}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 md:gap-8 md:mb-12 animate-slideUpFromBottom">
        {paginatedSubCategories.map((subCate, index) => (
          <div
            key={subCate.code}
            className="category-card sub-category-card bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20"
            data-code={subCate.code}
            data-name={subCate.name}
            data-image={subCate.image}
            data-parent={subCate.parent}
          >
            <div className="h-48 overflow-hidden">
              <img src={subCate.image} alt={subCate.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg md:text-xl font-semibold text-accent font-orbitron">{subCate.name}</h3>
                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-open-sans">
                  {subCate.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                </span>
              </div>
              <span className="parent-tag font-open-sans">Thuộc: {subCate.parent}</span>
              <p className="text-accent/70 mt-2 mb-4 font-open-sans">
                {subCate.name.includes('Áo Đấu') ? `Áo đấu đội ${subCate.name.split(' ').slice(-1)[0]} Esports` :
                 subCate.name.includes('Tai Nghe') ? `${subCate.name.toLowerCase()}` : ''}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-accent/70 font-open-sans">{subCate.productsCount} sản phẩm</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(subCate)}
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

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 mb-8 animate-slideUpFromBottom">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border border-primary/20 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            <i data-feather="chevron-left" className="w-4 h-4"></i>
          </button>
          <button
            onClick={() => setPage(1)}
            className={`px-3 py-1 rounded border ${page === 1 ? 'border-primary bg-primary text-accent' : 'border-primary/20 text-accent hover:bg-primary/10 hover:text-primary'} font-open-sans transition-all duration-200 hover:scale-105`}
          >
            1
          </button>
          <button
            onClick={() => setPage(2)}
            className={`px-3 py-1 rounded border ${page === 2 ? 'border-primary bg-primary text-accent' : 'border-primary/20 text-accent hover:bg-primary/10 hover:text-primary'} font-open-sans transition-all duration-200 hover:scale-105`}
          >
            2
          </button>
          <button
            onClick={() => setPage(3)}
            className={`px-3 py-1 rounded border ${page === 3 ? 'border-primary bg-primary text-accent' : 'border-primary/20 text-accent hover:bg-primary/10 hover:text-primary'} font-open-sans transition-all duration-200 hover:scale-105`}
          >
            3
          </button>
          <span className="px-2 py-1 text-accent/70 font-open-sans">...</span>
          <button
            onClick={() => setPage(5)}
            className={`px-3 py-1 rounded border ${page === 5 ? 'border-primary bg-primary text-accent' : 'border-primary/20 text-accent hover:bg-primary/10 hover:text-primary'} font-open-sans transition-all duration-200 hover:scale-105`}
          >
            5
          </button>
          <button
            onClick={() => setPage(p => Math.min(5, p + 1))}
            disabled={page === 5}
            className="px-3 py-1 rounded border border-primary/20 text-accent hover:bg-primary/10 hover:text-primary font-open-sans transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            <i data-feather="chevron-right" className="w-4 h-4"></i>
          </button>
        </nav>
      </div>

      {showAddModal && <AddSubCate onClose={() => setShowAddModal(false)} onSuccess={handleAddSuccess} />}
      {showEditModal && editingSubCate && (
        <EditSubCate subCate={editingSubCate} onClose={() => setShowEditModal(false)} onSuccess={handleEditSuccess} />
      )}
    </main>
  );
};

export default SubCategories;