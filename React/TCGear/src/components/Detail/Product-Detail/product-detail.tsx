import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './product-detail.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import feather from 'feather-icons';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useToast } from '../../../context/ToastContext';
import { useTranslation } from 'react-i18next';

const EmptyStarSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const FilledStarSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || ''} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullCount = Math.floor(rating);
  const decimal = rating - fullCount;
  const partialPercent = Math.round(decimal * 100);
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    if (i < fullCount) {
      stars.push(
        <i key={i} data-feather="star" className="h-4 w-4 text-red-500 fill-current drop-shadow"></i>
      );
    } else if (i === fullCount && decimal > 0) {
      stars.push(
        <div key={i} className="relative h-4 w-4">
          <i data-feather="star" className="h-4 w-4 text-gray-300 absolute inset-0"></i>
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${partialPercent}%` }}>
            <i data-feather="star" className="h-4 w-4 text-red-500 fill-current absolute inset-0 drop-shadow"></i>
          </div>
        </div>
      );
    } else {
      stars.push(
        <i key={i} data-feather="star" className="h-4 w-4 text-gray-300"></i>
      );
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const InteractiveStarRating: React.FC<{
  selectedRating: number;
  hoveredRating: number;
  onHover: (rating: number) => void;
  onSelect: (rating: number) => void;
  onLeave: () => void;
}> = ({ selectedRating, hoveredRating, onHover, onSelect, onLeave }) => {
  const displayRating = hoveredRating > 0 ? hoveredRating : selectedRating;
  return (
    <div className="flex gap-4 justify-center" onMouseLeave={onLeave}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          type="button"
          key={i}
          className={`relative h-10 w-10 cursor-pointer transition-all duration-300 ${i <= displayRating ? 'scale-125 drop-shadow-lg' : 'hover:scale-110'
            }`}
          onMouseEnter={() => onHover(i)}
          onClick={() => onSelect(i)}
        >
          <EmptyStarSVG
            className={`absolute inset-0 transition-colors ${i <= displayRating ? 'text-red-500 opacity-0' : 'text-gray-300 hover:text-red-400'
              }`}
          />
          <FilledStarSVG
            className={`absolute inset-0 pointer-events-none transition-opacity ${i <= displayRating ? 'text-red-500 opacity-100' : 'opacity-0'
              }`}
          />
        </button>
      ))}
    </div>
  );
};

const autoTranslate = async (text: string): Promise<string> => {
  if (!text || text.trim() === '') return text;
  const cacheKey = `trans_prod_${text.trim()}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;
  try {
    const encoded = encodeURIComponent(text.trim());
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encoded}`
    );
    const data = await res.json();
    const translated = data[0][0][0];
    localStorage.setItem(cacheKey, translated);
    return translated;
  } catch (err) {
    console.warn('Translate error:', err);
    return text;
  }
};

const ReplyForm: React.FC<{
  onCancel: () => void;
  onSubmit: (text: string, displayName: string) => Promise<void>;
  isSubmitting: boolean;
  currentUserImage?: string | null;
}> = ({ onCancel, onSubmit, isSubmitting, currentUserImage }) => {
  const [localText, setLocalText] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  useEffect(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setDisplayName(`Khách vãng lai ${randomNum}`);
  }, []);
  const handleSubmit = async () => {
    const trimmed = localText.trim();
    if (!trimmed) return;
    await onSubmit(trimmed, displayName);
    setLocalText('');
  };
  return (
    <div className="mt-6 border-l-4 border-primary/40 pl-8 py-4 bg-primary/10 rounded-r-lg flex gap-4">
      <img
        src={currentUserImage ? (currentUserImage.startsWith('/') ? currentUserImage : `/${currentUserImage}`) : "/public/img/fanT1.jpg"}
        alt="Guest"
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        onError={(e) => (e.currentTarget.src = '/public/img/fanT1.jpg')}
      />
      <div className="flex-1">
        <div className="font-bold text-primary mb-3">{displayName}</div>
        <textarea
          rows={4}
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          placeholder="Viết câu trả lời của bạn..."
          maxLength={1000}
          className="w-full px-4 py-2 rounded-md bg-secondary/70 text-white border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-md bg-gray-600/70 hover:bg-gray-700 text-white text-sm"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!localText.trim() || isSubmitting}
            className="px-5 py-2 rounded-md bg-primary hover:bg-primary/90 text-white text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi trả lời'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface Reply {
  id: string;
  type: 'response';
  text: string;
  create_at: string;
  user_fullname: string | null;
  user_image: string | null;
  user_isAdmin: boolean;
  replies: Reply[];
}

interface Review {
  id: string;
  type: 'comment';
  text: string | null;
  rating: number | null;
  create_at: string;
  guest_name: string;
  user_fullname: string | null;
  user_image: string | null;
  user_isAdmin: boolean;
  replies: Reply[];
}

const ProductDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { success, error, wishlistAdd, wishlistRemove } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [translatedName, setTranslatedName] = useState<string>('');
  const [translatedDesc, setTranslatedDesc] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [translatedRelatedNames, setTranslatedRelatedNames] = useState<Record<string, string>>({});
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string>('TCG-SIZ-001');
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | string>(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [currentImage, setCurrentImage] = useState<string>('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [guestName, setGuestName] = useState<string>('');
  const [isLoggedInWithFullname, setIsLoggedInWithFullname] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');
  const [currentUserImage, setCurrentUserImage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.fullname) {
          setGuestName(parsedUser.fullname);
          setIsLoggedInWithFullname(true);
        } else if (parsedUser.user_fullname) {
          setGuestName(parsedUser.user_fullname);
          setIsLoggedInWithFullname(true);
        }
        if (parsedUser.image) {
          setCurrentUserImage(parsedUser.image);
        } else if (parsedUser.user_image) {
          setCurrentUserImage(parsedUser.user_image);
        }
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
    }
  }, []);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const generateRandomName = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setGuestName(`Fan T1 ${randomNum}`);
  };

  const specsData: any = {
    'TCG-CAT-001': {
      general: [
        { label: 'Đường kính driver', value: '50mm' },
        { label: 'Dải tần số', value: '20Hz-20kHz' },
        { label: 'Trở kháng', value: '32Ω' },
        { label: 'Độ nhạy', value: '100±3dB' },
      ],
      connection: [
        { label: 'Kết nối', value: 'USB, jack 3.5mm' },
        { label: 'Chiều dài dây', value: '2.2m / 7.2ft' },
        { label: 'Trọng lượng', value: '320g' },
        { label: 'Tương thích', value: 'PC, PS4, PS5, Xbox, Switch, Mobile' },
      ],
    },
    'TCG-CAT-002': {
      material: [
        { label: 'Chất liệu chính', value: '100% Polyester thoáng khí' },
        { label: 'Công nghệ vải', value: 'Dri-FIT chống thấm mồ hôi' },
        { label: 'Thiết kế cổ', value: 'Cổ V thoáng mát' },
        { label: 'In ấn', value: 'In lụa cao cấp, chống phai màu' },
      ],
      sizing: [
        { label: 'Kích thước phổ biến', value: 'S, M, L, XL, XXL' },
        { label: 'Độ dài tay áo', value: 'Ngắn (cho mùa hè), Dài (mùa đông tùy chọn)' },
        { label: 'Trọng lượng vải', value: '150g/m²' },
        { label: 'Hướng dẫn đo', value: 'Dựa trên vòng ngực và chiều dài thân' },
      ],
    },
  };

  const featuresData: any = {
    'TCG-CAT-001': [
      { icon: 'check', text: t("Âm thanh vòm 7.1") },
      { icon: 'check', text: t("Khử tiếng ồn chủ động") },
      { icon: 'check', text: t("Đệm tai bằng mút hoạt tính") },
      { icon: 'check', text: t("Đèn RGB tùy chỉnh") },
      { icon: 'check', text: t("Micro khử tiếng ồn có thể tháo rời") },
    ],
    'TCG-CAT-002': [
      { icon: 'check', text: t("Chất liệu thoáng khí 100% Polyester") },
      { icon: 'check', text: t("Công nghệ Dri-FIT chống thấm mồ hôi") },
      { icon: 'check', text: t("Thiết kế cổ V thoải mái") },
      { icon: 'check', text: t("In ấn cao cấp, chống phai màu") },
      { icon: 'check', text: t("Phù hợp cho thi đấu và tập luyện") },
    ],
  };

  const getDisplayName = (item: any) => {
    if (item.user_fullname) {
      return item.user_isAdmin ? `${item.user_fullname} - Admin` : item.user_fullname;
    }
    return item.guest_name || 'Khách vãng lai';
  };

  const getDisplayImage = (item: any) => {
    if (item.user_image) {
      return item.user_image.startsWith('/') ? item.user_image : `/${item.user_image}`;
    }
    return '/public/img/fanT1.jpg';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return '1 ngày trước';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const fetchReviews = async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/user/reviews/${id}`, { cache: 'no-cache' });
      const data = await res.json();
      if (data.status === 'success') {
        const normalizeDate = (item: any): any => {
          const dateValue = item.create_at ?? item.created_at ?? item.createdAt ?? item.CreateAt ?? item.date ?? item.timestamp ?? null;
          return {
            ...item,
            create_at: dateValue,
            replies: item.replies ? item.replies.map(normalizeDate) : [],
          };
        };

        let normalizedReviews = (data.data || []).map(normalizeDate);

        const translateReviewRecursively = async (item: any): Promise<any> => {
          let translatedText = item.text;
          if (i18n.language === 'en' && translatedText) {
            translatedText = await autoTranslate(translatedText);
          }
          let translatedReplies = [];
          if (item.replies && item.replies.length > 0) {
            translatedReplies = await Promise.all(item.replies.map(translateReviewRecursively));
          }
          return {
            ...item,
            text: translatedText,
            replies: translatedReplies
          };
        };

        normalizedReviews = await Promise.all(normalizedReviews.map(translateReviewRecursively));
        setReviews(normalizedReviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error(err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReplySubmit = async (text: string, displayName: string, parentId: string) => {
    setReplySubmitting(true);
    try {
      const storedUser = localStorage.getItem('user');
      let userId = null;
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.user_id || parsedUser.id;
        } catch (e) { }
      }

      const isComment = parentId.startsWith('TCG-CMT-');
      const body: any = {
        productId: id,
        responseText: text,
        userId: userId,
      };
      if (isComment) {
        body.cmtId = parentId;
      } else {
        body.parentResponseId = parentId;
      }
      const res = await fetch('http://localhost:3000/api/user/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        success?.('Trả lời thành công!');
        fetchReviews();
        setReplyingTo(null);
      } else {
        error?.('Gửi trả lời thất bại');
      }
    } catch (err) {
      error?.('Lỗi server');
    } finally {
      setReplySubmitting(false);
    }
  };

  const ReplyItem: React.FC<{ reply: Reply }> = ({ reply }) => (
    <div className="mt-6 border-l-4 border-primary/40 pl-8">
      <div className="flex gap-4">
        <img
          src={getDisplayImage(reply)}
          alt={getDisplayName(reply)}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          onError={(e) => (e.currentTarget.src = '/public/img/fanT1.jpg')}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-primary">
              {getDisplayName(reply)}
            </span>
            <span className="text-accent/70 text-sm">{formatDate(reply.create_at)}</span>
          </div>
          <p className="text-accent mb-4">{reply.text}</p>
          <button
            onClick={() => setReplyingTo(reply.id)}
            className="text-sm text-primary hover:underline"
          >
            Trả lời
          </button>
          {replyingTo === reply.id && (
            <ReplyForm
              onCancel={() => setReplyingTo(null)}
              onSubmit={(text, name) => handleReplySubmit(text, name, reply.id)}
              isSubmitting={replySubmitting}
              currentUserImage={currentUserImage}
            />
          )}
          {reply.replies.map((child) => (
            <ReplyItem key={child.id} reply={child} />
          ))}
        </div>
      </div>
    </div>
  );

  const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
    <div className="bg-secondary/50 rounded-lg p-6 border border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={getDisplayImage(review)}
            alt={getDisplayName(review)}
            className="w-14 h-14 rounded-full object-cover border-2 border-primary/50"
            onError={(e) => (e.currentTarget.src = '/public/img/fanT1.jpg')}
          />
          <div>
            <h4 className="font-semibold text-white text-lg">{getDisplayName(review)}</h4>
            <div className="mt-1">
              {review.rating ? <StarRating rating={review.rating} /> : <span className="text-accent/50 italic text-sm">Chưa đánh giá sao</span>}
            </div>
          </div>
        </div>
        <span className="text-accent/70 text-sm">{formatDate(review.create_at)}</span>
      </div>
      {review.text && <p className="text-white mb-4">{review.text}</p>}
      <button
        onClick={() => setReplyingTo(review.id)}
        className="text-sm text-primary hover:underline mb-6 block"
      >
        Trả lời
      </button>
      {replyingTo === review.id && (
        <ReplyForm
          onCancel={() => setReplyingTo(null)}
          onSubmit={(text, name) => handleReplySubmit(text, name, review.id)}
          isSubmitting={replySubmitting}
          currentUserImage={currentUserImage}
        />
      )}
      {review.replies.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}
    </div>
  );

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`http://localhost:3000/api/user/products/${id}`, { cache: 'no-cache' })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(async (data) => {
          if (data.status === 'success') {
            const prod = data.data;
            setProduct(prod);
            if (i18n.language === 'en') {
              const [transName, transDesc] = await Promise.all([
                autoTranslate(prod.product_name),
                prod.product_desc ? autoTranslate(prod.product_desc) : Promise.resolve('')
              ]);
              setTranslatedName(transName);
              setTranslatedDesc(transDesc);
            } else {
              setTranslatedName(prod.product_name);
              setTranslatedDesc(prod.product_desc || '');
            }
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, i18n.language]);

  useEffect(() => {
    if (product && product.cate_id) {
      fetch(`http://localhost:3000/api/user/products/categories/${product.cate_id}`, { cache: 'no-cache' })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.status === 'success') {
            const filtered = data.data.filter((p: any) => p.product_id !== id);
            setRelatedProducts(filtered);
            if (i18n.language === 'en') {
              const translations: Record<string, string> = {};
              for (const rel of filtered) {
                const trans = await autoTranslate(rel.product_name);
                translations[rel.product_id] = trans;
              }
              setTranslatedRelatedNames(translations);
            } else {
              setTranslatedRelatedNames({});
            }
          }
        })
        .catch(console.error);
    }
  }, [product, id, i18n.language]);

  useEffect(() => {
    if (product && product.cate_id) {
      setVariants([]);
      if (product.cate_id === 'TCG-CAT-001') {
        fetch('http://localhost:3000/api/user/colors', { cache: 'no-cache' })
          .then((res) => res.json())
          .then((data) => data.status === 'success' && setVariants(data.data));
      } else if (product.cate_id === 'TCG-CAT-002') {
        fetch('http://localhost:3000/api/user/sizes', { cache: 'no-cache' })
          .then((res) => res.json())
          .then((data) => data.status === 'success' && setVariants(data.data));
      }
    }
  }, [product]);

  const fetchVariant = async (variantParam: string) => {
    const categorySlug = product?.cate_id === 'TCG-CAT-001' ? 'gear' : 'jersey';
    try {
      const res = await fetch(`http://localhost:3000/api/user/variants/products/${categorySlug}/${id}/${variantParam}`, { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') setSelectedVariant(data.data);
        else setSelectedVariant(null);
      } else setSelectedVariant(null);
    } catch {
      setSelectedVariant(null);
    }
  };

  useEffect(() => {
    if (product?.cate_id === 'TCG-CAT-002' && variants.length > 0) {
      const defaultSizeId = variants[0]?.size_id || 'TCG-SIZ-001';
      setSelectedSizeId(defaultSizeId);
    }
  }, [variants, product]);

  useEffect(() => {
    if (product?.cate_id === 'TCG-CAT-001' && variants.length > 0) {
      const defaultColorId = variants[0]?.color_id || null;
      setSelectedColorId(defaultColorId);
    }
  }, [variants, product]);

  useEffect(() => {
    if (product?.cate_id === 'TCG-CAT-002' && selectedSizeId) fetchVariant(selectedSizeId);
  }, [selectedSizeId, product]);

  useEffect(() => {
    if (product?.cate_id === 'TCG-CAT-001' && selectedColorId) fetchVariant(selectedColorId);
  }, [selectedColorId, product]);

  useEffect(() => {
    const current = selectedVariant || product;
    if (current?.product_image) {
      setCurrentImage(current.product_image);
    }
  }, [selectedVariant, product]);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    feather.replace();
  }, []);

  useEffect(() => {
    feather.replace();
  }, [relatedProducts, activeTab, reviews]);

  useEffect(() => {
    fetchReviews();
  }, [id, i18n.language]);

  const handleAddToCart = () => {
    if (!product) return;
    const isGear = product.cate_id === 'TCG-CAT-001';
    const isJersey = product.cate_id === 'TCG-CAT-002';
    if (isGear && !selectedColorId) {
      error?.(t("Vui lòng chọn màu sắc"));
      return;
    }
    if (isJersey && !selectedSizeId) {
      error?.(t("Vui lòng chọn kích thước"));
      return;
    }
    const current = selectedVariant || product;
    const colorName = isGear ? variants.find(v => v.color_id === selectedColorId)?.color_name : undefined;
    const sizeName = isJersey ? variants.find(v => v.size_id === selectedSizeId)?.size_name : undefined;

    // Check if the current selectedVariant matches the selected size/color
    // If it doesn't match yet, it means the API is still fetching. We should wait or prevent adding.
    if (isGear && selectedVariant && selectedVariant.color_id !== selectedColorId) {
      error?.(t("Đang cập nhật thông tin sản phẩm, vui lòng thử lại"));
      return;
    }
    if (isJersey && selectedVariant && selectedVariant.size_id !== selectedSizeId) {
      error?.(t("Đang cập nhật thông tin sản phẩm, vui lòng thử lại"));
      return;
    }

    if (selectedVariant && selectedVariant.stock !== undefined) {
      if (selectedVariant.stock === 0) {
        error?.(t("Sản phẩm đã hết hàng"));
        return;
      }
      const qtyNum = Number(quantity) || 1;
      if (qtyNum > selectedVariant.stock) {
        error?.(t("Số lượng trong kho không đủ"));
        return;
      }
    }

    const qtyNum = Number(quantity) || 1;
    addToCart({
      id: product.product_id,
      variant_id: selectedVariant?.variant_id || undefined,
      name: current.product_name || product.product_name,
      price: current.price || product.product_price,
      image: `/public/${current.product_image || product.product_image}`,
      cate_id: product.cate_id,
      color: colorName,
      colorId: selectedColorId || undefined,
      size: sizeName,
      sizeId: selectedSizeId || undefined,
      description: current.product_desc || product.product_desc,
    }, qtyNum);

    let detailMsg = `${qtyNum} x ${current.product_name || product.product_name}`;
    if (isGear && colorName) detailMsg += ` Màu : ${colorName}`;
    if (isJersey && sizeName) detailMsg += ` Size : ${sizeName}`;

    success?.(t("Đã thêm vào giỏ!"), detailMsg);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const isGear = product.cate_id === 'TCG-CAT-001';
    const isJersey = product.cate_id === 'TCG-CAT-002';
    if (isGear && !selectedColorId) {
      error?.(t("Vui lòng chọn màu sắc"));
      return;
    }
    if (isJersey && !selectedSizeId) {
      error?.(t("Vui lòng chọn kích thước"));
      return;
    }
    const current = selectedVariant || product;
    const colorName = isGear ? variants.find(v => v.color_id === selectedColorId)?.color_name : undefined;
    const sizeName = isJersey ? variants.find(v => v.size_id === selectedSizeId)?.size_name : undefined;

    if (isGear && selectedVariant && selectedVariant.color_id !== selectedColorId) {
      error?.(t("Đang cập nhật thông tin sản phẩm, vui lòng thử lại"));
      return;
    }
    if (isJersey && selectedVariant && selectedVariant.size_id !== selectedSizeId) {
      error?.(t("Đang cập nhật thông tin sản phẩm, vui lòng thử lại"));
      return;
    }

    if (selectedVariant && selectedVariant.stock !== undefined) {
      if (selectedVariant.stock === 0) {
        error?.(t("Sản phẩm đã hết hàng"));
        return;
      }
      const qtyNum = Number(quantity) || 1;
      if (qtyNum > selectedVariant.stock) {
        error?.(t("Số lượng trong kho không đủ"));
        return;
      }
    }

    const qtyNum = Number(quantity) || 1;
    const buyNowItem = {
      id: product.product_id,
      variant_id: selectedVariant?.variant_id || undefined,
      name: current.product_name || product.product_name,
      price: current.price || product.product_price,
      image: `/public/${current.product_image || product.product_image}`,
      cate_id: product.cate_id,
      color: colorName,
      colorId: selectedColorId || undefined,
      size: sizeName,
      sizeId: selectedSizeId || undefined,
      description: current.product_desc || product.product_desc,
      quantity: qtyNum
    };

    localStorage.setItem('checkoutItems', JSON.stringify([buyNowItem]));
    window.location.href = '/checkout';
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const isGear = product.cate_id === 'TCG-CAT-001';
    const isJersey = product.cate_id === 'TCG-CAT-002';
    if (isGear && !selectedColorId) {
      error?.(t("Vui lòng chọn màu sắc trước khi thêm vào yêu thích"));
      return;
    }
    if (isJersey && !selectedSizeId) {
      error?.(t("Vui lòng chọn kích thước trước khi thêm vào yêu thích"));
      return;
    }
    const current = selectedVariant || product;
    const selectedColor = isGear && selectedColorId
      ? variants.find(v => v.color_id === selectedColorId)
      : null;
    const selectedSize = isJersey && selectedSizeId
      ? variants.find(v => v.size_id === selectedSizeId)?.size_name
      : null;
    const wishlistItem = {
      id: current.product_id || product.product_id,
      name: current.product_name || product.product_name,
      price: current.price || product.product_price,
      image: `/public/${current.product_image || product.product_image}`,
      description: current.product_desc || product.product_desc || product.product_name,
      color: selectedColor?.color_name || undefined,
      colorCode: selectedColor?.color_code || undefined,
      size: selectedSize || undefined,
      cate_id: product.cate_id,
    };
    let detailMsg = `${quantity} x ${current.product_name || product.product_name}`;
    if (isGear && selectedColor) detailMsg += ` Màu : ${selectedColor.color_name}`;
    if (isJersey && selectedSize) detailMsg += ` Size : ${selectedSize}`;

    if (isInWishlist(product.product_id)) {
      removeFromWishlist(product.product_id);
      wishlistRemove?.(t("Đã xóa"), detailMsg);
    } else {
      addToWishlist(wishlistItem);
      wishlistAdd?.(t("Đã thêm yêu thích"), detailMsg);
    }
  };


  // Trong ProductDetail component, thay đổi hàm handleSubmitComment

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating) {
      error?.(t("Vui lòng chọn số sao!"));
      return;
    }

    try {
      setSubmitting(true);
      const storedUser = localStorage.getItem('user');
      let userId = null;
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.user_id || parsedUser.id;
        } catch (e) { }
      }

      let token = localStorage.getItem('token');
      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }

      const res = await fetch('http://localhost:3000/api/user/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: id,
          rating: selectedRating,
          commentText: commentText,
          guestName: guestName,
          userId: userId,
        }),
      });

      const data = await res.json();
      if (data.status === 'success') {
        success?.(t("Gửi đánh giá thành công!"), t("Cảm ơn bạn đã đánh giá sản phẩm"));
        // Đợi Toast hiển thị rồi reload
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        error?.(data.message || t("Gửi đánh giá thất bại"));
      }
    } catch (err) {
      console.error(err);
      error?.(t("Lỗi server, vui lòng thử lại sau"));
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">{t("Đang tải sản phẩm...")}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">{t("Sản phẩm không tồn tại.")}</div>
      </div>
    );
  }

  const displayName = translatedName || product.product_name;
  const displayDesc = translatedDesc || product.product_desc || '';
  const currentProduct = selectedVariant || product;
  const galleryImages = [
    currentProduct.product_image || product.product_image,
    product.product_image_2,
    product.product_image_3,
  ].filter(Boolean);
  if (!currentImage && galleryImages.length > 0) {
    setCurrentImage(galleryImages[0]);
  }

  const displayPrice = (() => {
    const price = selectedVariant?.price ?? product.product_price;
    return price && !isNaN(price) && price > 0
      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
      : t("Liên hệ");
  })();

  const categoryName = product.cate_id === 'TCG-CAT-001' ? t("Thiết bị") : t("Áo đấu");
  const categoryLink = product.cate_id === 'TCG-CAT-001' ? '/shop?category=gear' : '/shop?category=jerseys';
  const currentSpecs = specsData[product.cate_id] || specsData['TCG-CAT-001'];
  const currentFeatures = featuresData[product.cate_id] || featuresData['TCG-CAT-001'];
  const inWishlist = isInWishlist(product.product_id);
  const ratingCount = currentProduct.product_rating_count || product.product_rating_count || 0;
  const rating = currentProduct.product_rating || product.product_rating || 0;
  const hasRating = ratingCount > 0;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-accent/70 font-open-sans">
            <li><Link to="/" className="hover:text-primary transition">{t("Trang chủ")}</Link></li>
            <li className="flex items-center"><i data-feather="chevron-right" className="h-4 w-4 mx-2"></i><Link to="/shop" className="hover:text-primary transition">{t("Cửa hàng")}</Link></li>
            <li className="flex items-center"><i data-feather="chevron-right" className="h-4 w-4 mx-2"></i><Link to={categoryLink} className="hover:text-primary transition">{categoryName}</Link></li>
            <li className="flex items-center"><i data-feather="chevron-right" className="h-4 w-4 mx-2"></i><span className="text-primary">{displayName}</span></li>
          </ol>
        </nav>
      </div>
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-[767px]:gap-6 max-[499px]:gap-4">
          <div className="flex flex-col gap-6" data-aos="fade-right">
            <div className="relative">
              <img
                src={`/public/${currentImage}`}
                alt={displayName}
                className="w-full max-h-[600px] object-contain rounded-xl shadow-2xl bg-secondary/50 transition-all duration-500 ease-in-out"
                loading="lazy"
                onError={(e) => (e.currentTarget.src = '/public/img/fanT1.jpg')}
              />
            </div>
            {galleryImages.length > 1 && (
              <div className="flex gap-4 justify-center overflow-x-auto pb-2 px-4">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(img)}
                    className={`flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border-4 transition-all duration-300 ${currentImage === img
                      ? 'border-primary ring-4 ring-primary/40 shadow-xl scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-primary/50 hover:scale-105'
                      }`}
                  >
                    <img
                      src={`/public/${img}`}
                      alt={`${displayName} - ảnh ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = '/public/img/fanT1.jpg')}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="product-info" data-aos="fade-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-3 font-orbitron text-accent">{displayName}</h1>
            <div className="flex flex-wrap items-center gap-y-2 mb-4">
              {hasRating ? (
                <>
                  <StarRating rating={currentProduct.product_rating || product.product_rating || 0} />
                  <span className="text-accent/70 text-sm font-open-sans ml-2">({rating})</span>
                </>
              ) : (
                <span className="text-accent/70 text-sm font-open-sans">Chưa có đánh giá</span>
              )}
              <button onClick={handleToggleWishlist} className={`ml-4 flex items-center gap-1.5 text-accent/60 hover:text-red-500 transition-colors wishlist-btn ${inWishlist ? 'text-red-500' : ''}`}>
                <i data-feather="heart" className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`}></i>
                <span className="text-sm hidden sm:inline">{t("Yêu thích")}</span>
              </button>
            </div>
            <p className="text-primary text-xl sm:text-2xl max-[499px]:text-lg max-[374px]:text-base font-bold mb-6 font-open-sans">{displayPrice}</p>
            <div className="mb-6">
              <p className="text-accent/70 mb-4 text-sm sm:text-base font-open-sans">{displayDesc}</p>
              <div className="space-y-2 mb-6">
                {currentFeatures.map((feature: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <i data-feather={feature.icon} className="h-5 w-5 text-primary mr-2"></i>
                    <span className="font-open-sans text-accent">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            {product.cate_id === 'TCG-CAT-001' && variants.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold mb-2 text-sm sm:text-base font-open-sans text-accent">{t("Màu sắc:")}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {variants.map((color) => (
                    <button
                      key={color.color_id}
                      onClick={() => setSelectedColorId(color.color_id)}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColorId === color.color_id ? 'border-primary ring-2 ring-primary/50' : 'border-gray-300'}`}
                      style={{ backgroundColor: color.color_code }}
                      aria-label={color.color_name}
                    />
                  ))}
                </div>
              </div>
            )}
            {product.cate_id === 'TCG-CAT-002' && variants.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold mb-2 text-sm sm:text-base font-open-sans text-accent">{t("Kích thước:")}</p>
                <div className="size-selector flex gap-4 mb-4 flex-wrap">
                  {variants.map((size) => (
                    <div key={size.size_id} className="flex items-center gap-1">
                      <input type="radio" name="size" id={`size-${size.size_id}`} value={size.size_id} checked={selectedSizeId === size.size_id} onChange={() => setSelectedSizeId(size.size_id)} />
                      <label htmlFor={`size-${size.size_id}`} className="text-sm text-accent cursor-pointer">{size.size_name}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-4 mb-6">
              <div className="quantity-selector w-fit">
                <button className="quantity-btn" onClick={() => setQuantity(prev => Math.max(1, (Number(prev) || 1) - 1))}>-</button>
                <input
                  type="number"
                  className="quantity-input"
                  value={quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setQuantity('');
                    } else {
                      const parsed = parseInt(val);
                      if (!isNaN(parsed)) {
                        setQuantity(Math.max(1, parsed));
                      }
                    }
                  }}
                  onBlur={() => {
                    if (quantity === '') setQuantity(1);
                  }}
                  min="1"
                />
                <button className="quantity-btn" onClick={() => setQuantity(prev => (Number(prev) || 1) + 1)}>+</button>
              </div>
              <div className="flex flex-row gap-4 w-full">
                <button
                  onClick={handleAddToCart}
                  disabled={selectedVariant?.stock === 0}
                  className={`flex-1 text-white px-4 sm:px-6 py-3 rounded-md font-semibold transition flex justify-center items-center gap-2 font-orbitron ${selectedVariant?.stock === 0 ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-primary hover:bg-primary/90'}`}>
                  <i data-feather="shopping-cart" className="h-5 w-5"></i>
                  <span className="hidden sm:inline">{t("Thêm vào giỏ hàng")}</span>
                  <span className="sm:hidden">{t("Thêm")}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={selectedVariant?.stock === 0}
                  className={`flex-1 text-white px-4 sm:px-6 py-3 rounded-md font-semibold transition flex justify-center items-center gap-2 font-orbitron ${selectedVariant?.stock === 0 ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-red-600 hover:bg-red-700'}`}>
                  <i data-feather="credit-card" className="h-5 w-5"></i>
                  {selectedVariant?.stock === 0 ? t("Hết hàng") : t("Mua ngay")}
                </button>
              </div>
            </div>
            <div className="border-t border-primary/20 pt-4">
              <div className="flex items-center gap-2 text-accent/70 mb-2 text-sm font-open-sans">
                <i data-feather="truck" className="h-5 w-5"></i>
                <span>{t("Miễn phí vận chuyển cho đơn hàng trên 50 USD")}</span>
              </div>
              <div className="flex items-center gap-2 text-accent/70 text-sm font-open-sans">
                <i data-feather="rotate-cw" className="h-5 w-5"></i>
                <span>{t("Đảm bảo hoàn tiền trong 30 ngày")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="border-b border-primary/20 mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button className={`tab-button ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>{t("Mô tả")}</button>
            <button className={`tab-button ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>{t("Thông số kỹ thuật")}</button>
            <button className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>{t("Đánh giá")} ({reviews.length})</button>
          </div>
        </div>
        <div className={`tab-content ${activeTab === 'description' ? 'active' : ''}`}>
          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg sm:text-xl max-[499px]:text-base mb-4 font-orbitron text-accent">{t("Nâng Tầm Trải Nghiệm Chơi Game")}</h3>
            <p className="mb-4 text-sm sm:text-base font-open-sans">{displayDesc}</p>
          </div>
        </div>
        <div className={`tab-content ${activeTab === 'specs' ? 'active' : ''}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-[499px]:gap-4">
            <div>
              <h3 className="text-lg sm:text-xl max-[499px]:text-base mb-4 font-orbitron text-accent">
                {product.cate_id === 'TCG-CAT-001' ? t("Thông số kỹ thuật") : t("Chất liệu & Thiết kế")}
              </h3>
              <div className="space-y-3">
                {(product.cate_id === 'TCG-CAT-001' ? currentSpecs.general : currentSpecs.material).map((spec: any, i: number) => (
                  <div key={i} className="flex justify-between border-b border-primary/10 py-2 text-sm sm:text-base font-open-sans">
                    <span className="text-accent/70">{spec.label}</span>
                    <span className="text-accent">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl max-[499px]:text-base mb-4 font-orbitron text-accent">
                {product.cate_id === 'TCG-CAT-001' ? t("Kết nối") : t("Hướng dẫn kích thước")}
              </h3>
              <div className="space-y-3">
                {(product.cate_id === 'TCG-CAT-001' ? currentSpecs.connection : currentSpecs.sizing).map((spec: any, i: number) => (
                  <div key={i} className="flex justify-between border-b border-primary/10 py-2 text-sm sm:text-base font-open-sans">
                    <span className="text-accent/70">{spec.label}</span>
                    <span className="text-accent">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-content ${activeTab === 'reviews' ? 'active' : ''}`}>
          {reviewsLoading ? (
            <div className="text-center py-8 text-accent">{t("Đang tải đánh giá...")}</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-accent/70">
              {t("Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên!")}
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          )}
          <div className="mt-12">
            <form onSubmit={handleSubmitComment} className="bg-secondary/50 rounded-lg p-6 border border-primary/20">
              <h3 className="text-lg font-semibold mb-4 font-orbitron text-white">Viết đánh giá của bạn</h3>
              <div className="mb-8">
                <label className="block text-sm font-medium text-accent/70 mb-4 font-open-sans text-center">
                  Đánh giá sản phẩm <span className="text-accent/50">(tùy chọn)</span>
                </label>
                <InteractiveStarRating
                  selectedRating={selectedRating}
                  hoveredRating={hoveredRating}
                  onHover={setHoveredRating}
                  onSelect={setSelectedRating}
                  onLeave={() => setHoveredRating(0)}
                />
                {selectedRating > 0 ? (
                  <p className="mt-6 text-center text-3xl font-bold text-red-500 animate-pulse">
                    {selectedRating} sao
                  </p>
                ) : (
                  <p className="mt-4 text-center text-gray-500 text-sm">
                    Nhấp vào sao để đánh giá
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tên của bạn</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    maxLength={50}
                    disabled={isLoggedInWithFullname}
                    className={`flex-1 px-3 py-2 rounded-md bg-secondary text-accent border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary font-open-sans ${isLoggedInWithFullname ? 'opacity-70 cursor-not-allowed' : ''}`}
                    placeholder="Nhập tên của bạn"
                    required
                  />
                  {!isLoggedInWithFullname && (
                    <button
                      type="button"
                      onClick={generateRandomName}
                      className="px-4 py-2 bg-primary/80 hover:bg-primary text-white rounded-md font-semibold transition flex items-center gap-2 whitespace-nowrap"
                    >
                      <i data-feather="shuffle" className="h-5 w-5"></i>
                      Tạo tên ngẫu nhiên
                    </button>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Bình luận</label>
                <textarea
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={1000}
                  className="w-full px-3 py-2 rounded-md bg-secondary text-accent border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  placeholder="Chia sẻ suy nghĩ của bạn về sản phẩm..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 disabled:opacity-70 text-white px-6 py-2 rounded-md font-semibold transition font-orbitron"
              >
                {submitting ? t("Đang gửi...") : t("Gửi đánh giá")}
              </button>
            </form>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl max-[767px]:text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-4 font-orbitron text-accent">{t("Sản Phẩm Liên Quan")}</h2>
          <p className="text-accent/70 max-w-2xl mx-auto font-open-sans max-[499px]:text-sm">
            {t("Hoàn thiện bộ thiết bị chơi game của bạn với các phụ kiện thiết yếu này")}
          </p>
        </div>
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-[499px]:gap-6 max-[374px]:gap-4">
            {relatedProducts.map((relProduct: any, index) => {
              const relDisplayName = i18n.language === 'en'
                ? (translatedRelatedNames[relProduct.product_id] || relProduct.product_name)
                : relProduct.product_name;
              const maxBuying = Math.max(...relatedProducts.map(p => p.product_buying || 0));
              const isBestSeller = (relProduct.product_buying || 0) === maxBuying && maxBuying > 0;
              const inWishlistRel = isInWishlist(relProduct.product_id);
              const goToDetail = () => {
                window.location.href = `/product-detail/${relProduct.product_id}`;
              };
              return (
                <Link
                  key={relProduct.product_id}
                  to={`/product-detail/${relProduct.product_id}`}
                  className="product-card bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 flex flex-col block hover:shadow-xl transition-shadow"
                  data-aos="fade-up"
                  data-aos-delay={(index + 1) * 100}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button')) {
                      e.preventDefault();
                    } else {
                      goToDetail();
                    }
                  }}
                >
                  <div className="h-64 max-[767px]:h-56 max-[499px]:h-48 max-[374px]:h-40 bg-gray-800 relative flex-shrink-0">
                    <img
                      src={`/public/${relProduct.product_image}`}
                      alt={relDisplayName}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = '/public/img/fanT1.jpg')}
                    />
                    {isBestSeller && (
                      <span className="absolute top-4 left-4 bg-primary text-white text-xs px-2 py-1 rounded font-open-sans">
                        {t("BÁN CHẠY NHẤT")}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={relProduct.product_rating || 0} />
                        <span className="text-sm text-red-500 font-semibold">
                          ({relProduct.product_rating || 0})
                        </span>
                      </div>
                      <h3 className="font-semibold text-white -ml-4 pl-4 mb-2 font-open-sans line-clamp-2">
                        {relDisplayName}
                      </h3>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-primary font-bold font-open-sans whitespace-nowrap">
                        {t("Từ")}{' '}
                        {new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                          style: 'currency',
                          currency: i18n.language === 'vi' ? 'VND' : 'USD',
                          minimumFractionDigits: 0
                        }).format(
                          i18n.language === 'vi'
                            ? relProduct.product_price
                            : relProduct.product_price / 24000
                        )}
                      </span>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({
                              id: relProduct.product_id,
                              name: relProduct.product_name,
                              price: relProduct.product_price,
                              image: `/public/${relProduct.product_image}`,
                              cate_id: relProduct.cate_id,
                            });
                            success?.(t("Đã thêm vào giỏ!"), relDisplayName);
                          }}
                          className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded text-sm transition font-orbitron"
                        >
                          <i data-feather="shopping-cart" className="h-4 w-4"></i>
                        </button>
                        <Link
                          to={`/product-detail/${relProduct.product_id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            goToDetail();
                          }}
                          className="bg-accent/10 hover:bg-accent/20 text-primary px-3 py-1 rounded text-sm transition font-orbitron"
                        >
                          <i data-feather="eye" className="h-4 w-4"></i>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const item = {
                              id: relProduct.product_id,
                              name: relProduct.product_name,
                              price: relProduct.product_price,
                              image: `/public/${relProduct.product_image}`,
                              description: relProduct.product_name,
                              cate_id: relProduct.cate_id,
                            };
                            if (inWishlistRel) {
                              removeFromWishlist(relProduct.product_id);
                              wishlistRemove?.(t("Đã xóa"), relDisplayName);
                            } else {
                              addToWishlist(item);
                              wishlistAdd?.(t("Đã thêm yêu thích"), relDisplayName);
                            }
                          }}
                          className={`px-3 py-1 rounded text-sm transition-all duration-300 font-orbitron flex items-center justify-center ${inWishlistRel
                            ? 'bg-red-600/20 text-red-600'
                            : 'bg-accent/10 hover:bg-red-600/20 text-primary hover:text-red-600'
                            }`}
                        >
                          <i
                            data-feather="heart"
                            className={`h-4 w-4 transition-all duration-300 ${inWishlistRel ? 'fill-red-600 text-red-600 animate-heartbeat' : ''
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default ProductDetail;