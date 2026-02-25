// add-player.tsx
import React, { useEffect, useState } from 'react';

interface AddPlayerFormData {
  team_id: string;
  name: string;
  ingame: string;
  image: string;
  role: string;
  position?: string;
}

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  onSubmit: (data: AddPlayerFormData) => void;
}

export const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ isOpen, onClose, teamId, onSubmit }) => {
  const [formData, setFormData] = useState<AddPlayerFormData>({
    team_id: teamId,
    name: '',
    ingame: '',
    image: '',
    role: '',
    position: '',
  });

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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary/90" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full relative modal-content show">
          <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-accent font-orbitron">Thêm Thành Viên Mới</h3>
            <button onClick={onClose} className="modal-close">
              <i data-feather="x"></i>
            </button>
          </div>
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="team_id" value={teamId} />
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Họ Tên (name) <span className="text-primary">*</span></label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập họ tên người chơi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Ingame (ingame) <span className="text-primary">*</span></label>
                <input type="text" name="ingame" required value={formData.ingame} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập tên ingame" />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Hình Ảnh URL (image) <span className="text-primary">*</span></label>
                <input type="url" name="image" required value={formData.image} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập URL hình ảnh" />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Vai Trò (role) <span className="text-primary">*</span></label>
                <input type="text" name="role" required value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập vai trò" />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Vị Trí Thi Đấu (position)</label>
                <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập vị trí thi đấu" />
              </div>
            </form>
          </div>
          <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-secondary/70 font-open-sans">
              Hủy
            </button>
            <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 font-open-sans">
              Thêm Thành Viên
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlayerModal;