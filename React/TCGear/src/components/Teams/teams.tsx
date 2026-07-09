import React, { useEffect, useState, useCallback } from 'react';
import './teams.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import feather from 'feather-icons';
import { useSearch } from '../../context/SearchContext';
import { useTranslation } from 'react-i18next';

// Định nghĩa type
type TeamData = {
  team_id: string;
  team_name: string;
  team_image: string;
  team_counts: number;
  team_established: string;
  team_game: string;
  team_tournament: string;
  team_country: string;
};

type PlayerData = {
  player_id: string;
  player_fullname: string;
  player_ig_name: string;
  player_image: string;
  team_id: string;
  player_role: string;
};

// Component nút eye
const TeamButton: React.FC<{ onDetailsClick: (e: React.MouseEvent) => void }> = ({ onDetailsClick }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className="team-details eye-icon p-2 rounded-full bg-primary/20 hover:bg-primary/40 transition flex items-center justify-center"
      onClick={(e) => {
        console.log("🔥 ICON EYE ĐÃ BỊ CLICK!");
        e.stopPropagation();
        e.preventDefault();
        onDetailsClick(e);
      }}
      aria-label={t('Xem chi tiết đội')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5 16.477 5 20.268 7.943 21.542 12 20.268 16.057 16.477 19 12 19 7.523 19 3.732 16.057 2.458 12z"
        />
      </svg>
    </button>
  );
};

const Teams: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { searchQuery, clearSearch } = useSearch();

  const [teams, setTeams] = useState<TeamData[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<PlayerData[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayerImage, setSelectedPlayerImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PUBLIC_BASE_URL = '/public';
  const currentLang = i18n.language || 'vi';

  // Lọc teams
  const filteredTeams = teams.filter(
    (team) =>
      team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.team_game.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.team_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.team_tournament.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hàm dịch Google Translate
  const translateText = useCallback(
    async (text: string, targetLang: string = currentLang): Promise<string> => {
      if (!text || targetLang === 'vi') return text;
      if (targetLang === 'en') return text;

      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Translate failed');
        const data = await response.json();
        return data[0]?.[0]?.[0] || text;
      } catch (err) {
        console.error('Lỗi dịch:', err);
        return text;
      }
    },
    [currentLang]
  );

  const translateTeams = async (rawTeams: TeamData[]): Promise<TeamData[]> => {
    if (currentLang === 'vi') return rawTeams;
    return Promise.all(
      rawTeams.map(async (team) => ({
        ...team,
        team_name: await translateText(team.team_name),
        team_game: await translateText(team.team_game),
        team_tournament: await translateText(team.team_tournament),
        team_country: t(team.team_country),
      }))
    );
  };

  const translatePlayers = async (rawPlayers: PlayerData[]): Promise<PlayerData[]> => {
    if (currentLang === 'vi') return rawPlayers;
    return Promise.all(
      rawPlayers.map(async (player) => ({
        ...player,
        player_fullname: await translateText(player.player_fullname),
        player_ig_name: await translateText(player.player_ig_name),
        player_role: await translateText(player.player_role),
      }))
    );
  };

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3000/api/user/teams');
        if (!response.ok) throw new Error(t('Không thể tải danh sách đội'));

        const result = await response.json();
        if (result.status === 'success' && Array.isArray(result.data)) {
          const translatedTeams = await translateTeams(result.data);
          setTeams(translatedTeams);
        } else {
          throw new Error(t('Dữ liệu trả về không đúng định dạng'));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('Không thể kết nối tới server'));
        console.error('Lỗi fetch teams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [t, currentLang]);

  // Fetch players của team
  const fetchTeamPlayers = async (teamId: string) => {
    setLoadingPlayers(true);
    try {
      const response = await fetch(`http://localhost:3000/api/user/team-players/${teamId}`);
      if (!response.ok) throw new Error(t('Không thể tải danh sách người chơi'));

      const result = await response.json();
      if (result.status === 'success' && Array.isArray(result.data)) {
        const translatedPlayers = await translatePlayers(result.data);
        setTeamPlayers(translatedPlayers);
      } else {
        setTeamPlayers([]);
      }
    } catch (err) {
      console.error('Lỗi fetch players:', err);
      setTeamPlayers([]);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleTeamDetails = (team: TeamData) => {
    console.log("✅ handleTeamDetails ĐÃ CHẠY - Team:", team.team_name);
    setSelectedTeam(team);
    setTeamPlayers([]);
    setShowModal(true);
    fetchTeamPlayers(team.team_id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlayerImage(null);
  };

  const handlePlayerImageClick = (imageUrl: string) => {
    setSelectedPlayerImage(`${PUBLIC_BASE_URL}/${imageUrl}`);
  };

  const closePlayerLightbox = () => {
    setSelectedPlayerImage(null);
  };

  const formatPlayerName = (fullname: string, igName: string) => {
    const parts = fullname.split(' ');
    if (parts.length < 2) return fullname;
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return `${firstName} "${igName}" ${lastName}`;
  };

  const sortPlayersByRole = (players: PlayerData[], teamGame: string) => {
    const isMOBA = /league of legends|lol|wild rift|mobile legends|arena of valor/i.test(teamGame);
    if (!isMOBA) return players;

    const roleOrder: { [key: string]: number } = {
      'top laner': 1,
      top: 1,
      rừng: 2,
      jungler: 2,
      'mid laner': 3,
      mid: 3,
      'ad carry': 4,
      adc: 4,
      bot: 4,
      support: 5,
    };

    return [...players].sort((a, b) => {
      const roleA = roleOrder[a.player_role.toLowerCase()] || 999;
      const roleB = roleOrder[b.player_role.toLowerCase()] || 999;
      return roleA - roleB;
    });
  };

  const sortedPlayers = selectedTeam ? sortPlayersByRole(teamPlayers, selectedTeam.team_game) : teamPlayers;

  // Feather icons + AOS
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    feather.replace();
  }, []);

  useEffect(() => {
    feather.replace();
  }, [teams, showModal]);

  // RENDER
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
            srcSet="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80 800w, https://d2uax1u4k5j88t.cloudfront.net/item/294a717be0d7ef5ec3bb5d8ab4817c1c5074ab8ba79bc1855c66865f422b6c10/wallpaper1.png 1770w"
            sizes="(max-width: 800px) 800px, 1770px"
            alt="Esports team competition"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto" data-aos="fade-up">
          <h1 className="text-accent text-4xl md:text-6xl max-[499px]:text-3xl max-[374px]:text-2xl font-bold mb-6 font-orbitron">{t('ĐỘI TUYỂN CỦA CHÚNG TÔI')}</h1>
          <p className="text-accent text-xl max-[499px]:text-base mb-8 font-open-sans">
            {t('Khám phá các đội esports chuyên nghiệp tin tưởng TCGear để nâng cao sức mạnh cạnh tranh')}
          </p>
        </div>
      </section>

      {/* Featured Teams Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-accent text-3xl md:text-4xl max-[499px]:text-2xl font-bold mb-4 font-orbitron">{t('ĐỘI TUYỂN NỔI BẬT')}</h2>
          <p className="text-accent/70 max-w-2xl mx-auto text-lg max-[499px]:text-sm font-open-sans">
            {t('Các tổ chức esports chuyên nghiệp sử dụng thiết bị và áo đấu TCGear')}
          </p>
        </div>

        {searchQuery && (
          <div className="mb-8 text-center">
            <p className="text-accent text-xl max-[499px]:text-base">
              {t('Kết quả tìm kiếm cho:')} <span className="font-bold">{searchQuery}</span>
            </p>
            <button onClick={clearSearch} className="mt-2 text-primary hover:underline text-lg font-open-sans">
              {t('Xóa tìm kiếm')}
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <p className="text-accent text-xl">{t('Đang tải danh sách đội...')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-xl">{error}</p>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-accent text-xl">
              {searchQuery
                ? `${t('Không tìm thấy đội nào khớp với')} "${searchQuery}"`
                : t('Hiện chưa có đội nào')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeams.map((team, index) => (
              <div
                key={team.team_id}
                className="team-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 group"
                data-aos="fade-up"
                data-aos-delay={100 + index * 100}
                onClick={() => {
                  console.log("CARD CLICKED → gọi handleTeamDetails");
                  handleTeamDetails(team);
                }}
              >
                <div className="h-64 bg-gray-800 relative overflow-hidden">
                  <img
                    src={`${PUBLIC_BASE_URL}/${team.team_image}`}
                    alt={team.team_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {!team.team_name.includes('T1') && (
                    <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded font-open-sans font-semibold">
                      {t('ĐỐI TÁC')}
                    </span>
                  )}
                </div>
                <div className="p-6 bg-secondary">
                  <h3 className="font-semibold text-xl max-[499px]:text-lg mb-3 font-orbitron text-accent">{team.team_name}</h3>
                  <p className="text-accent/70 mb-4 font-open-sans max-[499px]:text-sm">
                    {team.team_game} • {team.team_tournament}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold font-open-sans">{team.team_country}</span>
                    <TeamButton
                      onDetailsClick={(e) => {
                        e.stopPropagation();
                        handleTeamDetails(team);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Partnership Section */}
      <section className="py-16 bg-black px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl max-[499px]:text-2xl font-bold mb-4 font-orbitron text-accent">
            {t('TRỞ THÀNH ĐỘI TUYỂN ĐỐI TÁC')}
          </h2>
          <p className="text-accent/70 max-w-3xl mx-auto mb-8 text-lg max-[499px]:text-sm font-open-sans">
            {t('Tham gia gia đình ngày càng phát triển của các tổ chức esports chuyên nghiệp và nâng cao hiệu suất đội của bạn với thiết bị và áo đấu tùy chỉnh TCGear')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-secondary/50 rounded-lg p-6" data-aos="fade-up" data-aos-delay="100">
              <i data-feather="award" className="h-12 w-12 text-primary mx-auto mb-4"></i>
              <h3 className="font-semibold text-xl max-[499px]:text-lg mb-2 font-orbitron">{t('Thiết bị cao cấp')}</h3>
              <p className="text-accent/70 font-open-sans max-[499px]:text-sm">
                {t('Tiếp cận thiết bị cấp độ giải đấu được thiết kế cho thi đấu chuyên nghiệp')}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-6" data-aos="fade-up" data-aos-delay="200">
              <i data-feather="shopping-bag" className="h-12 w-12 text-primary mx-auto mb-4"></i>
              <h3 className="font-semibold text-xl max-[499px]:text-lg mb-2 font-orbitron">{t('Áo đấu tùy chỉnh')}</h3>
              <p className="text-accent/70 font-open-sans max-[499px]:text-sm">
                {t('Thiết kế áo đấu đội độc đáo với thương hiệu và tên của người chơi')}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-6" data-aos="fade-up" data-aos-delay="300">
              <i data-feather="users" className="h-12 w-12 text-primary mx-auto mb-4"></i>
              <h3 className="font-semibold text-xl max-[499px]:text-lg mb-2 font-orbitron">{t('Tiếp cận')}</h3>
              <p className="text-accent/70 font-open-sans max-[499px]:text-sm">
                {t('Được giới thiệu trên nền tảng của chúng tôi và tiếp cận hàng nghìn người hâm mộ esports')}
              </p>
            </div>
          </div>
          <a
            href="contact.html"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 max-[499px]:px-6 max-[499px]:py-2 max-[499px]:text-sm rounded-md font-semibold transition font-orbitron"
          >
            {t('Đăng ký hợp tác')}
          </a>
        </div>
      </section>

      {/* Modal chính - ĐÃ FIX */}
      {showModal && selectedTeam && (
        <div
          className={`modal active fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] overflow-auto ${
            selectedPlayerImage ? 'pointer-events-none' : ''
          }`}
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <div className="modal-content bg-secondary p-8 md:p-10 max-[499px]:p-5 rounded-xl max-w-3xl w-full mx-4 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <span
              className="modal-close absolute top-4 right-6 text-accent hover:text-primary text-4xl font-bold transition cursor-pointer"
              onClick={handleCloseModal}
              aria-label={t('Đóng')}
            >
              ×
            </span>

            <img
              src={`${PUBLIC_BASE_URL}/${selectedTeam.team_image}`}
              alt={selectedTeam.team_name}
              className="w-full h-80 md:h-[320px] object-cover rounded-lg mb-6"
            />

            <h3 className="font-semibold text-2xl md:text-3xl max-[499px]:text-xl mb-6 font-orbitron text-accent">
              {selectedTeam.team_name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-primary mb-1 text-lg max-[499px]:text-base font-orbitron">{t('Khu vực')}</h4>
                <p className="text-accent/70 font-open-sans max-[499px]:text-sm">{selectedTeam.team_country}</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-1 text-lg max-[499px]:text-base font-orbitron">{t('Trò chơi')}</h4>
                <p className="text-accent/70 font-open-sans max-[499px]:text-sm">{selectedTeam.team_game}</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-1 text-lg max-[499px]:text-base font-orbitron">{t('Giải đấu')}</h4>
                <p className="text-accent/70 font-open-sans max-[499px]:text-sm">{selectedTeam.team_tournament}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-primary mb-3 text-lg md:text-xl max-[499px]:text-base font-orbitron">
                {t('Người chơi')}
              </h4>

              {loadingPlayers ? (
                <p className="text-accent/70">{t('Đang tải danh sách người chơi...')}</p>
              ) : teamPlayers.length === 0 ? (
                <p className="text-accent/70">{t('Chưa có thông tin người chơi')}</p>
              ) : (
                <div className="space-y-4">
                  {sortedPlayers.map((player) => (
                    <div key={player.player_id} className="flex items-center gap-4">
                      <img
                        src={`${PUBLIC_BASE_URL}/${player.player_image}`}
                        alt={player.player_ig_name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary cursor-pointer hover:opacity-80 transition"
                        onClick={() => handlePlayerImageClick(player.player_image)}
                      />
                      <div>
                        <p className="text-accent/90 font-semibold font-open-sans max-[499px]:text-sm">
                          {formatPlayerName(player.player_fullname, player.player_ig_name)}
                        </p>
                        <p className="text-accent/60 text-sm max-[499px]:text-xs font-open-sans">{player.player_role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 max-[499px]:px-4 max-[499px]:py-2 max-[499px]:text-base rounded-md transition font-orbitron text-lg"
              aria-label={t('Liên hệ đội')}
            >
              {t('Liên hệ đội')}
            </button>

            <div className="flex space-x-6 mt-6">
              <a href="#" className="text-accent hover:text-primary transition" aria-label="Facebook">
                <i data-feather="facebook" className="h-7 w-7"></i>
              </a>
              <a href="#" className="text-accent hover:text-primary transition" aria-label="Twitter">
                <i data-feather="twitter" className="h-7 w-7"></i>
              </a>
              <a href="#" className="text-accent hover:text-primary transition" aria-label="Instagram">
                <i data-feather="instagram" className="h-7 w-7"></i>
              </a>
              <a href="#" className="text-accent hover:text-primary transition" aria-label="YouTube">
                <i data-feather="youtube" className="h-7 w-7"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox ảnh người chơi */}
      {selectedPlayerImage && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[9999] transition-opacity duration-300"
          onClick={closePlayerLightbox}
        >
          <div className="relative w-[80vw] max-w-[1000px] h-[80vh] flex items-center justify-center p-4">
            <span
              className="absolute top-4 right-4 text-white text-5xl font-bold cursor-pointer hover:text-gray-300 transition"
              onClick={closePlayerLightbox}
              aria-label={t('Đóng')}
            >
              ×
            </span>
            <div className="w-full h-full overflow-hidden rounded-xl shadow-2xl">
              <img
                src={selectedPlayerImage}
                alt="Player enlarged"
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Teams;