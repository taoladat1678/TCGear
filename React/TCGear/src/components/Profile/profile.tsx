import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './profile.css';
import { useTranslation } from 'react-i18next';

interface Address {
  id: string;
  address: string;
  recipient_name: string;
  phone_number: string;
  is_default?: boolean;
  created_at?: string;
}

interface Activity {
  type: string;
  ref_id: string;
  description: string;
  time: string;
}

const Profile: React.FC = () => {
  const { user: authUser, updateUser } = useAuth();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'addresses'>('overview');
  const [showModal, setShowModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [user, setUser] = useState({
    name: "",
    avatar: "",
    joinDate: ""
  });
  const [settingsForm, setSettingsForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eco, setEco] = useState({ eco_orders_total: 0, eco_total: 0 });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Lấy thông tin provider và ảnh gốc từ localStorage hoặc user state
  const getProviderInfo = () => {
    let provider = localStorage.getItem('auth_provider');
    let originalAvatar = localStorage.getItem('original_avatar_url');
    
    if (!provider || !originalAvatar) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        provider = provider || storedUser.auth_provider || storedUser.provider;
        originalAvatar = originalAvatar || storedUser.original_avatar_url || storedUser.original_avatar || storedUser.originalAvatarUrl;
      } catch (e) {}
    }
    return { provider, originalAvatar };
  };

  const { provider: authProvider, originalAvatar: originalAvatarUrl } = getProviderInfo();
  const currentAvatar = avatarPreview || authUser?.image || user.avatar;
  const isOriginal = currentAvatar === originalAvatarUrl;

  const handleRestoreOriginalAvatar = async () => {
    if (!originalAvatarUrl) return;

    // Cập nhật UI ngay lập tức
    setAvatarPreview(originalAvatarUrl);
    setSelectedFile(null);
    updateUser({ image: originalAvatarUrl });
    setUser(prev => ({ ...prev, avatar: originalAvatarUrl }));
    
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    u.image = originalAvatarUrl;
    localStorage.setItem('user', JSON.stringify(u));
    
    handleCloseModal();
    setSuccess(t(`✅ Đã khôi phục ảnh mặc định từ ${authProvider === 'google' ? 'Google' : 'Facebook'}!`));

    // Cố gắng cập nhật lên database qua API avatar hiện có bằng File API
    try {
      const resImg = await fetch(originalAvatarUrl);
      const blob = await resImg.blob();
      const file = new File([blob], `avatar-${authProvider}.jpg`, { type: blob.type });
      
      const formData = new FormData();
      formData.append('avatar', file);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/user/avatar', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchProfile(); // reload đồng bộ
      }
    } catch (e) {
      console.log('Không thể cập nhật API tự động do CORS hoặc lỗi mạng:', e);
    }
  };

  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [recipientName, setRecipientName] = useState('');
  const [streetName, setStreetName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [wardsLoading, setWardsLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const normalizeName = (str: string): string => {
    if (!str) return '';
    return str
      .trim()
      .replace(/^(Thành phố|TP\.?|Tỉnh|Quận|Q\.?|Huyện|H\.?|Phường|P\.?|Xã|X\.?|Thị xã|District|Ward|City|Thủ Đức)\s*/i, '')
      .trim()
      .toLowerCase();
  };

  const clearMessages = () => {
    setSuccess('');
    setError('');
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(clearMessages, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  useEffect(() => {
    clearMessages();
  }, [activeTab]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await res.json();
        setProvinces(data);
      } catch (err) {
        setError(t("❌ Không tải được danh sách tỉnh/thành phố!"));
      }
    };
    fetchProvinces();
  }, [t]);

  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setWards([]);
      return;
    }
    const fetchDistricts = async () => {
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
        const data = await res.json();
        setDistricts(data.districts || []);
        setWards([]);
      } catch (err) {
        setError(t("❌ Không tải được quận/huyện!"));
      }
    };
    fetchDistricts();
  }, [selectedProvince, t]);

  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard('');
      return;
    }
    const fetchWards = async () => {
      setWardsLoading(true);
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
        const data = await res.json();
        setWards(data.wards || []);
      } catch (err) {
        setError(t("❌ Không tải được danh sách xã/phường!"));
        setWards([]);
      } finally {
        setWardsLoading(false);
      }
    };
    fetchWards();
  }, [selectedDistrict, t]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.status === 'success') {
        const u = data.user;
        const fullName = (u.user_fullname || '').trim();
        let ho = '';
        let ten = fullName;
        if (fullName) {
          const parts = fullName.split(/\s+/);
          if (parts.length >= 2) {
            ten = parts[parts.length - 1];
            ho = parts.slice(0, -1).join(' ');
          } else {
            ten = fullName;
            ho = '';
          }
        }
        const newAvatar = u.user_image || 'img/fanT1.jpg';

        setUser({
          name: fullName || t('Người dùng'),
          avatar: newAvatar,
          joinDate: new Date(u.created_at).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        });
        setEco(data.eco || { eco_orders_total: 0, eco_total: 0 });
        setActivities(data.activities || []);
        setSettingsForm({
          firstName: ten,
          lastName: ho,
          email: u.user_email || '',
          phone: u.user_phone_number || ''
        });
        setAddresses(data.addresses || []);

        updateUser({
          image: newAvatar === 'img/fanT1.jpg' ? null : newAvatar,
          fullname: fullName,
          email: u.user_email || '',
          phone: u.user_phone_number || '',
          address: data.addresses && data.addresses.length > 0 ? 'has_address' : ''
        });
      }
    } catch (err) {
      setError(t("❌ Lỗi khi tải thông tin hồ sơ!"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initFeather = () => {
      if (window.feather) window.feather.replace();
    };
    initFeather();
    const timer = setTimeout(initFeather, 300);
    return () => clearTimeout(timer);
  }, [activeTab, showModal, addresses, activities]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) handleCloseModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('avatar', selectedFile);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/user/avatar', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccess(t("✅ Đã cập nhật ảnh đại diện thành công!"));
        fetchProfile();
      } else {
        setError(t("❌ Lỗi khi cập nhật ảnh đại diện!"));
      }
    } catch (err) {
      setError(t("❌ Lỗi kết nối server khi cập nhật ảnh!"));
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAvatarPreview(null);
    setSelectedFile(null);
  };

  const handleSettingsSave = async () => {
    const fullNameToSave = [settingsForm.lastName.trim(), settingsForm.firstName.trim()]
      .filter(Boolean)
      .join(' ')
      .trim();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullname: fullNameToSave,
          email: settingsForm.email,
          phone: settingsForm.phone
        })
      });
      if (res.ok) {
        setSuccess(t("✅ Đã lưu thông tin cá nhân thành công!"));
        fetchProfile();
      } else {
        setError(t("❌ Lỗi khi lưu thông tin cá nhân!"));
      }
    } catch (err) {
      setError(t("❌ Lỗi kết nối server khi lưu thông tin!"));
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError(t("❌ Trình duyệt không hỗ trợ lấy vị trí!"));
      return;
    }
    setGettingLocation(true);
    setError('');
    setSuccess('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`
          );
          if (!geoRes.ok) throw new Error('BigDataCloud error');
          const geo = await geoRes.json();

          let provinceName = geo.principalSubdivision || '';
          let districtName = geo.city || '';
          let wardName = geo.locality || '';

          if (!districtName || districtName === provinceName) {
            const all = [...(geo.localityInfo?.administrative || []), ...(geo.localityInfo?.informative || [])];
            districtName = all.find(item => 
              item.name && (item.name.includes('Quận') || item.name.includes('Huyện') || item.name.includes('Thị xã') || item.name.includes('Thành phố Thủ Đức'))
            )?.name || districtName;
          }

          if (!wardName) {
            const info = geo.localityInfo?.informative || [];
            wardName = info.find(item => item.name && (item.name.includes('Phường') || item.name.includes('Xã')))?.name || '';
          }

          const matchedProvince = provinces.find((p: any) =>
            normalizeName(p.name) === normalizeName(provinceName) || p.name.includes(provinceName)
          );
          if (!matchedProvince) throw new Error('Province not found');

          const provinceCode = String(matchedProvince.code);
          setSelectedProvince(provinceCode);

          const districtsRes = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
          const districtsData = await districtsRes.json();
          const districtsList = districtsData.districts || [];
          setDistricts(districtsList);

          const matchedDistrict = districtsList.find((d: any) =>
            normalizeName(d.name) === normalizeName(districtName) || d.name.includes(districtName)
          );

          if (matchedDistrict) {
            const districtCode = String(matchedDistrict.code);
            setSelectedDistrict(districtCode);

            const wardsRes = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            const wardsData = await wardsRes.json();
            const wardsList = wardsData.wards || [];
            setWards(wardsList);

            const matchedWard = wardsList.find((w: any) =>
              normalizeName(w.name) === normalizeName(wardName) || w.name.includes(wardName)
            );
            if (matchedWard) setSelectedWard(String(matchedWard.code));
          }

          const street = [geo.houseNumber, geo.road].filter(Boolean).join(' ');
          setStreetName(street || '');
          setRecipientName(user.name || '');

          setSuccess(t("✅ ĐÃ ĐIỀN FULL 3 CẤP (Tỉnh + Quận/Huyện + Xã/Phường)"));
        } catch (err) {
          console.error(err);
          setError(t("⚠️ Lấy vị trí được nhưng match không hết. Chọn bổ sung thủ công nhé."));
        } finally {
          setGettingLocation(false);
        }
      },
      () => {
        setError(t("❌ Không lấy được vị trí. Vui lòng cho phép quyền vị trí trong trình duyệt!"));
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleAddAddress = async () => {
    if (!recipientName.trim()) {
      setError(t("❌ Vui lòng nhập tên người nhận!"));
      return;
    }
    if (!streetName.trim() || !selectedProvince || !selectedDistrict || !selectedWard) {
      setError(t("❌ Vui lòng điền đầy đủ địa chỉ!"));
      return;
    }

    const provinceName = provinces.find(p => String(p.code) === selectedProvince)?.name || '';
    const districtName = districts.find(d => String(d.code) === selectedDistrict)?.name || '';
    const wardName = wards.find(w => String(w.code) === selectedWard)?.name || '';

    const fullAddress = [
      streetName.trim(),
      wardName,
      districtName,
      provinceName,
      'Việt Nam'
    ].filter(Boolean).join(', ');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          address: fullAddress,
          recipient_name: recipientName.trim(),
          phone_number: phoneNumber.trim() || undefined
        })
      });

      const result = await res.json();
      if (result.status === 'success') {
        fetchProfile();
        setRecipientName('');
        setPhoneNumber('');
        setStreetName('');
        setSelectedProvince('');
        setSelectedDistrict('');
        setSelectedWard('');
        setDistricts([]);
        setWards([]);
        setIsAddingAddress(false);
        setSuccess(t("✅ Thêm địa chỉ mới thành công!"));
      } else {
        setError(`❌ ${result.message || t('Lỗi không rõ')}`);
      }
    } catch (err) {
      setError(t("❌ Lỗi kết nối server!"));
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!confirm(t("Đặt địa chỉ này làm mặc định?"))) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/user/addresses/${id}/default`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProfile();
        setSuccess(t("✅ Đã đặt làm địa chỉ mặc định thành công!"));
      } else {
        setError(t("❌ Lỗi khi đặt địa chỉ mặc định!"));
      }
    } catch (err) {
      setError(t("❌ Lỗi kết nối server khi đặt mặc định!"));
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm(t("Xác nhận xóa địa chỉ này?"))) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/user/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProfile();
        setSuccess(t("✅ Đã xóa địa chỉ thành công!"));
      } else {
        setError(t("❌ Lỗi khi xóa địa chỉ!"));
      }
    } catch (err) {
      setError(t("❌ Lỗi kết nối server khi xóa địa chỉ!"));
    }
  };

  const missingFieldsList: string[] = [];
  if (!settingsForm.lastName.trim()) missingFieldsList.push('họ');
  if (!settingsForm.firstName.trim()) missingFieldsList.push('tên');
  if (!settingsForm.email.trim()) missingFieldsList.push('email');
  if (!settingsForm.phone.trim()) missingFieldsList.push('sdt');

  const missingCount = missingFieldsList.length;
  const missingText = missingCount > 0 ? `chưa có dữ liệu (${missingFieldsList.join(', ')}), hãy cập nhật dữ liệu` : '';

  const addressMissing = addresses.length === 0;

  const tabs = [
    { id: 'overview' as const, label: t('Tổng quan'), icon: 'eye' },
    { id: 'settings' as const, label: t('Cài đặt'), icon: 'settings', badge: missingCount },
    { id: 'addresses' as const, label: t('Địa chỉ'), icon: 'map-pin', badge: addressMissing ? 1 : 0 },
  ];

  if (loading) {
    return <div className="text-center py-20 text-2xl">{t("Đang tải hồ sơ...")}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative bg-gradient-to-b from-rose-950/40 via-black to-black pb-20 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-rose-600 shadow-xl">
                <img 
                  src={authUser?.image || user.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              {isLoggedIn && (
                <button
                  onClick={() => setShowModal(true)}
                  className="absolute bottom-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-lg transition"
                >
                  <i data-feather="camera" className="w-5 h-5"></i>
                </button>
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-4xl sm:text-5xl max-[499px]:text-3xl max-[374px]:text-2xl font-bold font-orbitron">
                {authUser?.fullname || user.name || t('Người dùng')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-[499px]:gap-6 max-[374px]:gap-4">
          <div className="lg:col-span-1">
            <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 space-y-2 sticky top-20 z-20">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition font-medium ${
                    activeTab === tab.id ? 'bg-rose-600 text-white shadow-lg' : 'hover:bg-gray-800/70 text-gray-400'
                  }`}
                >
                  <i data-feather={tab.icon} className="w-5 h-5"></i>
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center justify-center">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-10">
            {success && (
              <div className="mb-6 p-4 bg-green-600/20 border border-green-600 rounded-md text-green-400 text-center">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-md text-red-400 text-center">
                {error}
              </div>
            )}

            {!isLoggedIn ? (
              <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-16 border border-rose-900/30 text-center min-h-[500px] flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-rose-600/10 rounded-full flex items-center justify-center mb-8">
                  <i data-feather="user-x" className="w-14 h-14 text-rose-500"></i>
                </div>
                <h2 className="text-4xl max-[499px]:text-3xl max-[374px]:text-2xl font-bold font-orbitron mb-6">{t("BẠN CHƯA ĐĂNG NHẬP")}</h2>
                <p className="text-2xl max-[499px]:text-xl max-[374px]:text-lg text-gray-300 mb-10 max-w-lg">
                  {t("BẠN CHƯA ĐĂNG NHẬP")}.<br />{t("HÃY ĐĂNG NHẬP ĐỂ CHỈNH SỬA THÔNG TIN")}.
                </p>
                <a
                  href="/login"
                  className="inline-flex items-center gap-3 bg-rose-600 hover:bg-rose-700 px-12 py-5 max-[499px]:px-8 max-[499px]:py-4 max-[499px]:text-lg rounded-full font-bold text-xl transition-all shadow-xl"
                >
                  <i data-feather="log-in" className="w-6 h-6"></i>
                  {t("ĐĂNG NHẬP NGAY")}
                </a>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-[499px]:gap-6 max-[374px]:gap-4">
                    <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-rose-900/30 flex flex-col h-full">
                      <h2 className="text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-6 font-orbitron text-rose-500">{t("Thống kê tài khoản")}</h2>
                      <div className="space-y-6 flex-1 text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t("Thành viên từ")}</span>
                          <span className="font-medium">{user.joinDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t("Tổng đơn hàng")}</span>
                          <span className="font-medium">{eco.eco_orders_total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t("Tổng chi tiêu")}</span>
                          <span className="text-rose-500 font-bold">{eco.eco_total.toLocaleString('vi-VN')} ₫</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-rose-900/30 flex flex-col h-full">
                      <h2 className="text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-6 font-orbitron text-rose-500">{t("Hoạt động gần đây")}</h2>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {activities.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-40 text-gray-500 italic border border-dashed border-gray-700 rounded-xl">
                            <i data-feather="inbox" className="h-8 w-8 mb-2 opacity-50"></i>
                            {t("Chưa có hoạt động nào")}
                          </div>
                        ) : (
                          activities.map((activity, idx) => {
                            let iconName = 'activity';
                            if (activity.type === 'ORDER') iconName = 'shopping-bag';
                            else if (activity.type === 'COMMENT') iconName = 'message-square';
                            else if (activity.type === 'ADDRESS') iconName = 'map-pin';
                            else if (activity.type === 'UPDATE_PROFILE') iconName = 'user';
                            else if (activity.type === 'UPDATE_AVATAR') iconName = 'image';

                            const formattedTime = new Date(activity.time).toLocaleString('vi-VN', {
                              day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            });

                            return (
                              <div 
                                key={idx} 
                                className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors border border-gray-700/50 cursor-pointer"
                                onClick={() => setSelectedActivity(activity)}
                              >
                                <div className="p-3 bg-rose-500/10 text-rose-500 rounded-lg shrink-0">
                                  <i data-feather={iconName} className="h-5 w-5"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-200 font-medium font-open-sans break-words whitespace-normal line-clamp-2" title={activity.description}>{activity.description}</p>
                                  <p className="text-xs text-gray-500 mt-1 font-open-sans">{formattedTime}</p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-rose-900/30">
                    <h2 className="text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-8 font-orbitron text-rose-500">{t("Cài đặt tài khoản")}</h2>
                    <div className="max-w-2xl">
                      <h3 className="text-xl max-[499px]:text-lg font-bold text-rose-400 mb-6">{t("Thông tin cá nhân")}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1.5">{t("Họ")}</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={settingsForm.lastName}
                              onChange={e => setSettingsForm({...settingsForm, lastName: e.target.value})}
                              className={`w-full bg-gray-800 border rounded-lg px-5 py-3 outline-none transition ${
                                !settingsForm.lastName.trim() 
                                  ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                                  : 'border-rose-900/40 focus:ring-2 focus:ring-rose-600 focus:border-rose-600'
                              }`}
                            />
                            {!settingsForm.lastName.trim() && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 cursor-help group">
                                <i data-feather="alert-circle" className="w-5 h-5"></i>
                                <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-max bg-black text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-red-500/50 z-10 font-bold">
                                  HIỆN CHƯA CÓ HỌ, HÃY CẬP NHẬT
                                  <div className="absolute -top-1.5 right-1.5 w-3 h-3 bg-black border-t border-l border-red-500/50 rotate-45"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1.5">{t("Tên")}</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={settingsForm.firstName}
                              onChange={e => setSettingsForm({...settingsForm, firstName: e.target.value})}
                              className={`w-full bg-gray-800 border rounded-lg px-5 py-3 outline-none transition ${
                                !settingsForm.firstName.trim() 
                                  ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                                  : 'border-rose-900/40 focus:ring-2 focus:ring-rose-600 focus:border-rose-600'
                              }`}
                            />
                            {!settingsForm.firstName.trim() && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 cursor-help group">
                                <i data-feather="alert-circle" className="w-5 h-5"></i>
                                <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-max bg-black text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-red-500/50 z-10 font-bold">
                                  HIỆN CHƯA CÓ TÊN, HÃY CẬP NHẬT
                                  <div className="absolute -top-1.5 right-1.5 w-3 h-3 bg-black border-t border-l border-red-500/50 rotate-45"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                          <div className="relative">
                            <input
                              type="email"
                              value={settingsForm.email}
                              onChange={e => setSettingsForm({...settingsForm, email: e.target.value})}
                              className={`w-full bg-gray-800 border rounded-lg px-5 py-3 outline-none transition ${
                                !settingsForm.email.trim() 
                                  ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                                  : 'border-rose-900/40 focus:ring-2 focus:ring-rose-600 focus:border-rose-600'
                              }`}
                            />
                            {!settingsForm.email.trim() && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 cursor-help group">
                                <i data-feather="alert-circle" className="w-5 h-5"></i>
                                <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-max bg-black text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-red-500/50 z-10 font-bold">
                                  HIỆN CHƯA CÓ EMAIL, HÃY CẬP NHẬT
                                  <div className="absolute -top-1.5 right-1.5 w-3 h-3 bg-black border-t border-l border-red-500/50 rotate-45"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1.5">{t("Số điện thoại")}</label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={settingsForm.phone}
                              onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})}
                              className={`w-full bg-gray-800 border rounded-lg px-5 py-3 outline-none transition ${
                                !settingsForm.phone.trim() 
                                  ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                                  : 'border-rose-900/40 focus:ring-2 focus:ring-rose-600 focus:border-rose-600'
                              }`}
                            />
                            {!settingsForm.phone.trim() && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 cursor-help group">
                                <i data-feather="alert-circle" className="w-5 h-5"></i>
                                <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-max bg-black text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-red-500/50 z-10 font-bold">
                                  HIỆN CHƯA CÓ SĐT, HÃY CẬP NHẬT
                                  <div className="absolute -top-1.5 right-1.5 w-3 h-3 bg-black border-t border-l border-red-500/50 rotate-45"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleSettingsSave}
                        className="mt-8 bg-rose-600 hover:bg-rose-700 px-8 py-3 rounded-full font-medium transition w-full md:w-auto shadow-lg"
                      >
                        {t("Lưu thay đổi")}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="space-y-8">
                    <div className="sticky top-4 z-20 bg-black/90 backdrop-blur-md py-4 -mx-4 px-4 lg:-mx-0 lg:px-0 border-b border-rose-900/30">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold font-orbitron text-rose-500">{t("Địa chỉ đã lưu")}</h2>
                        <button
                          onClick={() => {
                            setIsAddingAddress(!isAddingAddress);
                            if (!isAddingAddress) {
                              setRecipientName('');
                              setStreetName('');
                              setPhoneNumber('');
                              setSelectedProvince('');
                              setSelectedDistrict('');
                              setSelectedWard('');
                              setDistricts([]);
                              setWards([]);
                            }
                          }}
                          className="bg-rose-600 hover:bg-rose-700 px-6 py-3 max-[499px]:px-4 max-[499px]:py-2 max-[499px]:text-sm rounded-full font-medium flex items-center gap-2 transition shadow-lg"
                        >
                          <i data-feather="plus" className="w-5 h-5"></i>
                          {isAddingAddress ? t('Hủy') : t('Thêm mới')}
                        </button>
                      </div>
                    </div>

                    {isAddingAddress && (
                      <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-rose-900/30">
                        <h3 className="font-bold mb-6 text-xl max-[499px]:text-lg text-rose-400">{t("Thêm địa chỉ mới")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1.5">{t("Tên người nhận")} <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <input
                                type="text"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                className={`w-full bg-gray-800 border rounded-lg px-5 py-3 outline-none transition ${
                                  !recipientName.trim() 
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                                    : 'border-rose-900/40 focus:ring-2 focus:ring-rose-600 focus:border-rose-600'
                                }`}
                                placeholder="Nguyễn Văn A"
                              />
                              {!recipientName.trim() && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 cursor-help group">
                                  <i data-feather="alert-circle" className="w-5 h-5"></i>
                                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-max bg-black text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-red-500/50 z-10 font-bold">
                                    HIỆN CHƯA CÓ TÊN NGƯỜI NHẬN, HÃY CẬP NHẬT
                                    <div className="absolute -top-1.5 right-1.5 w-3 h-3 bg-black border-t border-l border-red-500/50 rotate-45"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-gray-400 mb-1.5">{t("Số điện thoại")} <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className={`w-full bg-gray-800 border rounded-lg px-5 py-3 outline-none transition ${
                                  !phoneNumber.trim() 
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                                    : 'border-rose-900/40 focus:ring-2 focus:ring-rose-600 focus:border-rose-600'
                                }`}
                                placeholder="0987654321"
                              />
                              {!phoneNumber.trim() && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 cursor-help group">
                                  <i data-feather="alert-circle" className="w-5 h-5"></i>
                                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-max bg-black text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-red-500/50 z-10 font-bold">
                                    HIỆN CHƯA CÓ SĐT, HÃY CẬP NHẬT
                                    <div className="absolute -top-1.5 right-1.5 w-3 h-3 bg-black border-t border-l border-red-500/50 rotate-45"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1.5">{t("Tên đường / Số nhà")} <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <input
                                type="text"
                                value={streetName}
                                onChange={(e) => setStreetName(e.target.value)}
                                className={`w-full bg-gray-800 border rounded-lg px-5 py-3 outline-none transition ${
                                  !streetName.trim() 
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                                    : 'border-rose-900/40 focus:ring-2 focus:ring-rose-600 focus:border-rose-600'
                                }`}
                                placeholder="123 Đường ABC, Phường XYZ"
                              />
                              {!streetName.trim() && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 cursor-help group">
                                  <i data-feather="alert-circle" className="w-5 h-5"></i>
                                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-max bg-black text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-red-500/50 z-10 font-bold">
                                    HIỆN CHƯA CÓ TÊN ĐƯỜNG, HÃY CẬP NHẬT
                                    <div className="absolute -top-1.5 right-1.5 w-3 h-3 bg-black border-t border-l border-red-500/50 rotate-45"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-gray-400 mb-1.5">{t("Thành phố / Tỉnh")} <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <select
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                                className={`w-full bg-gray-800 border rounded-lg px-5 py-3 outline-none transition appearance-none ${
                                  !selectedProvince 
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                                    : 'border-rose-900/40 focus:ring-2 focus:ring-rose-600 focus:border-rose-600'
                                }`}
                              >
                                <option value="">{t("Chọn thành phố / tỉnh")}</option>
                                {provinces.map((p: any) => (
                                  <option key={p.code} value={String(p.code)}>{p.name}</option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <i data-feather="chevron-down" className="w-4 h-4"></i>
                              </div>
                              {!selectedProvince && (
                                <div className="absolute right-9 top-1/2 -translate-y-1/2 text-red-500 cursor-help group">
                                  <i data-feather="alert-circle" className="w-5 h-5"></i>
                                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-max bg-black text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-red-500/50 z-10 font-bold">
                                    HIỆN CHƯA CÓ TỈNH/THÀNH PHỐ, HÃY CẬP NHẬT
                                    <div className="absolute -top-1.5 right-1.5 w-3 h-3 bg-black border-t border-l border-red-500/50 rotate-45"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-gray-400 mb-1.5">{t("Quận / Huyện")} <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <select
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                disabled={!selectedProvince}
                                className={`w-full bg-gray-800 border rounded-lg px-5 py-3 outline-none transition disabled:opacity-50 appearance-none ${
                                  !selectedDistrict 
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                                    : 'border-rose-900/40 focus:ring-2 focus:ring-rose-600 focus:border-rose-600'
                                }`}
                              >
                                <option value="">{t("Chọn quận / huyện")}</option>
                                {districts.map((d: any) => (
                                  <option key={d.code} value={String(d.code)}>{d.name}</option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <i data-feather="chevron-down" className="w-4 h-4"></i>
                              </div>
                              {!selectedDistrict && (
                                <div className="absolute right-9 top-1/2 -translate-y-1/2 text-red-500 cursor-help group">
                                  <i data-feather="alert-circle" className="w-5 h-5"></i>
                                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-max bg-black text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-red-500/50 z-10 font-bold">
                                    HIỆN CHƯA CÓ QUẬN/HUYỆN, HÃY CẬP NHẬT
                                    <div className="absolute -top-1.5 right-1.5 w-3 h-3 bg-black border-t border-l border-red-500/50 rotate-45"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-gray-400 mb-1.5">{t("Xã / Phường")} <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <select
                                value={selectedWard}
                                onChange={(e) => setSelectedWard(e.target.value)}
                                disabled={!selectedDistrict || wardsLoading}
                                className={`w-full bg-gray-800 border rounded-lg px-5 py-3 outline-none transition disabled:opacity-50 appearance-none ${
                                  !selectedWard 
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                                    : 'border-rose-900/40 focus:ring-2 focus:ring-rose-600 focus:border-rose-600'
                                }`}
                              >
                                <option value="">{t("Chọn xã / phường")}</option>
                                {wardsLoading ? (
                                  <option disabled>{t("Đang tải xã/phường...")}</option>
                                ) : (
                                  wards.map((w: any) => (
                                    <option key={w.code} value={String(w.code)}>{w.name}</option>
                                  ))
                                )}
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <i data-feather="chevron-down" className="w-4 h-4"></i>
                              </div>
                              {!selectedWard && (
                                <div className="absolute right-9 top-1/2 -translate-y-1/2 text-red-500 cursor-help group">
                                  <i data-feather="alert-circle" className="w-5 h-5"></i>
                                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-max bg-black text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-red-500/50 z-10 font-bold">
                                    HIỆN CHƯA CÓ XÃ/PHƯỜNG, HÃY CẬP NHẬT
                                    <div className="absolute -top-1.5 right-1.5 w-3 h-3 bg-black border-t border-l border-red-500/50 rotate-45"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleUseCurrentLocation}
                          disabled={gettingLocation}
                          className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white py-3 rounded-full font-medium transition flex items-center justify-center gap-2"
                        >
                          <i data-feather="map-pin" className="w-5 h-5"></i>
                          {gettingLocation ? t('Đang lấy & tự động điền địa chỉ...') : t('Sử dụng vị trí hiện tại của tôi')}
                        </button>

                        <button
                          onClick={handleAddAddress}
                          className="mt-6 bg-rose-600 hover:bg-rose-700 px-8 py-3 rounded-full font-medium shadow-lg w-full"
                        >
                          {t("Xác nhận thêm địa chỉ")}
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.length === 0 ? (
                        <div className="col-span-2 flex items-center justify-center py-10">
                          <div className="relative group cursor-help border border-red-500 rounded-xl px-6 py-4 bg-red-500/10 flex items-center gap-3 transition hover:bg-red-500/20">
                            <span className="text-red-400 italic font-medium">{t("Bạn chưa có địa chỉ nào. Hãy thêm mới!")}</span>
                            <i data-feather="alert-circle" className="w-6 h-6 text-red-500"></i>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 hidden group-hover:block w-max bg-black text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-red-500/50 z-10 font-bold pointer-events-none">
                              HIỆN CHƯA CÓ ĐỊA CHỈ NÀO, HÃY CẬP NHẬT
                              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-t border-l border-red-500/50 rotate-45"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        addresses.map((address) => (
                          <div
                            key={address.id}
                            className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-rose-900/30 relative"
                          >
                            {address.is_default && (
                              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                                {t("MẶC ĐỊNH")}
                              </div>
                            )}

                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <div className="font-medium text-lg text-white">
                                  {address.recipient_name ? (
                                    address.recipient_name
                                  ) : (
                                    <button
                                      onClick={() => alert(t("Chức năng chỉnh sửa tên người nhận đang phát triển"))}
                                      className="text-rose-400 hover:text-rose-300 underline"
                                    >
                                      + {t("Thêm tên người nhận")}
                                    </button>
                                  )}
                                </div>

                                <div className="text-sm text-gray-300">
                                  {address.phone_number ? (
                                    <>📞 {address.phone_number}</>
                                  ) : (
                                    <button
                                      onClick={() => alert(t("Chức năng chỉnh sửa số điện thoại đang phát triển"))}
                                      className="text-rose-400 hover:text-rose-300 underline"
                                    >
                                      + {t("Thêm số điện thoại")}
                                    </button>
                                  )}
                                </div>
                              </div>

                              <p className="text-gray-300 leading-relaxed whitespace-pre-line break-words">
                                {address.address}
                              </p>

                              {address.created_at && (
                                <div className="text-xs text-gray-500 mt-2">
                                  {t("Thêm lúc:")} {new Date(address.created_at).toLocaleString('vi-VN')}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-6 mt-6">
                              {addresses.length >= 2 && !address.is_default && (
                                <button
                                  onClick={() => handleSetDefault(address.id)}
                                  className="text-emerald-500 hover:text-emerald-400 flex items-center gap-2 transition text-sm"
                                >
                                  <i data-feather="star" className="w-4 h-4" />
                                  {t("Đặt làm mặc định")}
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-red-500 hover:text-red-400 flex items-center gap-2 transition text-sm"
                              >
                                <i data-feather="trash-2" className="w-4 h-4" />
                                {t("Xóa")}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showModal && isLoggedIn && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-rose-900/30"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">{t("Đổi ảnh đại diện")}</h3>
            <div className="flex flex-col items-center gap-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-rose-600">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <img src={authUser?.image || user.avatar} alt="Current" className="w-full h-full object-cover" />
                )}
              </div>
              <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-full text-sm font-medium transition">
                {t("Chọn ảnh mới")}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              
              {(authProvider === 'google' || authProvider === 'facebook') && originalAvatarUrl && !isOriginal && (
                <button
                  type="button"
                  onClick={handleRestoreOriginalAvatar}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-600 px-6 py-3 rounded-full text-sm font-medium transition text-gray-300 w-full text-center"
                >
                  {t("Khôi phục ảnh từ")} {authProvider === 'google' ? 'Google' : 'Facebook'}
                </button>
              )}
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-3 text-gray-400 hover:text-white transition"
                >
                  {t("Hủy")}
                </button>
                <button
                  onClick={handleSaveAvatar}
                  disabled={!selectedFile}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 py-3 rounded-full font-medium transition disabled:opacity-50"
                >
                  {t("Lưu ảnh")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết hoạt động */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setSelectedActivity(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <i data-feather="x" className="h-6 w-6"></i>
            </button>
            <h3 className="text-xl font-bold font-orbitron text-rose-500 mb-4 border-b border-gray-800 pb-2">
              {t("Chi tiết thông báo")}
            </h3>
            <div className="mt-4 text-gray-200 font-open-sans break-words whitespace-pre-wrap leading-relaxed">
              {selectedActivity.description}
            </div>
            <div className="mt-6 text-sm text-gray-500 text-right">
              {new Date(selectedActivity.time).toLocaleString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </div>
            <button
              onClick={() => setSelectedActivity(null)}
              className="mt-6 w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-full text-white font-medium transition"
            >
              {t("Đóng")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;