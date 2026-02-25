// view-team.tsx
import React, { useEffect, useState } from 'react';
import AddPlayerModal from '../Add/add-player';

interface ViewTeamFormData {
  team_id: string;
  team_name: string;
  team_image: string;
  team_counts: number;
  team_established: string;
  team_game: string;
  team_tournament: string;
  team_country: string;
  team_description: string;
  team_status: string;
}

interface Team {
  id: string;
  name: string;
  image: string;
  membersCount: number;
}

interface Player {
  id: string;
  name: string;
  ingame: string;
  position?: string;
  image: string;
}

interface ViewTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
}

interface EditPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  onSubmit: (updatedPlayer: Player) => void;
}

const EditPlayerModal: React.FC<EditPlayerModalProps> = ({ isOpen, onClose, player, onSubmit }) => {
  const [formData, setFormData] = useState<Player>({
    id: '',
    name: '',
    ingame: '',
    position: '',
    image: '',
  });

  useEffect(() => {
    if (player) {
      setFormData(player);
    }
  }, [player]);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      setTimeout(() => {
        const feather = (window as any).feather;
        if (feather) {
          feather.replace();
        }
      }, 0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary/90" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full relative modal-content show">
          <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-accent font-orbitron">Chỉnh Sửa Thành Viên</h3>
            <button onClick={onClose} className="modal-close">
              <i data-feather="x"></i>
            </button>
          </div>
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Hình Ảnh URL <span className="text-primary">*</span></label>
                <input type="url" name="image" required value={formData.image} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập URL hình ảnh" />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Họ Tên <span className="text-primary">*</span></label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập họ tên" />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Ingame <span className="text-primary">*</span></label>
                <input type="text" name="ingame" required value={formData.ingame} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập tên ingame" />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Vị Trí Thi Đấu</label>
                <input type="text" name="position" value={formData.position || ''} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập vị trí thi đấu" />
              </div>
            </form>
          </div>
          <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-secondary/70 font-open-sans">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 font-open-sans">
              Cập Nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ImageViewerModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ isOpen, imageUrl, onClose }) => {
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      setTimeout(() => {
        const feather = (window as any).feather;
        if (feather) {
          feather.replace();
        }
      }, 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-secondary/90" onClick={onClose}>
      <div className="max-w-4xl max-h-full p-4">
        <img 
          src={imageUrl} 
          alt="Player Image" 
          className="max-w-full max-h-screen object-contain rounded-lg shadow-xl cursor-zoom-out transition-transform duration-200 hover:scale-105"
        />
      </div>
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-accent text-2xl modal-close z-70"
      >
        <i data-feather="x"></i>
      </button>
    </div>
  );
};

export const ViewTeamModal: React.FC<ViewTeamModalProps> = ({ isOpen, onClose, team }) => {
  const [formData, setFormData] = useState<ViewTeamFormData>({
    team_id: '',
    team_name: '',
    team_image: '',
    team_counts: 0,
    team_established: '',
    team_game: '',
    team_tournament: '',
    team_country: '',
    team_description: '',
    team_status: '',
  });
  const [members, setMembers] = useState<Player[]>([]);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showEditPlayerModal, setShowEditPlayerModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (team) {
      setFormData({
        team_id: team.id,
        team_name: team.name,
        team_image: team.image,
        team_counts: team.membersCount,
        team_established: '',
        team_game: '',
        team_tournament: '',
        team_country: '',
        team_description: '',
        team_status: 'Active',
      });
      // Fake data for members with images
      setMembers([
        { 
          id: '1', 
          name: 'Lee Sang-hyeok', 
          ingame: 'Faker', 
          position: 'Mid', 
          image: 'https://cdnmedia.webthethao.vn/uploads/2024-11-03/54112850518_5e73f71313_c.jpg'
        },
        { 
          id: '2', 
          name: 'Choi Woo-je', 
          ingame: 'Zeus', 
          position: 'Top', 
          image: 'https://esportsvn.org/wp-content/uploads/2025/04/zeus-lol-solo-kill-duong-tren-khien-ban-do-nghieng-nga.jpg'
        },
        { 
          id: '3', 
          name: 'Ryu Min-seok', 
          ingame: 'Keria', 
          position: 'Support', 
          image: 'https://cdn-media.sforum.vn/storage/app/media/phuonganh/cktg-2025-t1-flyquest.jpg'
        },
      ]);
    }
  }, [team]);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      setTimeout(() => {
        const feather = (window as any).feather;
        if (feather) {
          feather.replace();
        }
      }, 0);
    }
  }, [isOpen]);

  const handleAddPlayer = (playerData: any) => {
    const newPlayer: Player = {
      id: (members.length + 1).toString(),
      name: playerData.name,
      ingame: playerData.ingame,
      position: playerData.position || '',
      image: playerData.image || 'https://via.placeholder.com/40x40?text=New',
    };
    setMembers([...members, newPlayer]);
    console.log('Added player:', newPlayer);
    setShowAddPlayerModal(false);
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setShowEditPlayerModal(true);
  };

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setMembers(members.map(m => m.id === updatedPlayer.id ? updatedPlayer : m));
    console.log('Updated player:', updatedPlayer);
    setSelectedPlayer(null);
  };

  const handleDeletePlayer = (playerId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      setMembers(members.filter(m => m.id !== playerId));
      console.log('Deleted player:', playerId);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage('');
  };

  if (!isOpen || !team) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary/90" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative modal-content show">
          <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-accent font-orbitron">Chi Tiết Đội Tuyển</h3>
            <button onClick={onClose} className="modal-close">
              <i data-feather="x"></i>
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">ID</label>
                  <input type="text" id="view-team_id" readOnly value={formData.team_id} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tên Đội</label>
                  <input type="text" id="view-team_name" readOnly value={formData.team_name} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Hình Ảnh URL</label>
                  <input type="url" id="view-team_image" readOnly value={formData.team_image} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Số Thành Viên</label>
                  <input type="number" id="view-team_counts" readOnly value={formData.team_counts} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Ngày Thành Lập</label>
                  <input type="datetime-local" id="view-team_established" readOnly value={formData.team_established} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Bộ Môn Game</label>
                  <input type="text" id="view-team_game" readOnly value={formData.team_game} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Giải Đấu</label>
                  <input type="text" id="view-team_tournament" readOnly value={formData.team_tournament} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Quốc Gia</label>
                  <input type="text" id="view-team_country" readOnly value={formData.team_country} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Mô Tả</label>
                  <textarea id="view-team_description" rows={3} readOnly value={formData.team_description} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Trạng Thái</label>
                  <input type="text" id="view-team_status" readOnly value={formData.team_status} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans" />
                </div>
              </div>
              <div id="members-section">
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Danh Sách Thành Viên</label>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold text-accent">Danh Sách Thành Viên</h4>
                  <button onClick={() => setShowAddPlayerModal(true)} type="button" className="add-player-btn px-3 py-1 bg-primary text-accent rounded-md hover:bg-primary/80 transition text-sm font-open-sans" data-team-id={team.id}>
                    <i data-feather="plus" className="w-4 h-4 inline mr-1"></i>Thêm Thành Viên
                  </button>
                </div>
                <div id="view-team-members" className="space-y-1">
                  {members.length === 0 ? (
                    <p className="text-sm text-accent/70">Chưa có thành viên nào.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-primary/20">
                        <thead className="bg-secondary/30">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Ảnh</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Họ Tên</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Ingame</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Vị Trí Thi Đấu</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Hành Động</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/20">
                          {members.map((player) => (
                            <tr key={player.id} className="animate-in">
                              <td className="px-4 py-2 whitespace-nowrap">
                                <img 
                                  src={player.image} 
                                  alt={player.name} 
                                  className="w-10 h-10 rounded-full object-cover team-img cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => handleImageClick(player.image)}
                                />
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-accent font-open-sans">{player.name}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-accent font-open-sans">{player.ingame}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-accent font-open-sans">{player.position || '-'}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-accent font-open-sans">
                                <button
                                  onClick={() => handleEditPlayer(player)}
                                  className="edit-player-btn text-blue-500 mr-2 hover:text-blue-400"
                                >
                                  <i data-feather="edit-2" className="w-4 h-4"></i>
                                </button>
                                <button
                                  onClick={() => handleDeletePlayer(player.id)}
                                  className="text-red-500 hover:text-red-400"
                                >
                                  <i data-feather="trash-2" className="w-4 h-4"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-secondary/70 font-open-sans">
              Đóng
            </button>
          </div>
        </div>
      </div>
      <AddPlayerModal isOpen={showAddPlayerModal} onClose={() => setShowAddPlayerModal(false)} teamId={team.id} onSubmit={handleAddPlayer} />
      <EditPlayerModal
        isOpen={showEditPlayerModal}
        onClose={() => setShowEditPlayerModal(false)}
        player={selectedPlayer}
        onSubmit={handleUpdatePlayer}
      />
      <ImageViewerModal 
        isOpen={showImageModal} 
        imageUrl={selectedImage} 
        onClose={handleCloseImageModal} 
      />
    </div>
  );
};

export default ViewTeamModal;