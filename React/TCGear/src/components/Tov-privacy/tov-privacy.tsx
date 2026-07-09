// tov-privacy.tsx
import React from 'react';
import './tov-privacy.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TovPrivacy: React.FC = () => {
  React.useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
            srcSet="
              https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80 800w,
              https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80 1770w
            "
            sizes="(max-width: 800px) 800px, 1770px"
            alt="Hình nền thiết bị chơi game"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 hero-gradient"></div>

        <div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          data-aos="fade-up"
        >
          <h1 className="text-white text-4xl md:text-6xl max-[499px]:text-3xl max-[374px]:text-2xl font-bold mb-6 font-orbitron">
            ĐIỀU KHOẢN & BẢO MẬT
          </h1>
          <p className="text-white text-xl max-[499px]:text-base mb-8 font-open-sans">
            Cam kết của chúng tôi đối với quyền riêng tư của bạn và các điều khoản quản lý việc sử dụng dịch vụ của chúng tôi
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="policy-container">
          {/* Introduction */}
          <div className="policy-section" data-aos="fade-up">
            <p className="policy-text max-[499px]:text-sm">
              Chào mừng bạn đến với TCGear. Điều khoản sử dụng và Chính sách bảo mật này quản lý việc bạn sử dụng trang web và dịch vụ của chúng tôi. Bằng cách truy cập hoặc sử dụng dịch vụ của chúng tôi, bạn đồng ý bị ràng buộc bởi các điều khoản này và các hoạt động bảo mật của chúng tôi.
            </p>
          </div>

          {/* Terms of Use */}
          <div className="policy-section" data-aos="fade-up">
            <h2 className="policy-title max-[499px]:text-xl">ĐIỀU KHOẢN SỬ DỤNG</h2>

            <h3 className="policy-subtitle max-[499px]:text-lg">1. Chấp nhận Điều khoản</h3>
            <p className="policy-text max-[499px]:text-sm">
              Bằng cách truy cập hoặc sử dụng trang web TCGear, bạn đồng ý bị ràng buộc bởi các Điều khoản sử dụng này, tất cả các luật và quy định hiện hành, và đồng ý rằng bạn chịu trách nhiệm tuân thủ mọi luật địa phương áp dụng.
            </p>

            <h3 className="policy-subtitle max-[499px]:text-lg">2. Giấy phép sử dụng</h3>
            <p className="policy-text max-[499px]:text-sm">
              Được phép tải xuống tạm thời một bản sao của các tài liệu (thông tin hoặc phần mềm) trên trang web của TCGear chỉ để xem tạm thời, không nhằm mục đích thương mại.
            </p>
            <p className="policy-text max-[499px]:text-sm">
              Đây là việc cấp phép, không phải chuyển giao quyền sở hữu, và theo giấy phép này, bạn không được:
            </p>
            <ul className="policy-list max-[499px]:text-sm">
              <li>Sửa đổi hoặc sao chép các tài liệu</li>
              <li>
                Sử dụng các tài liệu cho bất kỳ mục đích thương mại nào, hoặc để hiển thị công khai (thương mại hoặc phi thương mại)
              </li>
              <li>
                Cố gắng dịch ngược hoặc giải mã bất kỳ phần mềm nào có trên trang web của TCGear
              </li>
              <li>Xóa bất kỳ bản quyền hoặc ký hiệu sở hữu nào khỏi các tài liệu</li>
              <li>
                Chuyển giao tài liệu cho người khác hoặc "sao chép" tài liệu trên bất kỳ máy chủ nào khác
              </li>
            </ul>

            <h3 className="policy-subtitle max-[499px]:text-lg">3. Tài khoản người dùng</h3>
            <p className="policy-text max-[499px]:text-sm">
              Khi tạo tài khoản với chúng tôi, bạn phải cung cấp thông tin chính xác. Bạn chịu trách nhiệm duy trì tính bảo mật của tài khoản và mật khẩu của mình, cũng như hạn chế quyền truy cập vào máy tính hoặc thiết bị của bạn.
            </p>

            <h3 className="policy-subtitle max-[499px]:text-lg">4. Mua hàng và Thanh toán</h3>
            <p className="policy-text max-[499px]:text-sm">
              Tất cả các giao dịch mua qua trang web của chúng tôi phụ thuộc vào tình trạng sẵn có của sản phẩm. Chúng tôi có quyền ngừng cung cấp bất kỳ sản phẩm nào vào bất kỳ thời điểm nào vì bất kỳ lý do gì. Giá sản phẩm có thể thay đổi mà không cần thông báo trước.
            </p>

            <h3 className="policy-subtitle max-[499px]:text-lg">5. Sở hữu trí tuệ</h3>
            <p className="policy-text max-[499px]:text-sm">
              Các tài liệu trên trang web của TCGear được bảo vệ bởi luật bản quyền và nhãn hiệu hiện hành. Tất cả các nhãn hiệu, nhãn hiệu dịch vụ, tên thương mại, logo và các yếu tố thương hiệu khác là tài sản của TCGear hoặc của chủ sở hữu tương ứng.
            </p>
          </div>

          {/* Privacy Policy */}
          <div className="policy-section" data-aos="fade-up">
            <h2 className="policy-title max-[499px]:text-xl">CHÍNH SÁCH BẢO MẬT</h2>

            <h3 className="policy-subtitle max-[499px]:text-lg">1. Thông tin chúng tôi thu thập</h3>
            <p className="policy-text max-[499px]:text-sm">
              Chúng tôi thu thập thông tin mà bạn cung cấp trực tiếp cho chúng tôi, chẳng hạn như khi bạn tạo tài khoản, thực hiện mua hàng hoặc liên lạc với chúng tôi. Điều này có thể bao gồm:
            </p>
            <ul className="policy-list max-[499px]:text-sm">
              <li>Thông tin nhận dạng cá nhân (Tên, địa chỉ email, số điện thoại, v.v.)</li>
              <li>Địa chỉ thanh toán và giao hàng</li>
              <li>
                Thông tin thanh toán (chi tiết thẻ tín dụng được xử lý bởi bộ xử lý thanh toán của chúng tôi và không được chúng tôi lưu trữ)
              </li>
              <li>Lịch sử mua hàng và sở thích</li>
            </ul>

            <h3 className="policy-subtitle max-[499px]:text-lg">2. Cách chúng tôi sử dụng thông tin của bạn</h3>
            <p className="policy-text max-[499px]:text-sm">
              Chúng tôi sử dụng thông tin thu thập được cho nhiều mục đích khác nhau, bao gồm để:
            </p>
            <ul className="policy-list max-[499px]:text-sm">
              <li>Cung cấp, duy trì và cải thiện dịch vụ của chúng tôi</li>
              <li>Xử lý các giao dịch và gửi thông tin liên quan</li>
              <li>Phản hồi các bình luận, câu hỏi và yêu cầu của bạn</li>
              <li>Gửi thông báo kỹ thuật, cập nhật, cảnh báo bảo mật</li>
              <li>
                Liên lạc với bạn về các sản phẩm, dịch vụ, ưu đãi và sự kiện
              </li>
              <li>Giám sát và phân tích xu hướng, việc sử dụng và các hoạt động</li>
            </ul>

            <h3 className="policy-subtitle max-[499px]:text-lg">3. Chia sẻ thông tin</h3>
            <p className="policy-text max-[499px]:text-sm">
              Chúng tôi có thể chia sẻ thông tin về bạn như sau:
            </p>
            <ul className="policy-list max-[499px]:text-sm">
              <li>
                Với các nhà cung cấp, tư vấn viên và nhà cung cấp dịch vụ khác cần truy cập thông tin đó để thực hiện công việc thay mặt chúng tôi
              </li>
              <li>
                Để đáp ứng yêu cầu cung cấp thông tin nếu chúng tôi tin rằng việc tiết lộ phù hợp với bất kỳ luật, quy định hoặc quy trình pháp lý hiện hành nào
              </li>
              <li>
                Nếu chúng tôi tin rằng hành động của bạn không phù hợp với các thỏa thuận hoặc chính sách người dùng của chúng tôi, hoặc để bảo vệ quyền, tài sản và an toàn của TCGear hoặc những người khác
              </li>
              <li>
                Liên quan đến hoặc trong quá trình đàm phán về bất kỳ vụ sáp nhập, bán tài sản công ty, tài trợ hoặc mua lại toàn bộ hoặc một phần doanh nghiệp của chúng tôi bởi một công ty khác
              </li>
            </ul>

            <h3 className="policy-subtitle max-[499px]:text-lg">4. Bảo mật</h3>
            <p className="policy-text max-[499px]:text-sm">
              Chúng tôi thực hiện các biện pháp hợp lý để bảo vệ thông tin của bạn khỏi mất mát, trộm cắp, sử dụng sai mục đích và truy cập, tiết lộ, thay đổi và phá hủy trái phép. Tuy nhiên, không có phương thức truyền tải qua Internet hoặc phương thức lưu trữ điện tử nào an toàn 100%.
            </p>

            <h3 className="policy-subtitle max-[499px]:text-lg">5. Lựa chọn của bạn</h3>
            <p className="policy-text max-[499px]:text-sm">
              Bạn có thể cập nhật thông tin tài khoản và sở thích của mình bất kỳ lúc nào bằng cách đăng nhập vào tài khoản của bạn. Bạn cũng có thể hủy đăng ký nhận email quảng cáo bằng cách làm theo hướng dẫn trong các email đó.
            </p>

            <h3 className="policy-subtitle max-[499px]:text-lg">6. Cookie và Công nghệ theo dõi</h3>
            <p className="policy-text max-[499px]:text-sm">
              Chúng tôi sử dụng cookie và các công nghệ theo dõi tương tự để theo dõi hoạt động trên trang web của chúng tôi và lưu giữ một số thông tin nhằm cải thiện và phân tích dịch vụ của chúng tôi. Bạn có thể yêu cầu trình duyệt của mình từ chối tất cả cookie hoặc thông báo khi cookie được gửi.
            </p>
          </div>

          {/* Changes to Terms */}
          <div className="policy-section" data-aos="fade-up">
            <h2 className="policy-title max-[499px]:text-xl">THAY ĐỔI ĐIỀU KHOẢN</h2>
            <p className="policy-text max-[499px]:text-sm">
              Chúng tôi có thể cập nhật Điều khoản sử dụng và Chính sách bảo mật của mình theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng chính sách mới trên trang này và cập nhật "ngày hiệu lực" ở cuối các điều khoản này.
            </p>
            <p className="policy-text max-[499px]:text-sm">
              Bạn nên xem lại các điều khoản này định kỳ để biết bất kỳ thay đổi nào. Các thay đổi đối với các điều khoản này có hiệu lực khi chúng được đăng trên trang này.
            </p>
          </div>

          {/* Contact Information */}
          <div className="policy-section" data-aos="fade-up">
            <h2 className="policy-title max-[499px]:text-xl">LIÊN HỆ CHÚNG TÔI</h2>
            <p className="policy-text max-[499px]:text-sm">
              Nếu bạn có bất kỳ câu hỏi nào về Điều khoản sử dụng hoặc Chính sách bảo mật của chúng tôi, vui lòng liên hệ với chúng tôi tại:
            </p>
            <p className="policy-text max-[499px]:text-sm">
              Email: privacy@tcgear.com<br />
              Địa chỉ: 123 Đường Chơi Game, Thành phố Esports
            </p>
            <p className="policy-text max-[499px]:text-sm">Cập nhật lần cuối: Tháng 6 năm 2025</p>
          </div>
        </div>
      </section>


      {/* Back to Top Button */}
      <div className="back-to-top" id="backToTop">
        <i data-feather="arrow-up"></i>
      </div>
    </>
  );
};

export default TovPrivacy;