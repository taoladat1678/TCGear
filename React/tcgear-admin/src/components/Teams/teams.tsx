// teams.tsx
import React, { useEffect, useState } from 'react';
import  AddTeamModal  from '../Modal/Add/add-team';
import  ViewTeamModal  from '../Modal/View/view-team';
import  EditTeamModal  from '../Modal/Edit/edit-team';
import './teams.css';

interface Team {
  id: string;
  name: string;
  image: string;
  membersCount: number;
}

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    { id: '#001', name: 'T1 Esports', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/T1_esports_logo.svg/1280px-T1_esports_logo.svg.png', membersCount: 5 },
    { id: '#002', name: 'DRX', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/DRX_logo_2023.png/963px-DRX_logo_2023.png', membersCount: 6 },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    // Initialize Feather Icons
    if (typeof window !== 'undefined') {
      const feather = (window as any).feather;
      if (feather) {
        feather.replace();
      }
    }
  }, []);

  const handleAddTeam = (newTeam: Omit<Team, 'id'>) => {
    const id = `#${(teams.length + 1).toString().padStart(3, '0')}`;
    setTeams([...teams, { ...newTeam, id }]);
    setShowAddModal(false);
  };

  const handleEditTeam = (updatedTeam: Team) => {
    setTeams(teams.map(team => team.id === updatedTeam.id ? updatedTeam : team));
    setShowEditModal(false);
  };

  const handleViewTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowViewModal(true);
  };

  const handleDeleteTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 max-w-7xl md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 animate-slideUpFromBottom">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-accent font-orbitron">Quản Lý Đội Tuyển</h1>
          <p className="text-accent/70 font-open-sans mt-1">Quản lý thông tin và hoạt động của tất cả đội tuyển esports</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-primary text-accent rounded-md font-open-sans hover:bg-primary/90 transition flex items-center">
            <i data-feather="plus" className="w-4 h-4 mr-2"></i> Thêm Đội Tuyển
          </button>
          <button className="px-4 py-2 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition flex items-center">
            <i data-feather="download" className="w-4 h-4 mr-2"></i> Xuất CSV
          </button>
        </div>
      </div>

      {/* Teams Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:gap-8 md:mb-12 animate-slideUpFromBottom">
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="grid" className="w-6 h-6 text-primary"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Tổng Đội Tuyển</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">{teams.length}</h3>
            </div>
          </div>
          <p className="text-sm text-accent/70 mt-2 font-open-sans"><i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110"></i> 2.3% so với tuần trước</p>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/20 transition-transform duration-300 hover:scale-110">
              <i data-feather="plus-square" className="w-6 h-6 text-green-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Đội Tuyển Mới</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">3</h3>
            </div>
          </div>
          <p className="text-sm text-accent/70 mt-2 font-open-sans"><i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110"></i> 25% so với tuần trước</p>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/20 transition-transform duration-300 hover:scale-110">
              <i data-feather="activity" className="w-6 h-6 text-blue-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Đội Tuyển Active</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">10</h3>
            </div>
          </div>
          <p className="text-sm text-accent/70 mt-2 font-open-sans"><i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110"></i> 8.1% so với tuần trước</p>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500/20 transition-transform duration-300 hover:scale-110">
              <i data-feather="award" className="w-6 h-6 text-purple-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Tỷ Lệ Thắng</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">72%</h3>
            </div>
          </div>
          <p className="text-sm text-accent/70 mt-2 font-open-sans"><i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110"></i> 3.5% so với tuần trước</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 mb-8 md:mb-12 animate-slideUpFromBottom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-accent/70 font-open-sans mb-2">Trạng Thái</label>
            <select className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
              <option value="">Tất cả</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="new">Mới</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-accent/70 font-open-sans mb-2">Ngày Thành Lập</label>
            <input type="date" className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" />
          </div>
          <div>
            <label className="block text-sm text-accent/70 font-open-sans mb-2">Bộ Môn Game</label>
            <select className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
              <option value="">Tất cả</option>
              <option value="lol">League of Legends</option>
              <option value="valorant">Valorant</option>
              <option value="csgo">CS:GO</option>
              <option value="overwatch">Overwatch</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-accent/70 font-open-sans mb-2">Quốc Gia</label>
            <select className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
              <option value="">Tất cả</option>
              <option value="kr">Hàn Quốc</option>
              <option value="us">Mỹ</option>
              <option value="cn">Trung Quốc</option>
              <option value="eu">Châu Âu</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-primary text-accent rounded-md font-open-sans hover:bg-primary/90 transition mr-2">
            Áp Dụng Bộ Lọc
          </button>
          <button className="px-4 py-2 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition">
            Đặt Lại
          </button>
        </div>
      </div>

      {/* Teams Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 md:gap-8 md:mb-12 animate-slideUpFromBottom">
        <div className="lg:col-span-2 bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20">
          <div className="px-4 py-4 md:px-6 border-b border-primary/20 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-accent font-orbitron">Danh Sách Đội Tuyển</h3>
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
                  <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Tên Đội</th>
                  <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Thành Viên</th>
                  <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/20">
                {teams.map((team, index) => (
                  <tr key={team.id} className={`animate-in ${index % 2 === 0 ? '' : ''}`}>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{team.id}</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                      <img className="team-img object-cover rounded-full" src={team.image} alt={`Logo ${team.name}`} />
                    </td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{team.name}</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{team.membersCount}</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">
                      <button onClick={() => handleViewTeam(team)} className="view-team-btn text-primary hover:text-primary/80 mr-2">
                        <i data-feather="eye" className="w-4 h-4"></i>
                      </button>
                      <button onClick={() => { setSelectedTeam(team); setShowEditModal(true); }} className="edit-team-btn text-blue-500 mr-2 hover:text-blue-400">
                        <i data-feather="edit-2" className="w-4 h-4"></i>
                      </button>
                      <button onClick={() => handleDeleteTeam(team.id)} className="text-red-500 hover:text-red-400">
                        <i data-feather="trash-2" className="w-4 h-4"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-4 md:px-6 border-t border-primary/20 flex justify-between items-center">
            <div className="flex space-x-2 ml-auto">
              <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                <i data-feather="chevron-left" className="w-4 h-4"></i>
              </button>
              <button className="px-3 py-1 bg-primary text-accent rounded-md font-open-sans">1</button>
              <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10">2</button>
              <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10">
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

      <AddTeamModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddTeam} />
      <EditTeamModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} team={selectedTeam} onSubmit={handleEditTeam} />
      <ViewTeamModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} team={selectedTeam} />
    </main>
  );
};

export default Teams;