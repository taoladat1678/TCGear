// add-team.tsx
import React, { useEffect, useState } from 'react';

interface AddTeamFormData {
  team_name: string;
  team_image: string;
  team_counts?: number;
  team_established: string;
  team_game: string;
  team_tournament: string;
  team_country: string;
  team_description?: string;
}

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<AddTeamFormData, 'team_counts' | 'team_description'> & { team_counts?: number; team_description?: string }) => void;
}

export const AddTeamModal: React.FC<AddTeamModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<AddTeamFormData>({
    team_name: '',
    team_image: '',
    team_counts: undefined,
    team_established: '',
    team_game: '',
    team_tournament: '',
    team_country: '',
    team_description: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const feather = (window as any).feather;
      if (feather) {
        feather.replace();
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'team_counts' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary/90" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative modal-content show">
          <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-accent font-orbitron">Thêm Đội Tuyển Mới</h3>
            <button onClick={onClose} className="modal-close">
              <i data-feather="x"></i>
            </button>
          </div>
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tên Đội (team_name) <span className="text-primary">*</span></label>
                  <input type="text" name="team_name" required value={formData.team_name} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập tên đội" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Hình Ảnh (team_image URL) <span className="text-primary">*</span></label>
                  <input type="url" name="team_image" required value={formData.team_image} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập URL hình ảnh" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Số Thành Viên (team_counts)</label>
                  <input type="number" name="team_counts" min="0" value={formData.team_counts || ''} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập số thành viên" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Ngày Thành Lập (team_established) <span className="text-primary">*</span></label>
                  <input type="datetime-local" name="team_established" required value={formData.team_established} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Bộ Môn Game (team_game) <span className="text-primary">*</span></label>
                  <input type="text" name="team_game" required value={formData.team_game} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập bộ môn game" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Giải Đấu (team_tournament) <span className="text-primary">*</span></label>
                  <input type="text" name="team_tournament" required value={formData.team_tournament} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập giải đấu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Quốc Gia (team_country) <span className="text-primary">*</span></label>
                  <input type="text" name="team_country" required value={formData.team_country} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập quốc gia" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Mô Tả</label>
                  <textarea name="team_description" rows={3} value={formData.team_description} onChange={handleChange} className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" placeholder="Nhập mô tả đội tuyển"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-secondary/70 font-open-sans">
              Hủy
            </button>
            <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 font-open-sans">
              Thêm Đội Tuyển
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeamModal;