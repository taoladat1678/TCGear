// Updated Product.tsx
import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';
import AddProductModal from '../Modal/Add/add-product';
import EditProductModal from '../Modal/Edit/edit-product';
import ViewProductModal from '../Modal/View/view-product';
import './product.css';

const products = {
  'PROD-001': {
    id: '#PROD-001',
    name: 'Tai Nghe Gaming Pro',
    price: '$149.99',
    category: 'Tai Nghe',
    subcategory: 'Tai Nghe Không Dây',
    stock: '45',
    status: 'Hoạt Động',
    description: 'Tai nghe gaming cao cấp với âm thanh vòm 7.1, micro chống ồn và đèn RGB tùy chỉnh.'
  },
  'PROD-002': {
    id: '#PROD-002',
    name: 'Bàn Phím Cơ RGB',
    price: '$89.50',
    category: 'Bàn Phím',
    subcategory: 'Bàn Phím Cơ Tenkeyless',
    stock: '23',
    status: 'Hết Hàng',
    description: 'Bàn phím cơ với switch Cherry MX, đèn nền RGB và thiết kế compact.'
  },
  'PROD-003': {
    id: '#PROD-003',
    name: 'Áo Đấu Esports T1',
    price: '$49.99',
    category: 'Áo Đấu',
    subcategory: 'Áo Thi Đấu Chính Thức',
    stock: '120',
    status: 'Hoạt Động',
    description: 'Áo đấu chính thức của đội T1, chất liệu thoáng khí, in logo esports.'
  },
  'PROD-004': {
    id: '#PROD-004',
    name: 'Chuột Gaming Ultra',
    price: '$79.99',
    category: 'Chuột',
    subcategory: 'Chuột Không Dây',
    stock: '67',
    status: 'Hoạt Động',
    description: 'Chuột gaming không dây với DPI điều chỉnh, pin sạc và cảm biến quang học chính xác.'
  },
  'PROD-005': {
    id: '#PROD-005',
    name: 'Ghế Gaming Ergonomic',
    price: '$299.99',
    category: 'Ghế',
    subcategory: 'Ghế Gaming Ergonomic',
    stock: '8',
    status: 'Thấp',
    description: 'Ghế gaming ergonomic với đệm lưng hỗ trợ, tay vịn điều chỉnh và vật liệu da PU cao cấp.'
  }
};

const Product: React.FC = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    // Initialize Feather icons immediately on mount
    feather.replace();

    // Trigger animations after load
    const timer = setTimeout(() => {
      document.querySelectorAll('.animate-slideUpFromBottom').forEach((el) => {
        el.style.opacity = '1';
      });
      document.querySelectorAll('.table-container tbody tr, .divide-y > div, .grid-cols-3 > div').forEach((el) => {
        el.classList.add('animate-in');
      });
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const openEditModal = (id: string) => {
    setSelectedProduct(products[id]);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  const openViewModal = (id: string) => {
    setSelectedProduct(products[id]);
    setViewModalOpen(true);
  };
  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveAdd = () => {
    // Implement save logic
    closeAddModal();
  };

  const handleSaveEdit = () => {
    // Implement save logic
    closeEditModal();
  };

  const applyFilters = () => {
    // Implement filtering logic here
    alert('Áp dụng bộ lọc');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-secondary text-accent">
      <main className="flex-1 overflow-y-auto p-4 max-w-7xl mx-auto md:p-6">
        {/* Product Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:gap-8 md:mb-12">
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
                <i data-feather="package" className="w-6 h-6 text-primary"></i>
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Tổng Sản Phẩm</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">187</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110"></i> 3.1% so với tháng trước
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
                <i data-feather="check-circle" className="w-6 h-6 text-primary"></i>
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Sản Phẩm Hoạt Động</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">162</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110"></i> 2.5% so với tháng trước
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
                <i data-feather="alert-triangle" className="w-6 h-6 text-primary"></i>
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Hết Hàng</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">12</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-down" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110"></i> 1.2% so với tháng trước
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
                <i data-feather="dollar-sign" className="w-6 h-6 text-primary"></i>
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Doanh Thu Sản Phẩm</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">$24,569</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110"></i> 12.5% so với tháng trước
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 mb-6 animate-slideUpFromBottom">
          <h3 className="text-lg font-semibold text-accent font-orbitron mb-4">Bộ Lọc</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Danh Mục</label>
              <select id="filter-category" className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
                <option>Tất Cả</option>
                <option>Áo Đấu</option>
                <option>Tai Nghe</option>
                <option>Bàn Phím</option>
                <option>Chuột</option>
                <option>Phụ Kiện</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Danh Mục Phụ</label>
              <select id="filter-subcategory" className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
                <option>Tất Cả</option>
                <option>Áo Thi Đấu Chính Thức</option>
                <option>Áo Fan Edition</option>
                <option>Tai Nghe Không Dây</option>
                <option>Tai Nghe Có Dây</option>
                <option>Bàn Phím Cơ Tenkeyless</option>
                <option>Bàn Phím Full-Size</option>
                <option>Chuột Không Dây</option>
                <option>Chuột Có Dây</option>
                <option>Bàn Di Chuột Kích Thước Lớn</option>
                <option>Phụ Kiện Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Trạng Thái</label>
              <select id="filter-status" className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
                <option>Tất Cả</option>
                <option>Hoạt Động</option>
                <option>Hết Hàng</option>
                <option>Thấp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Kho Hàng</label>
              <select id="filter-stock" className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
                <option>Tất Cả</option>
                <option>Thấp (&lt;10)</option>
                <option>Trung Bình (10-50)</option>
                <option>Cao (&gt;50)</option>
              </select>
            </div>
          </div>
          <button onClick={applyFilters} className="mt-4 px-4 py-2 bg-primary text-accent rounded-md font-open-sans font-semibold transition-all duration-200 hover:bg-primary/80 hover:scale-105">
            Áp Dụng Lọc
          </button>
        </div>

        {/* Products Table */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8 md:gap-8 md:mb-12">
          <div className="bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20 animate-slideUpFromBottom">
            <div className="px-4 py-4 md:px-6 border-b border-primary/20 flex justify-between items-center flex-col sm:flex-row gap-4">
              <h3 className="text-lg font-semibold text-accent font-orbitron">Danh Sách Sản Phẩm</h3>
              <div className="flex items-center gap-2">
                <button onClick={openAddModal} className="bg-primary text-accent px-4 py-2 rounded-md font-open-sans font-semibold transition-all duration-200 hover:bg-primary/80 hover:scale-105 flex items-center">
                  <i data-feather="plus" className="w-4 h-4 mr-2"></i>
                  Thêm Sản Phẩm Mới
                </button>
                <button className="text-primary text-sm flex items-center font-open-sans hover:text-primary/80 transition-all duration-200 hover:scale-110">
                  <i data-feather="download" className="w-4 h-4 mr-1"></i> Xuất
                </button>
              </div>
            </div>
            <div className="overflow-x-auto table-container">
              <table className="min-w-full divide-y divide-primary/20">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      ID Sản Phẩm
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Ảnh
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Tên Sản Phẩm
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/20">
                  {Object.entries(products).map(([id, product]) => (
                    <tr key={id} className="animate-in">
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{product.id}</td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                        <img src="" alt={product.name} className="h-10 w-10 rounded object-cover" />
                      </td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{product.name}</td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{product.price}</td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm font-open-sans">
                        <button onClick={() => openViewModal(id)} className="text-green-500 hover:text-green-700 mr-2">
                          <i data-feather="eye" className="w-4 h-4"></i>
                        </button>
                        <button onClick={() => openEditModal(id)} className="text-blue-500 hover:text-blue-700 mr-2">
                          <i data-feather="edit" className="w-4 h-4"></i>
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <i data-feather="trash-2" className="w-4 h-4"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-4 md:px-6 border-t border-primary/20 flex justify-end items-center">
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200" disabled>
                  <i data-feather="chevron-left" className="w-4 h-4"></i>
                </button>
                <button className="px-3 py-1 bg-primary text-accent rounded-md font-open-sans transition-all duration-200">1</button>
                <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200">2</button>
                <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200">3</button>
                <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200">
                  <i data-feather="chevron-right" className="w-4 h-4"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
          <h3 className="text-lg font-semibold text-accent font-orbitron mb-4">Trạng Thái Hệ Thống</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg animate-in">
              <div className="flex items-center">
                <i data-feather="server" className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110"></i>
                <span className="ml-2 text-sm font-semibold text-accent font-open-sans">Máy Chủ</span>
              </div>
              <p className="text-xs text-accent/70 mt-2 font-open-sans">Tất cả hệ thống hoạt động bình thường</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg animate-in">
              <div className="flex items-center">
                <i data-feather="database" className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110"></i>
                <span className="ml-2 text-sm font-semibold text-accent font-open-sans">Cơ Sở Dữ Liệu</span>
              </div>
              <p className="text-xs text-accent/70 mt-2 font-open-sans">Thời gian phản hồi: 42ms</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg animate-in">
              <div className="flex items-center">
                <i data-feather="hard-drive" className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110"></i>
                <span className="ml-2 text-sm font-semibold text-accent font-open-sans">Lưu Trữ</span>
              </div>
              <p className="text-xs text-accent/70 mt-2 font-open-sans">78% đã sử dụng - 12.4GB trống</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-primary/20 p-4 md:p-6 transition-all duration-300 animate-slideUpFromBottom">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-accent/50 font-open-sans">© 2025 TCGear. Tất cả quyền được bảo lưu.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://facebook.com/tcgear" className="text-accent/70 hover:text-primary font-open-sans transition-transform duration-200 hover:scale-110">
              <i data-feather="facebook" className="w-5 h-5"></i>
            </a>
            <a href="https://twitter.com/tcgear" className="text-accent/70 hover:text-primary font-open-sans transition-transform duration-200 hover:scale-110">
              <i data-feather="twitter" className="w-5 h-5"></i>
            </a>
            <a href="https://instagram.com/tcgear" className="text-accent/70 hover:text-primary font-open-sans transition-transform duration-200 hover:scale-110">
              <i data-feather="instagram" className="w-5 h-5"></i>
            </a>
            <a href="https://youtube.com/tcgear" className="text-accent/70 hover:text-primary font-open-sans transition-transform duration-200 hover:scale-110">
              <i data-feather="youtube" className="w-5 h-5"></i>
            </a>
          </div>
        </div>
      </footer>

      <AddProductModal open={addModalOpen} onClose={closeAddModal} onSave={handleSaveAdd} />
      <EditProductModal open={editModalOpen} onClose={closeEditModal} onSave={handleSaveEdit} product={selectedProduct} />
      <ViewProductModal open={viewModalOpen} product={selectedProduct} onClose={closeViewModal} />
    </div>
  );
};

export default Product;