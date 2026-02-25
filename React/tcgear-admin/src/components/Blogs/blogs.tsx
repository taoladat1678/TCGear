// blogs.tsx
import React, { useState, useEffect } from 'react';
import './blogs.css';
import AddBlog from '../Modal/Add/add-blog';
import ViewBlog from '../Modal/View/view-blog';
import EditBlog from '../Modal/Edit/edit-blog';

type BlogPost = {
  id: string;
  title: string;
  author: string;
  date: string;
  views: number;
  status: 'published' | 'draft' | 'scheduled';
  content: string;
  thumbnail: string;
};

const initialBlogData: BlogPost[] = [
  {
    id: '#001',
    title: 'Cách chọn bàn phím cơ tốt nhất cho game thủ',
    author: 'Admin',
    date: '2025-10-15T10:00',
    views: 1200,
    status: 'published',
    content: 'Nội dung chi tiết về cách chọn bàn phím cơ tốt nhất cho game thủ. Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    thumbnail: 'https://picsum.photos/50/50?random=1'
  },
  {
    id: '#002',
    title: 'Top 5 tai nghe gaming 2023',
    author: 'Moderator',
    date: '2025-10-14T14:30',
    views: 3400,
    status: 'published',
    content: 'Danh sách top 5 tai nghe gaming năm 2023. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
    thumbnail: 'https://picsum.photos/50/50?random=2'
  },
  {
    id: '#003',
    title: 'Hướng dẫn setup gaming station hoàn hảo',
    author: 'Admin',
    date: '2025-10-13T09:15',
    views: 5600,
    status: 'published',
    content: 'Hướng dẫn chi tiết setup gaming station. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...',
    thumbnail: 'https://picsum.photos/50/50?random=3'
  },
  {
    id: '#004',
    title: 'Review áo đấu T1 mới nhất',
    author: 'Content Writer',
    date: '2025-10-12T16:45',
    views: 2800,
    status: 'draft',
    content: 'Review chi tiết áo đấu T1 mới. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...',
    thumbnail: 'https://picsum.photos/50/50?random=4'
  },
  {
    id: '#005',
    title: 'Esports trends 2024',
    author: 'Admin',
    date: '2025-10-11T11:20',
    views: 4100,
    status: 'scheduled',
    content: 'Xu hướng esports năm 2024. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...',
    thumbnail: 'https://picsum.photos/50/50?random=5'
  },
  {
    id: '#006',
    title: 'Phân tích meta League of Legends mùa mới',
    author: 'Content Writer',
    date: '2025-10-10T13:00',
    views: 3200,
    status: 'published',
    content: 'Phân tích chi tiết meta mới của League of Legends. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...',
    thumbnail: 'https://picsum.photos/50/50?random=6'
  },
  {
    id: '#007',
    title: 'Top chuột gaming dưới 1 triệu',
    author: 'Moderator',
    date: '2025-10-09T15:30',
    views: 1800,
    status: 'draft',
    content: 'Danh sách top chuột gaming giá rẻ dưới 1 triệu. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo...',
    thumbnail: 'https://picsum.photos/50/50?random=7'
  },
  {
    id: '#008',
    title: 'Cập nhật patch Valorant 7.0',
    author: 'Admin',
    date: '2025-10-08T12:45',
    views: 4500,
    status: 'scheduled',
    content: 'Những thay đổi chính trong patch 7.0 của Valorant. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...',
    thumbnail: 'https://picsum.photos/50/50?random=8'
  },
  {
    id: '#009',
    title: 'Hướng dẫn build PC esports budget',
    author: 'Content Writer',
    date: '2025-10-07T10:20',
    views: 2900,
    status: 'published',
    content: 'Hướng dẫn build PC esports với ngân sách hạn chế. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim...',
    thumbnail: 'https://picsum.photos/50/50?random=9'
  },
  {
    id: '#010',
    title: 'Phỏng vấn tuyển thủ T1 Faker',
    author: 'Admin',
    date: '2025-10-06T14:00',
    views: 6700,
    status: 'published',
    content: 'Phỏng vấn độc quyền với tuyển thủ huyền thoại T1 Faker. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium...',
    thumbnail: 'https://picsum.photos/50/50?random=10'
  }
];

const Blogs: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleAddSubmit = (newPost: { title: string; author: string; date: string; status: 'published' | 'draft' | 'scheduled'; content: string; thumbnail?: string }) => {
    const id = `#${Math.max(...posts.map(p => parseInt(p.id.slice(1)))) + 1}`;
    const addedPost: BlogPost = {
      ...newPost,
      id,
      thumbnail: newPost.thumbnail || 'https://picsum.photos/50/50?random=' + Math.floor(Math.random() * 100),
      views: 0
    };
    setPosts([addedPost, ...posts]);
    setShowAddModal(false);
    // Note: Total stats are hardcoded in UI, update if needed
  };

  const handleEditSubmit = (updatedPost: BlogPost) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
    setShowEditModal(false);
  };

  const handleViewPost = (post: BlogPost) => {
    setSelectedPost(post);
    setShowViewModal(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  // Initialize Feather Icons immediately on mount
  useEffect(() => {
    // Ensure Feather Icons script is loaded and replace icons
    if (typeof window !== 'undefined') {
      // If feather is globally available (e.g., via script tag in index.html)
      if (window['feather']) {
        window['feather'].replace();
      } else {
        // Dynamic import if using npm package
        import('feather-icons').then((module) => {
          module.replace();
        }).catch((err) => {
          console.warn('Feather Icons not loaded:', err);
        });
      }
    }
  }, []);

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.animate-slideUpFromBottom').forEach(el => {
        el.style.opacity = '1';
      });
      document.querySelectorAll<HTMLElement>('.table-container tbody tr').forEach((el) => {
        el.classList.add('animate-in');
      });
      document.querySelectorAll<HTMLElement>('.grid-cols-3 > div').forEach(el => {
        el.classList.add('animate-in');
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Hardcoded stats
  const totalPosts = 129;
  const newPosts = 8;
  const activePosts = 112;
  const readRate = 87;

  const statusClass = (status: BlogPost['status']) => {
    switch (status) {
      case 'published': return 'status-published';
      case 'draft': return 'status-draft';
      case 'scheduled': return 'status-scheduled';
      default: return '';
    }
  };

  const formatViews = (views: number) => views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views.toString();

  return (
    <main className="flex-1 overflow-y-auto p-4 max-w-7xl md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 animate-slideUpFromBottom">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-accent font-orbitron">Quản Lý Bài Viết Blog</h1>
          <p className="text-accent/70 font-open-sans mt-1">Quản lý thông tin và hoạt động của tất cả bài viết blog</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-accent rounded-md font-open-sans hover:bg-primary/90 transition flex items-center transition-all duration-200 hover:scale-105"
          >
            <i data-feather="plus" className="w-4 h-4 mr-2"></i> Thêm Bài Viết
          </button>
          <button className="px-4 py-2 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition flex items-center transition-all duration-200 hover:scale-105">
            <i data-feather="download" className="w-4 h-4 mr-2"></i> Xuất CSV
          </button>
        </div>
      </div>

      {/* Blog Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:gap-8 md:mb-12 animate-slideUpFromBottom">
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="file-text" className="w-6 h-6 text-primary"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Tổng Bài Viết</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{totalPosts}</h3>
            </div>
          </div>
          <p className="text-sm text-accent/70 mt-2 font-open-sans">
            <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110"></i> 5.7% so với tuần trước
          </p>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/20 transition-transform duration-300 hover:scale-110">
              <i data-feather="user-plus" className="w-6 h-6 text-green-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Bài Viết Mới</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{newPosts}</h3>
            </div>
          </div>
          <p className="text-sm text-accent/70 mt-2 font-open-sans">
            <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110"></i> 15.2% so với tuần trước
          </p>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/20 transition-transform duration-300 hover:scale-110">
              <i data-feather="activity" className="w-6 h-6 text-blue-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Bài Viết Active</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{activePosts}</h3>
            </div>
          </div>
          <p className="text-sm text-accent/70 mt-2 font-open-sans">
            <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110"></i> 4.1% so với tuần trước
          </p>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500/20 transition-transform duration-300 hover:scale-110">
              <i data-feather="trending-up" className="w-6 h-6 text-purple-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Tỷ Lệ Đọc</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{readRate}%</h3>
            </div>
          </div>
          <p className="text-sm text-accent/70 mt-2 font-open-sans">
            <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110"></i> 2.3% so với tuần trước
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 mb-8 md:mb-12 animate-slideUpFromBottom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-accent/70 font-open-sans mb-2">Trạng Thái</label>
            <select className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
              <option value="">Tất cả</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
              <option value="scheduled">Đã lên lịch</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-accent/70 font-open-sans mb-2">Ngày Tạo</label>
            <input type="date" className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" />
          </div>
          <div>
            <label className="block text-sm text-accent/70 font-open-sans mb-2">Tác Giả</label>
            <select className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
              <option value="">Tất cả</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="writer">Content Writer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-accent/70 font-open-sans mb-2">Lượt Xem</label>
            <select className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
              <option value="">Tất cả</option>
              <option value="1">1+</option>
              <option value="1000">1K+</option>
              <option value="5000">5K+</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-primary text-accent rounded-md font-open-sans hover:bg-primary/90 transition-all duration-200 hover:scale-105 mr-2">
            Áp Dụng Bộ Lọc
          </button>
          <button className="px-4 py-2 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200 hover:scale-105">
            Đặt Lại
          </button>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20 animate-slideUpFromBottom">
        <div className="px-4 py-4 md:px-6 border-b border-primary/20 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-accent font-orbitron">Danh Sách Bài Viết</h3>
          <div className="flex items-center space-x-2">
            <button className="text-primary text-sm flex items-center font-open-sans hover:text-primary/80 transition-all duration-200 hover:scale-110">
              <i data-feather="refresh-cw" className="w-4 h-4 mr-1"></i> Làm Mới
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
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Ảnh</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Tác Giả</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Ngày</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Lượt Xem</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Trạng Thái</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/20">
              {posts.map((post) => (
                <tr key={post.id} className="animate-in" data-post-id={post.id}>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{post.id}</td>
                  <td className="px-4 py-4 md:px-6"><img src={post.thumbnail} alt="Post thumbnail" className="w-10 h-10 object-cover rounded" /></td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{post.author}</td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{post.date.split('T')[0]}</td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{formatViews(post.views)}</td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                    <span className={`status-badge ${statusClass(post.status)}`}>{post.status === 'published' ? 'Đã xuất bản' : post.status === 'draft' ? 'Bản nháp' : 'Đã lên lịch'}</span>
                  </td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">
                    <div className="flex space-x-2">
                      <button onClick={() => handleViewPost(post)} className="view-post-btn text-primary hover:text-primary/80 transition-all duration-200 hover:scale-110">
                        <i data-feather="eye" className="w-4 h-4"></i>
                      </button>
                      <button onClick={() => handleEditPost(post)} className="edit-post-btn text-blue-500 hover:text-blue-400 transition-all duration-200 hover:scale-110">
                        <i data-feather="edit" className="w-4 h-4"></i>
                      </button>
                      <button className="text-red-500 hover:text-red-400 transition-all duration-200 hover:scale-110">
                        <i data-feather="trash" className="w-4 h-4"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-4 md:px-6 border-t border-primary/20 flex justify-end items-center">
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              <i data-feather="chevron-left" className="w-4 h-4"></i>
            </button>
            <button className="px-3 py-1 bg-primary text-accent rounded-md font-open-sans transition-all duration-200 hover:scale-105">1</button>
            <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200 hover:scale-105">2</button>
            <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200 hover:scale-105">3</button>
            <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200 hover:scale-105">
              <i data-feather="chevron-right" className="w-4 h-4"></i>
            </button>
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

      {/* Modals */}
      <AddBlog isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddSubmit} />
      {selectedPost && <ViewBlog isOpen={showViewModal} post={selectedPost} onClose={() => setShowViewModal(false)} />}
      {selectedPost && <EditBlog isOpen={showEditModal} post={selectedPost} onClose={() => setShowEditModal(false)} onSubmit={handleEditSubmit} />}
    </main>
  );
};

export default Blogs;