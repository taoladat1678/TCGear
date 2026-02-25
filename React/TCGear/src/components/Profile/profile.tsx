// profile.tsx
import React, { useState, useEffect } from 'react';
import './profile.css';

interface Address {
  id: number;
  type: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'addresses'>('overview');
  const [showModal, setShowModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // User basic info
  const [user, setUser] = useState({
    name: "John Doe",
    avatar: "https://static.photos/technology/200x200/42",
    level: 42,
    points: 8245,
    joinDate: "15/01/2020"
  });

  // Settings Form
  const [settingsForm, setSettingsForm] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567"
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      type: "Địa chỉ nhà",
      name: "John Doe",
      street: "123 Đường Chơi Game",
      city: "Thành phố Esports",
      zip: "EC 12345",
      country: "Hoa Kỳ",
      phone: "+1 (555) 123-4567",
      isDefault: true
    },
    {
      id: 2,
      type: "Địa chỉ cơ quan",
      name: "John Doe",
      street: "456 Đại lộ Game Thủ Chuyên Nghiệp",
      city: "Khu Chơi Game",
      zip: "GD 67890",
      country: "Hoa Kỳ",
      phone: "+1 (555) 987-6543",
      isDefault: false
    }
  ]);

  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  useEffect(() => {
    const initFeather = () => {
      if (typeof window !== 'undefined' && (window as any).feather) {
        (window as any).feather.replace();
      }
    };

    initFeather();
    const timeout = setTimeout(initFeather, 100);
    return () => clearTimeout(timeout);
  }, [activeTab, showModal]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (avatarPreview) {
      setUser(prev => ({ ...prev, avatar: avatarPreview }));
      alert("✅ Đã cập nhật ảnh đại diện!");
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAvatarPreview(null);
  };

  const handleSettingsSave = () => {
    alert("✅ Đã lưu thông tin cá nhân!");
    console.log("Saved settings:", settingsForm);
  };

  const handlePasswordSave = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("❌ Mật khẩu xác nhận không khớp!");
      return;
    }
    alert("✅ Đã đổi mật khẩu thành công!");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleAddAddress = () => {
    if (!newAddress.type || !newAddress.street) {
      alert("Vui lòng điền ít nhất loại địa chỉ và địa chỉ chi tiết!");
      return;
    }

    const addressToAdd: Address = {
      id: Date.now(),
      type: newAddress.type || "Địa chỉ mới",
      name: newAddress.name || user.name,
      street: newAddress.street || "",
      city: newAddress.city || "",
      zip: newAddress.zip || "",
      country: newAddress.country || "Hoa Kỳ",
      phone: newAddress.phone || "",
      isDefault: false
    };

    setAddresses([...addresses, addressToAdd]);
    setNewAddress({});
    setIsAddingAddress(false);
    alert("✅ Đã thêm địa chỉ mới!");
  };

  const handleDeleteAddress = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const tabs = [
    { id: 'overview' as const, label: 'Tổng quan', icon: 'eye' },
    { id: 'settings' as const, label: 'Cài đặt', icon: 'settings' },
    { id: 'addresses' as const, label: 'Địa chỉ', icon: 'map-pin' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Header - đã fix gradient + padding */}
      <div className="relative bg-gradient-to-b from-rose-950/40 via-black to-black pb-20 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-rose-600 shadow-xl">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                aria-label="Đổi ảnh đại diện"
                className="absolute bottom-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-lg transition"
              >
                <i data-feather="camera" className="w-5 h-5"></i>
              </button>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold font-orbitron">{user.name}</h1>
              <p className="text-gray-400 mt-2 text-lg">
                Game thủ chuyên nghiệp • Rank Diamond • Từ 2020
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <i data-feather="zap" className="w-6 h-6 text-yellow-400"></i>
                  <span className="font-medium">Level {user.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i data-feather="trophy" className="w-6 h-6 text-yellow-400"></i>
                  <span className="font-medium">{user.points.toLocaleString()} Points</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <i key={i} data-feather="star" className="w-5 h-5 text-yellow-400 fill-current"></i>
                  ))}
                  <span className="text-sm text-gray-400 ml-1">(24)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - đã fix margin âm + z-index */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 space-y-2 sticky top-20 z-20">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition font-medium ${
                    activeTab === tab.id
                      ? 'bg-rose-600 text-white shadow-lg'
                      : 'hover:bg-gray-800/70 text-gray-400'
                  }`}
                  aria-selected={activeTab === tab.id}
                  role="tab"
                >
                  <i data-feather={tab.icon} className="w-5 h-5"></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3 space-y-10" role="tabpanel">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-rose-900/30 flex flex-col h-full">
                  <h2 className="text-2xl font-bold mb-6 font-orbitron text-rose-500">Thống kê tài khoản</h2>
                  <div className="space-y-6 flex-1 text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Thành viên từ</span>
                      <span className="font-medium">{user.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tổng đơn hàng</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tổng chi tiêu</span>
                      <span className="text-rose-500 font-bold">1.248,75 USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Danh mục yêu thích</span>
                      <span className="font-medium">Áo đấu & Gaming Gear</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-rose-900/30 flex flex-col h-full">
                  <h2 className="text-2xl font-bold mb-6 font-orbitron text-rose-500">Hoạt động gần đây</h2>
                  <div className="space-y-6 flex-1">
                    <div className="flex gap-4 bg-gray-800/50 rounded-xl p-4">
                      <div className="bg-rose-950/40 p-3 rounded-xl shrink-0">
                        <i data-feather="shopping-bag" className="w-6 h-6 text-rose-500"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Đơn hàng #TCG-4872 đã giao</p>
                        <p className="text-sm text-gray-500 mt-1">2 ngày trước</p>
                      </div>
                    </div>

                    <div className="flex gap-4 bg-gray-800/50 rounded-xl p-4">
                      <div className="bg-rose-950/40 p-3 rounded-xl shrink-0">
                        <i data-feather="star" className="w-6 h-6 text-rose-500"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Đánh giá sản phẩm</p>
                        <p className="text-sm text-gray-500 mt-1">5 ngày trước</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-rose-900/30">
                <h2 className="text-2xl font-bold mb-8 font-orbitron text-rose-500">Cài đặt tài khoản</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-rose-400">Thông tin cá nhân</h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Tên</label>
                        <input 
                          type="text" 
                          value={settingsForm.firstName}
                          onChange={(e) => setSettingsForm({...settingsForm, firstName: e.target.value})}
                          className="w-full bg-gray-800 border border-rose-900/40 rounded-lg px-5 py-3 focus:ring-2 focus:ring-rose-600 focus:border-rose-600 outline-none transition"
                        />
                      </div>
                      {/* các input còn lại tương tự, mình rút gọn cho ngắn */}
                      {/* ... */}
                    </div>
                    <button 
                      onClick={handleSettingsSave}
                      className="bg-rose-600 hover:bg-rose-700 px-8 py-3 rounded-full font-medium transition w-full md:w-auto shadow-lg"
                    >
                      Lưu thay đổi
                    </button>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-rose-400">Đổi mật khẩu</h3>
                    {/* ... input đổi mật khẩu ... */}
                    <button 
                      onClick={handlePasswordSave}
                      className="bg-rose-600 hover:bg-rose-700 px-8 py-3 rounded-full font-medium transition w-full md:w-auto shadow-lg"
                    >
                      Cập nhật mật khẩu
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses - đã fix nút thêm mới sticky */}
            {activeTab === 'addresses' && (
              <div className="space-y-8">
                <div className="sticky top-4 z-20 bg-black/90 backdrop-blur-md py-4 -mx-4 px-4 lg:-mx-0 lg:px-0 border-b border-rose-900/30">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-orbitron text-rose-500">Địa chỉ đã lưu</h2>
                    <button 
                      onClick={() => setIsAddingAddress(!isAddingAddress)}
                      className="bg-rose-600 hover:bg-rose-700 px-6 py-3 rounded-full font-medium flex items-center gap-2 transition shadow-lg"
                    >
                      <i data-feather="plus" className="w-5 h-5"></i> 
                      {isAddingAddress ? 'Hủy' : 'Thêm mới'}
                    </button>
                  </div>
                </div>

                {isAddingAddress && (
                  <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-rose-900/30">
                    <h3 className="font-bold mb-6 text-xl text-rose-400">Thêm địa chỉ mới</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* các input thêm địa chỉ - giữ nguyên logic */}
                      {/* ... */}
                    </div>
                    <button 
                      onClick={handleAddAddress}
                      className="mt-6 bg-rose-600 hover:bg-rose-700 px-8 py-3 rounded-full font-medium shadow-lg"
                    >
                      Thêm địa chỉ
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div key={address.id} className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-rose-900/30 relative">
                      {address.isDefault && (
                        <span className="absolute top-4 right-4 bg-rose-600 text-xs px-3 py-1 rounded-full font-medium">MẶC ĐỊNH</span>
                      )}
                      <h3 className="text-xl font-bold mb-4 text-rose-400">{address.type}</h3>
                      <p className="text-gray-300 space-y-1.5 leading-relaxed">
                        {address.name}<br />
                        {address.street}<br />
                        {address.city}, {address.zip}<br />
                        {address.country}<br />
                        <span className="block mt-4 font-medium">{address.phone}</span>
                      </p>
                      <div className="flex gap-8 mt-8">
                        <button 
                          onClick={() => handleSetDefault(address.id)}
                          className="text-rose-500 hover:text-rose-400 flex items-center gap-2 transition"
                        >
                          <i data-feather="star" className="w-4 h-4"></i> Đặt mặc định
                        </button>
                        <button 
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-500 hover:text-red-400 flex items-center gap-2 transition"
                        >
                          <i data-feather="trash-2" className="w-4 h-4"></i> Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Modal - giữ nguyên nhưng thêm backdrop blur */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-rose-900/30"
            onClick={e => e.stopPropagation()}
          >
            {/* nội dung modal giữ nguyên */}
            {/* ... */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;