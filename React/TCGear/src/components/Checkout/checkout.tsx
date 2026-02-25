// checkout.tsx
import React, { useEffect } from 'react';
import './checkout.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import feather from 'feather-icons';

const Checkout: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  const subtotal = 259.97;
  const shippingFee = 5.99;
  const tax = 21.83;
  const total = subtotal + shippingFee + tax;

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-accent">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 font-orbitron" data-aos="fade-up">
            Thông Tin Giao Hàng
          </h2>
          
          <form id="shipping-form" className="space-y-6" data-aos="fade-up" data-aos-delay="100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium mb-1 font-open-sans">
                  Tên
                </label>
                <input type="text" id="first-name" className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans" required />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium mb-1 font-open-sans">
                  Họ
                </label>
                <input type="text" id="last-name" className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans" required />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 font-open-sans">
                Địa Chỉ Email
              </label>
              <input type="email" id="email" className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans" required />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1 font-open-sans">
                Số Điện Thoại
              </label>
              <input type="tel" id="phone" className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans" required />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1 font-open-sans">
                Địa Chỉ
              </label>
              <input type="text" id="address" className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans" required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-1 font-open-sans">
                  Quốc Gia
                </label>
                <select id="country" className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans" required>
                  <option value="">Chọn Quốc Gia</option>
                  <option value="US">Hoa Kỳ</option>
                  <option value="CA">Canada</option>
                  <option value="UK">Vương Quốc Anh</option>
                  <option value="KR">Hàn Quốc</option>
                  <option value="JP">Nhật Bản</option>
                  <option value="EU">Liên Minh Châu Âu</option>
                </select>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1 font-open-sans">
                  Thành Phố
                </label>
                <input type="text" id="city" className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans" required />
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium mb-1 font-open-sans">
                  Mã Bưu Điện
                </label>
                <input type="text" id="zip" className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans" required />
              </div>
            </div>
            
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-4 font-orbitron">Phương Thức Giao Hàng</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="radio" name="shipping" value="standard" className="h-4 w-4 text-primary focus:ring-primary" defaultChecked />
                  <span className="flex-1 font-open-sans">
                    <span className="block">Giao Hàng Tiêu Chuẩn</span>
                    <span className="block text-sm text-accent/70">3-5 ngày làm việc - $5.99</span>
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="radio" name="shipping" value="express" className="h-4 w-4 text-primary focus:ring-primary" />
                  <span className="flex-1 font-open-sans">
                    <span className="block">Giao Hàng Nhanh</span>
                    <span className="block text-sm text-accent/70">1-2 ngày làm việc - $12.99</span>
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="radio" name="shipping" value="overnight" className="h-4 w-4 text-primary focus:ring-primary" />
                  <span className="flex-1 font-open-sans">
                    <span className="block">Giao Hàng Qua Đêm</span>
                    <span className="block text-sm text-accent/70">Ngày làm việc tiếp theo - $24.99</span>
                  </span>
                </label>
              </div>
            </div>
            
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-4 font-orbitron">Phương Thức Thanh Toán</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="payment-method p-4 rounded-md cursor-pointer selected">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="credit" className="h-4 w-4 text-primary focus:ring-primary" defaultChecked />
                    <i data-feather="credit-card" className="h-5 w-5"></i>
                    <span className="font-open-sans">Thẻ Tín Dụng</span>
                  </div>
                </div>
                <div className="payment-method p-4 rounded-md cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="paypal" className="h-4 w-4 text-primary focus:ring-primary" />
                    <i data-feather="dollar-sign" className="h-5 w-5"></i>
                    <span className="font-open-sans">PayPal</span>
                  </div>
                </div>
                <div className="payment-method p-4 rounded-md cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="crypto" className="h-4 w-4 text-primary focus:ring-primary" />
                    <i data-feather="bitcoin" className="h-5 w-5"></i>
                    <span className="font-open-sans">Tiền Điện Tử</span>
                  </div>
                </div>
                <div className="payment-method p-4 rounded-md cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="bank" className="h-4 w-4 text-primary focus:ring-primary" />
                    <i data-feather="bank" className="h-5 w-5"></i>
                    <span className="font-open-sans">Chuyển Khoản Ngân Hàng</span>
                  </div>
                </div>
              </div>
            </div>
            

            
            <div className="flex justify-end pt-6">
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-semibold transition flex items-center font-orbitron">
                Tiếp Tục Thanh Toán
                <i data-feather="arrow-right" className="ml-2 h-5 w-5"></i>
              </button>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-secondary/50 border border-primary/20 rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-6 font-orbitron">Tóm Tắt Đơn Hàng</h2>
            
            <div className="space-y-4 mb-6">
              {/* Cart Item 1 */}
              <div className="cart-item flex items-start space-x-4 pb-4 border-b border-primary/10">
                <img 
                  src="https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Tai Nghe Chơi Game Pro" 
                  className="w-16 h-16 object-cover rounded-md" 
                  loading="lazy"
                />
                <div className="flex-1">
                  <h3 className="font-medium font-open-sans">Tai Nghe Chơi Game Pro</h3>
                  <p className="text-sm text-accent/70 font-open-sans">Đen/Đỏ</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-primary font-bold font-open-sans">$129.99</span>
                    <span className="text-sm font-open-sans">Số lượng: 1</span>
                  </div>
                </div>
              </div>
              
              {/* Cart Item 2 */}
              <div className="cart-item flex items-start space-x-4 pb-4 border-b border-primary/10">
                <img 
                  src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Áo Đấu Đội T1" 
                  className="w-16 h-16 object-cover rounded-md" 
                  loading="lazy"
                />
                <div className="flex-1">
                  <h3 className="font-medium font-open-sans">Áo Đấu Đội T1</h3>
                  <p className="text-sm text-accent/70 font-open-sans">Kích thước: L</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-primary font-bold font-open-sans">$64.99</span>
                    <span className="text-sm font-open-sans">Số lượng: 2</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="voucher-section mb-6">
              <h3 className="text-lg font-semibold mb-4 font-orbitron">Mã Voucher</h3>
              <div className="flex items-center space-x-3">
                <input 
                  type="text" 
                  id="voucher-code" 
                  placeholder="Nhập mã voucher" 
                  className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans"
                />
                <button 
                  id="apply-voucher" 
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-md font-semibold transition font-orbitron whitespace-nowrap"
                >
                  Áp dụng
                </button>
              </div>
              <p className="text-center text-accent/70 my-4 font-open-sans">hoặc</p>
              <div className="flex justify-center">
                <a href="vouchers.html" className="bg-secondary border border-primary/20 hover:bg-primary/90 hover:text-white px-6 py-3 rounded-md font-semibold transition font-orbitron">
                  Chọn voucher ở đây
                </a>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between font-open-sans">
                <span>Tổng phụ</span>
                <span id="subtotal">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-open-sans">
                <span>Phí giao hàng</span>
                <span id="shipping-fee">${shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-open-sans">
                <span>Thuế</span>
                <span id="tax">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-primary/10 font-open-sans">
                <span>Tổng cộng</span>
                <span id="total" className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="text-sm text-accent/70 font-open-sans">
              <p>
                Cần trợ giúp? <a href="contact" className="text-primary hover:underline">Liên hệ hỗ trợ của chúng tôi</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;