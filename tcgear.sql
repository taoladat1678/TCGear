-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 10, 2026 lúc 03:43 PM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `tcgear`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `blogs`
--

CREATE TABLE `blogs` (
  `blog_id` varchar(20) NOT NULL,
  `blog_title` varchar(255) NOT NULL,
  `blog_cate_id` varchar(20) NOT NULL,
  `create_at` datetime NOT NULL,
  `update_at` datetime NOT NULL,
  `blog_content` longtext NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `blog_img` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `blogs`
--

INSERT INTO `blogs` (`blog_id`, `blog_title`, `blog_cate_id`, `create_at`, `update_at`, `blog_content`, `user_id`, `blog_img`) VALUES
('TCG-BLG-001', 'Top 5 chuột gaming tốt nhất 2025', 'TCG-BGC-001', '2025-10-01 15:00:00', '2025-10-01 15:00:00', 'Nội dung chi tiết về top chuột gaming: Razer, Logitech...', 'TCG-USR-001', 'img/blog_top_mouse.jpg'),
('TCG-BLG-002', 'Hướng dẫn chọn áo thi đấu phù hợp', 'TCG-BGC-004', '2025-10-02 15:00:00', '2025-10-02 15:00:00', 'Hướng dẫn chọn size, chất liệu áo jerseys cho game thủ.', 'TCG-USR-002', 'img/blog_jersey_guide.jpg'),
('TCG-BLG-003', 'Cập nhật đội tuyển T1 LoL 2025', 'TCG-BGC-003', '2025-10-03 15:00:00', '2025-10-03 15:00:00', 'Tin mới về thành tích và roster T1 League of Legends 2025.', 'TCG-USR-003', 'img/blog_t1_lol.jpg'),
('TCG-BLG-004', 'Review bàn phím cơ giá rẻ', 'TCG-BGC-002', '2025-10-04 15:00:00', '2025-10-04 15:00:00', 'Review chi tiết bàn phím Logitech G Pro.', 'TCG-USR-004', 'img/blog_keyboard_review.jpg'),
('TCG-BLG-005', 'Mẹo chơi PUBG Mobile hay', 'TCG-BGC-005', '2025-10-05 15:00:00', '2025-10-05 15:00:00', 'Các mẹo hay để lên rank nhanh trong PUBG.', 'TCG-USR-005', 'img/blog_pubg_tips.jpg'),
('TCG-BLG-006', 'Hành trình vô địch CKTG của T1 - Liên Minh Huyền Thoại ', 'TCG-BGC-003', '2025-12-24 10:15:18', '2025-12-24 10:15:18', 'Hành trình vô địch của T1 tại Chung kết Thế giới Liên Minh Huyền Thoại (CKTG) 2025 là một câu chuyện đầy cảm xúc, khắc họa rõ nét bản lĩnh, tài năng và tinh thần bất khuất của đội tuyển huyền thoại này. Dưới sự dẫn dắt của \"Quỷ Vương\" Faker và các đồng đội, T1 đã làm nên lịch sử khi trở thành đội tuyển đầu tiên giành ba chức vô địch CKTG liên tiếp (2023, 2024, 2025), nâng tổng số danh hiệu thế giới lên con số kỷ lục 6 lần (2013, 2015, 2016, 2023, 2024, 2025). Dưới đây là tóm tắt chi tiết về hành trình đầy thử thách của họ tại CKTG 2025, dựa trên các thông tin từ các nguồn đáng tin cậy.\r\n\r\nBối cảnh và đội hình T1 năm 2025\r\nT1 bước vào CKTG 2025 với tư cách là hạt giống số 4 của khu vực LCK (Hàn Quốc), sau một năm không giành được danh hiệu quốc nội, điều khiến họ bị đánh giá thấp hơn so với các đối thủ như Gen.G hay KT Rolster. Đội hình T1 có sự thay đổi quan trọng khi tuyển thủ đường trên Zeus rời đội để gia nhập Hanwha Life Esports, và Choi \"Doran\" Hyeon-joon được chiêu mộ để thay thế. Đội hình chính thức của T1 tại CKTG 2025 bao gồm:\r\n\r\nĐường trên: Choi \"Doran\" Hyeon-joon\r\nĐi rừng: Moon \"Oner\" Hyeon-joon\r\nĐường giữa: Lee \"Faker\" Sang-hyeok\r\nXạ thủ: Lee \"Gumayusi\" Min-hyeong\r\nHỗ trợ: Ryu \"Keria\" Min-seok\r\nHuấn luyện viên: Im \"Tom\" Jae-hyeon và Cho \"Mata\" Se-hyeong\r\n\r\nDù sở hữu dàn tuyển thủ tài năng, T1 phải đối mặt với nhiều nghi ngờ vì phong độ không ổn định trong mùa giải quốc nội và việc phải bắt đầu từ vòng Play-in, một vị trí thường dành cho các đội yếu hơn.\r\nHành trình tại CKTG 2025\r\nCKTG 2025 được tổ chức tại Trung Quốc từ ngày 14/10 đến 9/11, với trận chung kết diễn ra tại Nhà thi đấu Công viên thể thao hồ Đông An, Thành Đô. Giải đấu quy tụ 17 đội tuyển từ các khu vực lớn, và T1 phải trải qua một hành trình dài, đối mặt với nhiều thử thách để chạm tay vào chiếc cúp Summoner\'s Cup.\r\nVòng Play-in: Khởi đầu gian nan\r\nLà hạt giống số 4 LCK, T1 buộc phải thi đấu từ vòng Play-in, nơi họ đối đầu với Invictus Gaming (IG) của khu vực LPL (Trung Quốc). T1 đã giành chiến thắng 3-1 trong loạt Bo5, nhưng màn trình diễn của họ không thực sự thuyết phục, khiến nhiều người hâm mộ lo lắng về khả năng tiến xa của đội. Tuy nhiên, chiến thắng này giúp T1 giành vé vào vòng Swiss, nơi các thử thách thực sự bắt đầu.\r\nVòng Swiss: Vấp ngã nhưng đứng dậy\r\nTại vòng Swiss, T1 đối mặt với một lịch thi đấu khắc nghiệt và phải chạm trán với nhiều đối thủ mạnh. Họ khởi đầu không suôn sẻ khi để thua trước CTBC Flying Oyster (LCP) và Gen.G Esports (LCK), đội hạt giống số 1 của Hàn Quốc. Những thất bại này đặt T1 vào tình thế nguy hiểm, nhưng đội đã thể hiện bản lĩnh của nhà vô địch bằng cách giành chiến thắng quyết định trước 100 Thieves (LTA) và Movistar KOI (LEC) để giành quyền vào vòng loại trực tiếp. Khả năng điều chỉnh chiến thuật và tinh thần thép của Faker cùng đồng đội đã giúp T1 vượt qua giai đoạn này, dù không phải là đội được đánh giá cao nhất.\r\nVòng loại trực tiếp: Khẳng định đẳng cấp\r\n\r\nTứ kết: T1 vs. Anyone\'s Legend (LPL)\r\nT1 đối đầu với Anyone\'s Legend, một đội tuyển mạnh của khu vực Trung Quốc, trong một loạt Bo5 kéo dài 5 ván đầy căng thẳng. Sự điềm tĩnh và kinh nghiệm của Faker, cùng với những pha xử lý xuất sắc của Gumayusi và Keria, đã giúp T1 lội ngược dòng để giành chiến thắng 3-2, tiến vào bán kết.\r\nBán kết: T1 vs. Top Esports (LPL)\r\nỞ bán kết, T1 chạm trán Top Esports, một đối thủ đáng gờm khác từ LPL. Tuy nhiên, lần này T1 thể hiện sự áp đảo tuyệt đối với chiến thắng 3-0. Oner và Keria kiểm soát hoàn toàn nhịp độ trận đấu, trong khi Faker và Gumayusi liên tục tạo ra những điểm nhấn quan trọng. Chiến thắng này đưa T1 vào trận chung kết, đối đầu với kình địch truyền kiếp KT Rolster trong \"Đại chiến viễn thông\".\r\n\r\nChung kết: T1 vs. KT Rolster\r\nTrận chung kết CKTG 2025 diễn ra vào ngày 9/11/2025 tại Thành Đô, được mệnh danh là \"Trận Siêu Kinh Điển của LMHT Hàn Quốc\" khi T1 đối đầu với KT Rolster, đội tuyển cũng thuộc khu vực LCK. KT Rolster, với sự dẫn dắt của đường giữa Gwak \"Bdd\" Bo-seong, đã có một hành trình ấn tượng khi đánh bại Gen.G ở bán kết để lần đầu tiên lọt vào chung kết CKTG kể từ năm 2018.\r\nLoạt Bo5 giữa T1 và KT là một trận đấu kịch tính, kéo dài đến ván thứ 5, đúng như kỳ vọng của người hâm mộ. Dưới đây là diễn biến chính của trận chung kết:\r\n\r\nVán 1: T1 khởi đầu mạnh mẽ, lật ngược thế cờ nhờ pha giao tranh xuất sắc tại khu vực Rồng, giành chiến thắng thuyết phục.\r\nVán 2 và 3: KT Rolster phản công mạnh mẽ, đặc biệt ở ván 3 khi Bdd thực hiện một pha \"câu Baron\" hoàn hảo, quét sạch đội hình T1 và vươn lên dẫn trước 2-1. Lối chơi đa dạng và tinh thần chiến đấu của KT khiến T1 rơi vào thế khó.\r\nVán 4: Ở thế chân tường, T1 đặt niềm tin vào Gumayusi với một đội hình tập trung vào xạ thủ. Gumayusi không làm người hâm mộ thất vọng khi có màn trình diễn chói sáng, giúp T1 gỡ hòa 2-2 với pha Bão Đạn quét sạch đội hình KT.\r\nVán 5: Ván đấu quyết định chứng kiến T1 bộc lộ bản lĩnh của nhà vô địch. Họ kiểm soát hoàn toàn bản đồ, giành các mục tiêu lớn và kết thúc trận đấu sau 37 phút với chiến thắng thuyết phục. Gumayusi tiếp tục là nhân tố chủ chốt với những pha xử lý chính xác, trong khi Faker và Keria giữ vững vai trò dẫn dắt chiến thuật.\r\n\r\nT1 giành chiến thắng chung cuộc 3-2, chính thức đăng quang CKTG 2025, hoàn tất cú \"three-peat\" lịch sử (ba chức vô địch liên tiếp) và nâng cao chiếc cúp Summoner\'s Cup lần thứ 6 trong lịch sử đội tuyển.\r\nNhững điểm nhấn và kỷ lục\r\n\r\nKỷ lục của T1: T1 trở thành đội tuyển đầu tiên trong lịch sử LMHT giành ba chức vô địch CKTG liên tiếp (2023, 2024, 2025), một thành tích được ví như kỳ tích ba lần vô địch Champions League của Real Madrid. Tổng cộng, T1 có 6 danh hiệu CKTG (2013, 2015, 2016, 2023, 2024, 2025), vượt xa mọi đội tuyển khác.\r\nFaker – Huyền thoại bất tử: Ở tuổi 29, Lee \"Faker\" Sang-hyeok tiếp tục củng cố vị thế \"GOAT\" (Greatest of All Time) của LMHT với chiếc cúp CKTG thứ 6, cùng 11 danh hiệu LCK và 2 MSI. Hình ảnh Faker nâng cúp giữa hàng vạn khán giả tại Thành Đô đã trở thành biểu tượng của sự bền bỉ và tài năng.\r\nGumayusi – MVP trận chung kết: Lee \"Gumayusi\" Min-hyeong được vinh danh là MVP của trận chung kết nhờ màn trình diễn xuất sắc ở ván 4 và 5. Đây là lần đầu tiên một xạ thủ của T1 nhận danh hiệu này, và Gumayusi được công nhận là một trong những xạ thủ hàng đầu thế giới.\r\nDoran – Tân binh tỏa sáng: Là thành viên mới của T1, Doran đã hòa nhập nhanh chóng và đóng vai trò quan trọng trong hành trình vô địch, đặc biệt ở các trận đấu loại trực tiếp. Đây là danh hiệu CKTG đầu tiên trong sự nghiệp của anh.\r\nSức hút của trận chung kết: Mặc dù CKTG 2025 chứng kiến sự sụt giảm về lượng người xem toàn cầu (theo Esports Charts, lượng người xem cao nhất đạt 6,737,568, giảm 1,7% so với 2024), trận chung kết giữa T1 và KT vẫn tạo nên cơn sốt lớn, đặc biệt tại Hàn Quốc, nơi T1 được đích thân Tổng thống chúc mừng.\r\n\r\nÝ nghĩa của chức vô địch\r\nChiến thắng tại CKTG 2025 không chỉ là phần thưởng cho nỗ lực không ngừng nghỉ của T1 mà còn là minh chứng cho sức mạnh của khu vực LCK, khi đây là lần thứ 4 liên tiếp một đội LCK vô địch CKTG. T1 đã vượt qua những hoài nghi, từ vị thế \"cửa dưới\" để trở thành biểu tượng của sự kiên định và bản lĩnh. Đối với người hâm mộ, chức vô địch này là món quà vô giá, đặc biệt khi T1 công bố chuyến thăm Việt Nam vào cuối năm 2025 để tham dự sự kiện Fan Meeting \"The Promise Fulfilled\" tại Hà Nội (20–21/12/2025), đáp lại tình cảm của cộng đồng fan Việt.\r\nKết luận\r\nHành trình vô địch CKTG 2025 của T1 là một câu chuyện về sự vượt khó, đoàn kết và tài năng. Từ vòng Play-in đầy áp lực đến trận chung kết kịch tính trước KT Rolster, T1 đã chứng minh rằng họ không chỉ là một đội tuyển mạnh, mà là một \"di sản\" bất tử trong lịch sử Liên Minh Huyền Thoại. Với Faker dẫn đầu và sự tỏa sáng của các đồng đội, T1 đã viết nên một chương mới trong cuốn sách huyền thoại của mình, để lại dấu ấn không thể xóa nhòa trong lòng người hâm mộ toàn cầu.\r\n\r\nNguồn tham khảo: https://youtu.be/x7wLfcyUWrU?si=n2aY4Yl3hwxhyq4h', 'TCG-USR-006', 'img/blog_world_champions_journey.jpg'),
('TCG-BLG-007', 'Welcome , T1 Peyz', 'TCG-BGC-003', '2025-12-24 10:36:45', '2025-12-24 10:36:45', 'Peyz Gia Nhập T1: Hành Trình Mới Sau Cú Sốc Gumayusi Rời Đội\r\nNgày 19/11/2025, cộng đồng Liên Minh Huyền Thoại (LMHT) toàn cầu chấn động khi T1 chính thức công bố Kim \"Peyz\" Su-hwan trở thành xạ thủ mới của đội, thay thế huyền thoại Lee \"Gumayusi\" Min-hyeong. Thương vụ chuyển nhượng này không chỉ đánh dấu sự kết thúc của một kỷ nguyên với đội hình ZOFGK huyền thoại mà còn mở ra một chương mới đầy tham vọng cho T1. Hãy cùng nhìn lại bối cảnh, ý nghĩa và những kỳ vọng xoay quanh sự thay đổi lịch sử này.\r\nCú Sốc: Gumayusi Rời T1 Sau 7 Năm Gắn Bó\r\nLee \"Gumayusi\" Min-hyeong, cái tên đã trở thành biểu tượng của T1, rời đội vào ngày 17/11/2025, chỉ vài ngày sau khi giúp T1 hoàn thành cú \"three-peat\" lịch sử với chức vô địch Chung kết Thế giới (CKTG) 2025. Với danh hiệu MVP trận chung kết CKTG 2025 và vai trò chủ lực trong ba danh hiệu thế giới liên tiếp (2023, 2024, 2025), Gumayusi được xem là một trong những xạ thủ xuất sắc nhất mọi thời đại. Anh gia nhập T1 từ năm 2019, góp phần đưa đội tuyển từ những ngày khó khăn đến đỉnh cao vinh quang.\r\nTuy nhiên, năm 2025 là một hành trình đầy thử thách với Gumayusi. Anh từng bị thay thế tạm thời bởi tài năng trẻ Shin \"Smash\" Geum-jae và phải đối mặt với áp lực tâm lý nặng nề, thậm chí phải tham gia tư vấn để vượt qua khủng hoảng tự tin. Dù trở lại mạnh mẽ và tỏa sáng tại CKTG, các nguồn tin cho rằng T1 đã có kế hoạch chia tay Gumayusi từ trước, bất kể thành tích của anh. Quyết định này được cho là để làm mới đội hình, đồng thời tạo cơ hội cho Gumayusi theo đuổi mục tiêu cá nhân: trở thành xạ thủ số một thế giới, bước ra khỏi cái bóng của Faker và Keria.\r\nSau khi rời T1, Gumayusi nhanh chóng ký hợp đồng với Hanwha Life Esports (HLE), tái hợp với cựu đồng đội Zeus và sát cánh cùng siêu sao đi rừng Kanavi. Sự ra đi của anh không chỉ khiến người hâm mộ tiếc nuối mà còn làm dấy lên những tranh cãi về cách T1 đối xử với một công thần.\r\nPeyz: Ngôi Sao Trẻ Đầy Tiềm Năng\r\nĐể lấp chỗ trống của Gumayusi, T1 đã chiêu mộ Kim \"Peyz\" Su-hwan, một trong những xạ thủ tài năng nhất thế hệ mới. Ở tuổi 19, Peyz đã sở hữu một hồ sơ đáng nể:\r\n\r\nThời kỳ Gen.G (2023–2024): Ra mắt chuyên nghiệp năm 2023, Peyz thay thế huyền thoại Ruler và giúp Gen.G giành ba danh hiệu LCK (Spring 2023, Summer 2023, Spring 2024) cùng chức vô địch MSI 2024. Anh được vinh danh là Tân binh của năm LCK 2023, MVP trận chung kết LCK Spring 2023, và lập kỷ lục 28 mạng hạ gục trong một trận đấu tại MSI 2024.\r\nHành trình tại LPL (2025): Sau khi Gen.G đưa Ruler trở lại, Peyz gia nhập JD Gaming (LPL). Dù đội gặp nhiều khó khăn và không thể tham dự CKTG 2025, Peyz vẫn là điểm sáng lớn nhất với lối chơi hung hãn và kỹ năng cá nhân xuất sắc.\r\n\r\nHợp đồng của Peyz với T1 kéo dài đến năm 2028, cho thấy tham vọng dài hạn của đội trong việc xây dựng một triều đại mới. Sự kết hợp giữa Peyz và hỗ trợ Ryu \"Keria\" Min-seok, người được coi là hỗ trợ xuất sắc nhất thế giới, hứa hẹn sẽ tạo ra một cặp đôi đường dưới \"đáng sợ\" trong mùa giải 2026.\r\nTại Sao T1 Chọn Peyz?\r\nViệc chọn Peyz không chỉ là một quyết định chiến thuật mà còn là một bước đi chiến lược:\r\n\r\nPhong cách chơi bùng nổ: So với sự ổn định và khả năng tỏa sáng trong khoảnh khắc quyết định của Gumayusi, Peyz mang đến lối chơi hung hãn, chủ động hơn. Anh có khả năng \"carry\" trận đấu từ sớm, điều mà T1 kỳ vọng sẽ bổ sung thêm chiều sâu cho chiến thuật của đội.\r\nKinh nghiệm quốc tế: Dù còn trẻ, Peyz đã thi đấu tại cả LCK và LPL, đối đầu với những đội tuyển hàng đầu thế giới. Kinh nghiệm này giúp anh dễ dàng hòa nhập với áp lực thi đấu tại T1, nơi mỗi trận đấu đều mang tính sống còn.\r\nTương lai dài hạn: Với hợp đồng đến 2028, Peyz được xem là mảnh ghép hoàn hảo để T1 xây dựng đội hình cho thập kỷ tới, đặc biệt khi Lee \"Faker\" Sang-hyeok đã gia hạn hợp đồng đến 2029.\r\n\r\nPhản Ứng Cộng Đồng: Hào Hứng và Lo Lắng\r\nSự thay đổi này đã tạo ra một làn sóng tranh luận trong cộng đồng LMHT:\r\n\r\nSốc trước sự ra đi của Gumayusi: Bài đăng thông báo Gumayusi rời T1 đạt gần 2 triệu lượt xem trong vòng một giờ, phản ánh sự tiếc nuối của người hâm mộ. Nhiều người cho rằng Gumayusi xứng đáng được đối xử tốt hơn sau những đóng góp to lớn.\r\nKỳ vọng cho Peyz: Một số fan lạc quan về tiềm năng của Peyz, đặc biệt sau khi anh giúp T1 vô địch KeSPA Cup 2025, đánh bại HLE (đội có Gumayusi) với tỷ số 3-2. Tuy nhiên, không ít người lo ngại rằng Peyz sẽ khó lấp đầy khoảng trống của Gumayusi, đặc biệt khi phải đối mặt với áp lực từ di sản ba chức vô địch CKTG liên tiếp.\r\nSo sánh phong cách: Một số ý kiến cho rằng Peyz có thể phù hợp hơn với T1 nhờ khả năng phối hợp với Keria, trong khi Gumayusi bị đánh giá thấp vì luôn chơi cùng một hỗ trợ xuất sắc. Tuy nhiên, tại Red Bull Showmatch 2025, một câu hỏi so sánh Peyz với Gumayusi đã gây tranh cãi, khiến cộng đồng chia rẽ về việc liệu Peyz có thể vượt qua cái bóng của người tiền nhiệm.\r\n\r\nT1 2026: Đội Hình Mới, Tham Vọng Cũ\r\nVới sự gia nhập của Peyz, đội hình T1 cho mùa giải 2026 bao gồm:\r\n\r\nĐường trên: Choi \"Doran\" Hyeon-joon\r\nĐi rừng: Moon \"Oner\" Hyeon-joon\r\nĐường giữa: Lee \"Faker\" Sang-hyeok\r\nXạ thủ: Kim \"Peyz\" Su-hwan\r\nHỗ trợ: Ryu \"Keria\" Min-seok\r\nHuấn luyện viên: Bae \"Bengi\" Seong-woong và Mata\r\n\r\nĐội hình này kết hợp giữa kinh nghiệm của Faker, Oner, và Keria với sức trẻ của Doran và Peyz. Chiến thắng tại KeSPA Cup 2025 là dấu hiệu tích cực, nhưng thách thức thực sự sẽ đến tại LCK Spring 2026 và CKTG 2026, nơi T1 đặt mục tiêu giành chức vô địch thế giới thứ tư liên tiếp – một kỳ tích chưa từng có trong lịch sử LMHT.\r\n\r\n\r\nCuộc Đối Đầu Định Mệnh: Peyz vs. Gumayusi\r\nSự chuyển nhượng này không chỉ thay đổi T1 mà còn làm nóng thêm cuộc cạnh tranh trong LCK. Với Gumayusi gia nhập HLE, các trận đấu giữa T1 và HLE hứa hẹn sẽ là tâm điểm của mùa giải 2026. Người hâm mộ đang háo hức chờ đợi những cuộc đối đầu trực tiếp giữa Peyz và Gumayusi, nơi cả hai sẽ có cơ hội chứng minh giá trị của mình. Ngoài ra, sự hiện diện của Park \"Ruler\" Jae-hyuk tại Gen.G cũng đảm bảo rằng đường dưới của LCK sẽ là chiến trường khốc liệt nhất trong năm tới.\r\nKết Luận: Một Chương Mới Cho T1\r\nViệc Peyz gia nhập T1 và thay thế Gumayusi là một bước ngoặt lớn, đánh dấu sự chuyển giao thế hệ của đội tuyển giàu thành tích nhất LMHT. Trong khi Gumayusi để lại một di sản khó vượt qua, Peyz mang đến sức trẻ, kỹ năng cá nhân xuất sắc, và tiềm năng để viết tiếp câu chuyện vinh quang của T1. Dù áp lực dành cho anh là không nhỏ, chiến thắng tại KeSPA Cup 2025 cho thấy Peyz sẵn sàng đón nhận thử thách.\r\n\r\n\r\nNguồn: wikipedia.com', 'TCG-USR-006', 'img/blog_peyz.jpg'),
('TCG-BLG-008', 'Chức vô địch KeSPA Cup đầu tiên cho Faker và T1 - Hứa hẹn 1 năm 2026 bùng nổ ?', 'TCG-BGC-003', '2025-12-24 10:36:45', '2025-12-24 10:36:45', 'KeSPA Cup 2025: Bối Cảnh và Tầm Quan Trọng\r\nKeSPA Cup 2025 là lần thứ 9 giải đấu Liên Minh Huyền Thoại (LMHT) được tổ chức bởi Hiệp hội Thể thao Điện tử Hàn Quốc (KeSPA), diễn ra từ ngày 6/12 đến 14/12/2025. Giải đấu quy tụ 14 đội, bao gồm 10 đội LCK (như T1, Gen.G, HLE), hai đội khách mời từ LCS (Cloud9, Team Liquid), và hai đội all-star từ Nhật Bản và Việt Nam. Với tổng giải thưởng 100 triệu KRW (khoảng 67.818 USD), KeSPA Cup không chỉ là cơ hội để các đội thử nghiệm đội hình mới mà còn là sân chơi để khẳng định sức mạnh trước mùa giải LCK 2026.\r\nĐối với T1, KeSPA Cup 2025 mang ý nghĩa đặc biệt. Sau khi hoàn thành cú \"three-peat\" lịch sử với ba chức vô địch Chung kết Thế giới (CKTG) liên tiếp (2023, 2024, 2025), T1 bước vào giải đấu với đội hình mới, thay thế xạ thủ Lee \"Gumayusi\" Min-hyeong bằng Peyz. Đây là cơ hội để T1 chứng minh rằng họ vẫn là thế lực thống trị, ngay cả sau những thay đổi lớn về nhân sự.\r\nHành Trình Vô Địch KeSPA Cup 2025 Của T1\r\nVòng Bảng: Khẳng Định Sức Mạnh\r\nT1 được xếp vào bảng C, nơi họ dễ dàng thống trị với thành tích 3-0, đánh bại Nongshim RedForce, Team Liquid, và đội all-star Nhật Bản trong các trận Bo1. Peyz nhanh chóng trở thành tâm điểm với màn trình diễn ấn tượng, đặc biệt trong trận đấu với Team Liquid, nơi anh được vinh danh là Player of the Game. Những chiến thắng này giúp T1 giành vé trực tiếp vào vòng knock-out, khẳng định vị thế ứng cử viên hàng đầu.\r\nVòng Knock-out: Thử Thách Và Bản Lĩnh\r\nTại vòng knock-out, T1 đối mặt với những thử thách lớn hơn:\r\n\r\nTứ Kết vs. Hanwha Life Esports (HLE): T1 bất ngờ để thua HLE với tỷ số 1-2 trong trận Bo3, rơi xuống nhánh thua. Trận đấu này là cuộc tái hợp đầy cảm xúc khi T1 đối đầu với hai cựu thành viên Zeus và Gumayusi, nay khoác áo HLE. Dù thất bại, T1 cho thấy tiềm năng của đội hình mới, với Peyz và Keria tạo ra những điểm nhấn ở đường dưới.\r\nBán Kết Nhánh Thua vs. Dplus KIA (DK): Đối đầu với DK, đội có xạ thủ trẻ Shin \"Smash\" Geum-jae (cựu học viện T1), T1 thể hiện bản lĩnh nhà vô địch. Họ lội ngược dòng từ thế bị dẫn 0-2, thắng 3-2 trong loạt Bo5 nghẹt thở, với pha lật kèo ấn tượng ở ván 5 khi vượt qua cách biệt 8.000 vàng. Cặp đôi đường dưới Peyz và Keria tỏa sáng với Renata Glasc và Kalista, khẳng định sự ăn ý đáng kinh ngạc.\r\n\r\nChung Kết: T1 vs. Hanwha Life Esports\r\nTrận chung kết ngày 12/12/2025 giữa T1 và HLE là một trong những loạt Bo5 đáng xem nhất năm, không chỉ vì tính cạnh tranh mà còn vì câu chuyện đầy cảm xúc: T1 đối đầu với Zeus và Gumayusi, hai cựu đồng đội từng cùng họ chinh phục ba danh hiệu CKTG.\r\n\r\nVán 1: T1 mở đầu mạnh mẽ với chiến thuật xoay quanh đường trên, nơi Choi \"Doran\" Hyeon-joon sử dụng Renekton để áp đảo Ambessa của Zeus. Peyz tận dụng không gian để tỏa sáng với Varus, kết thúc ván đấu với KDA 3/1/5, giúp T1 giành chiến thắng.\r\nVán 2: Moon \"Oner\" Hyeon-joon trở thành người hùng với Xin Zhao, ghi tới 10 mạng hạ gục. Peyz tiếp tục ấn tượng với Aphelios, giúp T1 vươn lên dẫn 2-0. HLE gần như bất lực trước nhịp độ áp đảo của T1.\r\nVán 3 và 4: HLE tìm lại phong độ, kéo dài trận đấu với những ván đấu kéo dài hơn 30 phút. Zeus và Gumayusi phối hợp ăn ý, tận dụng sức mạnh đội hình để thắng liên tiếp hai ván, gỡ hòa 2-2. Những pha giao tranh căng thẳng khiến người hâm mộ không thể rời mắt.\r\nVán 5: T1 thể hiện bản lĩnh của nhà vô địch với chiến thuật hoàn hảo. Peyz sử dụng Zeri để tạo ra khoảng cách lớn về sát thương, kết hợp với sự hỗ trợ xuất sắc của Keria trên Renata Glasc. T1 hủy diệt HLE với tỷ số 23-1, kết thúc trận đấu chỉ sau 28 phút và giành chức vô địch với tỷ số chung cuộc 3-2.\r\n\r\nPeyz được vinh danh là MVP trận chung kết với màn trình diễn vượt trội trên Zeri và Kalista, nhận giải thưởng 2 triệu KRW (khoảng 1.350 USD). Đây là lần đầu tiên anh giành danh hiệu với T1, đánh dấu sự khởi đầu đầy hứa hẹn.\r\nNhững Điểm Nhấn Của T1 Tại KeSPA Cup 2025\r\n\r\nPeyz – Ngôi Sao Mới Của T1:\r\nThay thế Gumayusi, một trong những xạ thủ xuất sắc nhất thế giới, là nhiệm vụ không hề dễ dàng, nhưng Peyz đã chứng minh giá trị của mình. Anh ghi dấu ấn với hàng loạt pha xử lý đỉnh cao, đặc biệt là pentakill trong trận đấu với Team Liquid và hai quadrakill khác trong giải. Sự ăn ý với Keria, cùng lối chơi hung hãn, giúp Peyz trở thành nhân tố chủ chốt trong chiến thắng của T1.\r\nCộng đồng trên Reddit nhận xét: “Peyz dường như là phiên bản nâng cấp của Gumayusi với lối chơi tấn công và bể tướng đa dạng. Anh ấy đang giải phóng tiềm năng của Keria ở một tầm cao mới.”\r\n\r\nDoran Và Oner Tỏa Sáng:\r\nDoran, người thay thế Zeus từ năm 2024, tiếp tục cho thấy sự tiến bộ. Với Renekton và Sion, anh đã khóa chặt các đối thủ mạnh như Zeus, đặc biệt trong ván 1 và 5 của trận chung kết.\r\nOner, với Xin Zhao và Sylas, là động lực lớn trong các pha giao tranh then chốt. Anh được ca ngợi vì sự ổn định và khả năng “bật chế độ clutch” trong những khoảnh khắc quyết định.\r\n\r\nFaker – Huyền Thoại Thêm Cột Mốc:\r\nLee \"Faker\" Sang-hyeok, ở tuổi 29, lần đầu tiên giành danh hiệu KeSPA Cup trong sự nghiệp. Trước giải, Faker chia sẻ: “Tôi rất muốn vô địch KeSPA Cup. Gumayusi đang chơi tốt bên HLE, nên đây sẽ là loạt trận thú vị.” Chiến thắng này không chỉ là món quà dành cho người hâm mộ mà còn là bước đệm hoàn hảo cho mùa giải 2026.\r\n\r\nKeria – Người Hùng Thầm Lặng:\r\nRyu \"Keria\" Min-seok tiếp tục khẳng định vị thế hỗ trợ số một thế giới. Sự kết hợp với Peyz đã tạo ra cặp đôi đường dưới đáng sợ, với những pha xử lý tinh tế trên Renata, Yuumi, và Bard. Keria được xem là “bộ não” chiến thuật của T1 tại KeSPA Cup.\r\n\r\n\r\nÝ Nghĩa Của Chức Vô Địch\r\n\r\nKhẳng định đội hình mới: Chiến thắng tại KeSPA Cup 2025 là minh chứng rằng T1 vẫn duy trì sức mạnh đỉnh cao dù thay đổi xạ thủ. Peyz không chỉ lấp đầy khoảng trống của Gumayusi mà còn mang đến làn gió mới với phong cách chơi chủ động. Huấn luyện viên Mata nhấn mạnh: “Các tuyển thủ đã làm việc rất chăm chỉ dù lịch trình dày đặc. Tôi tự hào vì họ đã chơi xuất sắc.”\r\nBước đệm cho 2026: Với mục tiêu giành chức vô địch CKTG thứ tư liên tiếp – một kỳ tích chưa từng có – T1 cho thấy họ sẵn sàng cho mùa giải mới. Faker chia sẻ: “KeSPA Cup là cơ hội để chúng tôi học hỏi và phát triển. Đây là khởi đầu tuyệt vời cho 2026.”\r\nCâu chuyện cảm xúc: Trận chung kết là cuộc đối đầu đầy cảm xúc giữa T1 và HLE, nơi Zeus và Gumayusi, hai cựu thành viên, không thể vượt qua đội bóng cũ. Dù thất bại, Gumayusi vẫn nhận được sự tôn trọng lớn từ cộng đồng vì màn trình diễn đáng khen ngợi.\r\n\r\nPhản Ứng Cộng Đồng\r\nNgười hâm mộ trên Reddit và các nền tảng mạng xã hội không tiếc lời ca ngợi T1:\r\n\r\n“Peyz thực sự là quái vật! Anh ấy khiến tôi quên đi Gumayusi chỉ sau một giải đấu,” một người dùng viết.\r\n“Oner gank Gumayusi nhiều hơn cả 5 năm qua cộng lại. T1 khóa mục tiêu quá chuẩn!” một bình luận hài hước nhận được hàng trăm lượt thích.\r\nTuy nhiên, một số ý kiến cho rằng HLE thiếu một thủ lĩnh thực sự, khiến họ không thể duy trì phong độ ở ván 5. “HLE có Zeus, Gumayusi, Kanavi, nhưng họ cần một người dẫn dắt như Faker,” một fan nhận xét.\r\n\r\nTương Lai Của T1\r\nChức vô địch KeSPA Cup 2025 là lời khẳng định rằng T1 không chỉ sống bằng quá khứ mà còn sẵn sàng chinh phục tương lai. Với đội hình Doran, Oner, Faker, Peyz, và Keria, dưới sự dẫn dắt của HLV Bengi và Mata, T1 đang xây dựng một triều đại mới. LCK 2026 hứa hẹn sẽ là sân khấu cho những cuộc đối đầu đỉnh cao giữa T1 và HLE, đặc biệt khi Peyz và Gumayusi tiếp tục cạnh tranh để chứng minh ai là xạ thủ xuất sắc hơn.\r\n\r\nNguồn: sheepesports.com', 'TCG-USR-006', 'img/blog_kespa.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `blog_categories`
--

CREATE TABLE `blog_categories` (
  `blog_cate_id` varchar(20) NOT NULL,
  `blog_cate_name` varchar(100) NOT NULL,
  `blog_cate_image` varchar(255) NOT NULL,
  `create_at` datetime NOT NULL,
  `update_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `blog_categories`
--

INSERT INTO `blog_categories` (`blog_cate_id`, `blog_cate_name`, `blog_cate_image`, `create_at`, `update_at`) VALUES
('TCG-BGC-001', 'Tin tức gaming', 'img/blog_gaming.jpg', '2025-10-01 10:00:00', '2025-10-01 10:00:00'),
('TCG-BGC-002', 'Hướng dẫn thiết bị', 'img/blog_gear.jpg', '2025-10-01 10:00:00', '2025-10-01 10:00:00'),
('TCG-BGC-003', 'Đội tuyển thi đấu', 'img/blog_teams.jpg', '2025-10-01 10:00:00', '2025-10-01 10:00:00'),
('TCG-BGC-004', 'Review jerseys', 'img/blog_jerseys.jpg', '2025-10-01 10:00:00', '2025-10-01 10:00:00'),
('TCG-BGC-005', 'Mẹo chơi game', 'img/blog_tips.jpg', '2025-10-01 10:00:00', '2025-10-01 10:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brands`
--

CREATE TABLE `brands` (
  `brand_id` varchar(20) NOT NULL,
  `brand_name` varchar(100) NOT NULL,
  `brand_image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `brands`
--

INSERT INTO `brands` (`brand_id`, `brand_name`, `brand_image`) VALUES
('TCG-BRN-001', 'Razer', 'img/razer.jpg'),
('TCG-BRN-002', 'Logitech', 'img/logitech.jpg'),
('TCG-BRN-003', 'HyperX', 'img/hyperx.jpg'),
('TCG-BRN-004', 'Corsair', 'img/corsair.jpg'),
('TCG-BRN-005', 'G2', 'img/g2.jpg'),
('TCG-BRN-006', 'T1 Esports', 'img/t1.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `cate_id` varchar(20) NOT NULL,
  `cate_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`cate_id`, `cate_name`) VALUES
('TCG-CAT-001', 'Thiết bị gaming'),
('TCG-CAT-002', 'Áo thi đấu jerseys');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `colors`
--

CREATE TABLE `colors` (
  `color_id` varchar(20) NOT NULL,
  `color_name` varchar(50) NOT NULL,
  `color_code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `colors`
--

INSERT INTO `colors` (`color_id`, `color_name`, `color_code`) VALUES
('TCG-COL-001', 'Đỏ', '#FF0000'),
('TCG-COL-002', 'Xanh dương', '#0000FF'),
('TCG-COL-003', 'Đen', '#000000'),
('TCG-COL-004', 'Trắng', '#FFFFFF'),
('TCG-COL-005', 'Xám', '#808080');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `cmt_id` varchar(20) NOT NULL,
  `cmt_content` longtext DEFAULT NULL,
  `user_id` varchar(20) DEFAULT NULL,
  `product_id` varchar(20) NOT NULL,
  `guest_name` varchar(100) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `create_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `comments`
--

INSERT INTO `comments` (`cmt_id`, `cmt_content`, `user_id`, `product_id`, `guest_name`, `rating`, `create_at`, `created_at`, `updated_at`) VALUES
('TCG-CMT-001', 'Sản phẩm tuyệt vời, chuột cầm rất chắc tay và chính xác.', 'TCG-USR-001', 'TCG-PRO-001', 'Khách hàng A', 5, '2025-10-15 10:00:00', '2026-01-02 00:31:42', '2026-01-02 00:31:42'),
('TCG-CMT-002', 'Bàn phím gõ êm, đèn RGB đẹp, đáng tiền.', NULL, 'TCG-PRO-002', 'Khách vãng lai B', 4, '2025-10-16 11:00:00', '2026-01-02 00:31:42', '2026-01-02 00:31:42'),
('TCG-CMT-003', 'Áo chất lượng tốt, in logo sắc nét, ship nhanh.', 'TCG-USR-002', 'TCG-PRO-003', 'Nguyễn Văn An', 5, '2025-10-17 12:00:00', '2026-01-02 00:31:42', '2026-01-02 00:31:42'),
('TCG-CMT-004', 'Tai nghe âm thanh rõ, nhưng pin hơi yếu.', NULL, 'TCG-PRO-004', 'Khách C', 3, '2025-10-18 13:00:00', '2026-01-02 00:31:42', '2026-01-02 00:31:42'),
('TCG-CMT-005', 'Áo custom đẹp, size vừa vặn, hài lòng.', 'TCG-USR-003', 'TCG-PRO-005', 'Trần Thị Bình', 4, '2025-10-19 14:00:00', '2026-01-02 00:31:42', '2026-01-02 00:31:42'),
('TCG-CMT-056432e2', 'sản phẩm như đống cứt', NULL, 'TCG-PRO-004', 'sanr', 1, NULL, '2026-01-15 23:34:22', '2026-01-15 23:34:22'),
('TCG-CMT-56fbd386', 'CŨNG ĐẲNG CẤP', NULL, 'TCG-PRO-005', 'Fan T1 1580', 5, NULL, '2026-01-18 00:19:27', '2026-01-18 00:19:27'),
('TCG-CMT-7878b5ff', 'sản phẩm ko dc dởm cho mấy', NULL, 'TCG-PRO-005', 'T1 Faker', 5, NULL, '2026-01-12 01:18:18', '2026-01-12 01:18:18'),
('TCG-CMT-c11decdf', 'OK', NULL, 'TCG-PRO-003', 'TÀY', NULL, NULL, '2026-07-06 18:10:24', '2026-07-06 18:10:24'),
('TCG-CMT-f8ae584e', 'đánh giá 4 sao để có gì mai +1', NULL, 'TCG-PRO-005', 'Fan T1 2725', 4, NULL, '2026-01-12 01:49:57', '2026-01-12 01:49:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

CREATE TABLE `messages` (
  `message_id` varchar(20) NOT NULL,
  `user_id` varchar(20) DEFAULT NULL,
  `guest_name` varchar(100) NOT NULL,
  `message_text` varchar(500) NOT NULL,
  `create_at` datetime NOT NULL,
  `guest_email` varchar(100) NOT NULL,
  `message_title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `messages`
--

INSERT INTO `messages` (`message_id`, `user_id`, `guest_name`, `message_text`, `create_at`, `guest_email`, `message_title`) VALUES
('MSG-I1MJ3U5G0', 'TCG-USR-012', 'Tày', 'tại sao chúng mày thua 3-1?', '0000-00-00 00:00:00', 'datd9079@gmail.com', 'tại sao thua 3-1'),
('MSG-Z97EQJMQV', 'TCG-USR-012', 'T1 Keria', 'VCL THUHA 3-1 G2', '0000-00-00 00:00:00', 'datd9079@gmail.com', 'tại sao thua 3-1'),
('TCG-MSG-001', 'TCG-USR-001', 'Nguyễn Văn An', 'Tôi muốn hỏi về chính sách đổi trả sản phẩm gaming gear.', '2025-10-10 16:00:00', 'an@example.com', 'Hỏi về đổi trả'),
('TCG-MSG-002', NULL, 'Khách vãng lai', 'Áo jerseys có ship cod không? Thời gian giao bao lâu?', '2025-10-11 16:00:00', 'khach@example.com', 'Ship cod jerseys'),
('TCG-MSG-003', 'TCG-USR-002', 'Trần Thị Bình', 'Làm thế nào để tùy chỉnh áo thi đấu?', '2025-10-12 16:00:00', 'binh@example.com', 'Tùy chỉnh áo'),
('TCG-MSG-004', NULL, 'Lê Văn Cường', 'Giá voucher giảm giá hiện tại?', '2025-10-13 16:00:00', 'cuong@example.com', 'Voucher giảm giá'),
('TCG-MSG-005', 'TCG-USR-003', 'Phạm Thị Dung', 'Thông tin đội tuyển T1?', '2025-10-14 16:00:00', 'dung@example.com', 'Info đội T1'),
('TCG-MSG-006', 'TCG-USR-012', 'T1 Keria', 'vcl chúng mày thua 3 1 thật à', '0000-00-00 00:00:00', 'facehugging845@gmail.com', 'tại sao thua 3-1'),
('TCG-MSG-007', 'TCG-USR-012', 'T1 Keria', 'out top 4', '0000-00-00 00:00:00', 'datd9079@gmail.com', 'thua 31'),
('TCG-MSG-008', 'TCG-USR-012', 'T1 Keria', 'ádadaddadad', '0000-00-00 00:00:00', 'facehugging845@gmail.com', 'ádasasdad'),
('TCG-MSG-009', 'TCG-USR-012', 'T1 Keria', 'adsadsadasdasd', '0000-00-00 00:00:00', 'datd9079@gmail.com', 'ádasdasdad'),
('TCG-MSG-010', 'TCG-USR-012', 'T1 Keria', 'ádadsadasd', '0000-00-00 00:00:00', 'datd9079@gmail.com', 'ádadasdasd'),
('TCG-MSG-011', 'TCG-USR-012', 'T1 Keria', 'ádadadad', '0000-00-00 00:00:00', 'facehugging845@gmail.com', 'ádadad'),
('TCG-MSG-012', 'TCG-USR-012', 'T1 Keria', 'adasda', '0000-00-00 00:00:00', 'facehugging845@gmail.com', 'ádasd'),
('TCG-MSG-013', 'TCG-USR-012', 'T1 Keria', 'd', '0000-00-00 00:00:00', 'facehugging845@gmail.com', 'ádasda'),
('TCG-MSG-014', 'TCG-USR-012', 'T1 Keria', 'adasdasdad', '0000-00-00 00:00:00', 'facehugging845@gmail.com', 'ádadsad'),
('TCG-MSG-015', 'TCG-USR-012', 'T1 Keria', 'ádasdasdasda', '0000-00-00 00:00:00', 'facehugging845@gmail.com', 'ádadad'),
('TCG-MSG-016', 'TCG-USR-012', 'T1 Keria', 'ádsadadasd', '0000-00-00 00:00:00', 'facehugging845@gmail.com', 'ádasdad'),
('TCG-MSG-017', 'TCG-USR-011', 'Đặng Đạt', 'ádasdad', '0000-00-00 00:00:00', 'datd9079@gmail.com', 'ádasdad'),
('TCG-MSG-018', NULL, 'Nguyễn Minh Sóc', 'tại sao thua ?', '0000-00-00 00:00:00', 'datdark0412@gmail.com', 't1 thua'),
('TCG-MSG-019', NULL, 'ttttt', 'adsadssd', '0000-00-00 00:00:00', 'datdark0412@gmail.com', 'ádasd');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `noti_id` varchar(20) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `notifications_type` varchar(50) NOT NULL,
  `message` varchar(255) NOT NULL,
  `is_read` tinyint(1) DEFAULT NULL,
  `link` varchar(255) NOT NULL,
  `create_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`noti_id`, `user_id`, `notifications_type`, `message`, `is_read`, `link`, `create_at`) VALUES
('TCG-NTF-001', 'TCG-USR-001', 'Đơn hàng', 'Đơn hàng của bạn đã được giao thành công.', 0, '/order/TCG-ORD-001', '2025-10-10 17:00:00'),
('TCG-NTF-002', 'TCG-USR-002', 'Bình luận', 'Có phản hồi mới cho bình luận của bạn.', 1, '/product/TCG-PRO-002/comment', '2025-10-11 17:00:00'),
('TCG-NTF-003', 'TCG-USR-003', 'Khuyến mãi', 'Voucher mới: Giảm 20% cho gaming gear!', 0, '/vouchers', '2025-10-12 17:00:00'),
('TCG-NTF-004', 'TCG-USR-004', 'Blog', 'Bài viết mới: Review jerseys 2025.', 0, '/blog/TCG-BLG-002', '2025-10-13 17:00:00'),
('TCG-NTF-005', 'TCG-USR-005', 'Cập nhật', 'Sản phẩm yêu thích của bạn hết hàng.', 1, '/product/TCG-PRO-005', '2025-10-14 17:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `order_id` varchar(20) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `order_date` date NOT NULL,
  `order_time` time NOT NULL,
  `order_status` varchar(50) NOT NULL,
  `payment_status` varchar(50) NOT NULL,
  `payment_method` varchar(50) DEFAULT 'cod' COMMENT 'Phương thức thanh toán: cod, vnpay, bank, momo',
  `shipping_method` varchar(50) DEFAULT 'standard' COMMENT 'Phương thức vận chuyển: standard, express, overnight',
  `recipient_name` varchar(100) NOT NULL COMMENT 'Tên người nhận',
  `recipient_phone` varchar(20) NOT NULL COMMENT 'Số điện thoại người nhận',
  `recipient_email` varchar(100) NOT NULL COMMENT 'Email người nhận',
  `shipping_address` varchar(255) NOT NULL COMMENT 'Địa chỉ giao hàng',
  `shipping_status` varchar(50) DEFAULT 'Chờ xử lý' COMMENT 'Trạng thái vận chuyển: Chờ xử lý, Đã xác nhận, Đang giao, Đã giao, Hủy',
  `note` text DEFAULT NULL,
  `is_received` varchar(50) DEFAULT 'Chưa nhận hàng',
  `applied_vouchers` varchar(255) DEFAULT NULL COMMENT 'JSON string of applied voucher codes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `order_date`, `order_time`, `order_status`, `payment_status`, `payment_method`, `shipping_method`, `recipient_name`, `recipient_phone`, `recipient_email`, `shipping_address`, `shipping_status`, `note`, `is_received`, `applied_vouchers`) VALUES
('TCG-ORD-001', 'TCG-USR-001', '2025-10-10', '14:30:00', 'Đã giao', 'Đã thanh toán', 'cod', 'standard', '', '', '', '', 'Chờ xử lý', NULL, 'Chưa nhận hàng', NULL),
('TCG-ORD-002', 'TCG-USR-002', '2025-10-11', '15:45:00', 'Đang xử lý', 'Chờ thanh toán', 'cod', 'standard', '', '', '', '', 'Chờ xử lý', NULL, 'Chưa nhận hàng', NULL),
('TCG-ORD-003', 'TCG-USR-003', '2025-10-12', '16:20:00', 'Hủy', 'Hoàn tiền', 'cod', 'standard', '', '', '', '', 'Chờ xử lý', NULL, 'Chưa nhận hàng', NULL),
('TCG-ORD-004', 'TCG-USR-004', '2025-10-13', '17:10:00', 'Đã giao', 'Đã thanh toán', 'cod', 'standard', '', '', '', '', 'Chờ xử lý', NULL, 'Chưa nhận hàng', NULL),
('TCG-ORD-005', 'TCG-USR-005', '2025-10-14', '18:05:00', 'Đang giao', 'Đã thanh toán', 'cod', 'standard', '', '', '', '', 'Chờ xử lý', NULL, 'Chưa nhận hàng', NULL),
('TCG-ORD-006', 'TCG-USR-011', '2026-07-05', '23:44:28', 'Đang xử lý', 'Chờ thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'Đặng Đạt', '0690036045', 'datd9079@gmail.com', '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', 'Chờ xử lý', 'ĐÂSD', 'Chưa nhận hàng', NULL),
('TCG-ORD-007', 'TCG-USR-011', '2026-07-06', '00:01:30', 'Đang xử lý', 'Chờ thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'Đặng Đạt', '0690036045', 'datd9079@gmail.com', '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', 'Chờ xử lý', 'VÔ ĐỊCH RỒI', 'Chưa nhận hàng', NULL),
('TCG-ORD-008', 'TCG-USR-011', '2026-07-06', '00:04:04', 'Đang xử lý', 'Chờ thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'Đặng Đạt', '0690036045', 'datd9079@gmail.com', '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', 'Chờ xử lý', 'SÁDAD', 'Chưa nhận hàng', NULL),
('TCG-ORD-009', 'TCG-USR-011', '2026-07-06', '00:05:21', 'Đang xử lý', 'Đã thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'Đặng Đạt', '0690036045', 'datd9079@gmail.com', '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', 'Chờ xử lý', '', 'Chưa nhận hàng', NULL),
('TCG-ORD-010', 'TCG-USR-011', '2026-07-06', '00:31:59', 'Chờ xác nhận', 'Chờ thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'Đặng Đạt', '0690036045', 'datd9079@gmail.com', '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', 'Chờ xử lý', 'ok', 'Chưa nhận hàng', NULL),
('TCG-ORD-011', 'TCG-USR-011', '2026-07-06', '00:37:16', 'Chờ xác nhận', 'Chờ thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Tiêu Chuẩn', 'Đặng Đạt', '0690036045', 'datd9079@gmail.com', '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', 'Chờ xử lý', 'KJKO;', 'Chưa nhận hàng', NULL),
('TCG-ORD-012', 'TCG-USR-011', '2026-07-06', '00:42:14', 'Chờ xác nhận', 'Chờ thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Tiêu Chuẩn', 'Đặng Đạt', '0690036045', 'datd9079@gmail.com', '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', 'Chờ xử lý', 'rdfg', 'Chưa nhận hàng', NULL),
('TCG-ORD-013', 'TCG-USR-011', '2026-07-06', '17:57:01', 'Chờ xác nhận', 'Chờ thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'Đặng Đạt', '0809060408', 'datd9079@gmail.com', '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', 'Chờ xử lý', 'ádasdad', 'Chưa nhận hàng', NULL),
('TCG-ORD-014', 'TCG-USR-011', '2026-07-06', '18:11:06', 'Chờ xác nhận', 'Chờ thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Tiêu Chuẩn', 'Đặng Đạt', '08090604010', 'datd9079@gmail.com', '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', 'Chờ xử lý', '', 'Chưa nhận hàng', NULL),
('TCG-ORD-015', 'TCG-USR-012', '2026-07-07', '18:01:19', 'Đã giao', 'Đã thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Tiêu Chuẩn', 'Hunter2 FaceHugging', '0658124978891', 'facehugging845@gmail.com', 'nb20a', 'Đã giao', 'dádadadad', 'Đã nhận hàng', NULL),
('TCG-ORD-016', 'TCG-USR-012', '2026-07-07', '18:26:06', 'Hoàn thành', 'Đã thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'Hunter2 FaceHugging', '63465', 'facehugging845@gmail.com', '14/1', 'Đã giao', 'ádadad', 'Đã nhận hàng', NULL),
('TCG-ORD-017', 'TCG-USR-012', '2026-07-07', '18:32:24', 'Đã giao', 'Đã thanh toán', 'Thanh Toán VNPAY', 'Giao Hàng Tiêu Chuẩn', 'Hunter2 FaceHugging', '0364655292', 'facehugging845@gmail.com', '14/1', 'Đã giao', 'ÁDASDAD', 'Đã nhận hàng', NULL),
('TCG-ORD-018', 'TCG-USR-012', '2026-07-07', '23:45:22', 'Chờ xác nhận', 'Chờ thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'T1 Keria', '0908090908', 'facehugging845@gmail.com', 'k1, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Chờ xử lý', 'ưewerwrwer', 'Chưa nhận hàng', NULL),
('TCG-ORD-019', 'TCG-USR-011', '2026-07-09', '18:49:45', 'Hoàn thành', 'Chá»  thanh toĂ¡n', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'Đặng Đạt', '0809060409', 'datd9079@gmail.com', '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', 'Chá»  xá»­ lĂ½', 'dqwdqwdwqdqd', 'Đã nhận hàng', 'NEWUSER20,FREESHIPMAX'),
('TCG-ORD-020', 'TCG-USR-011', '2026-07-09', '19:10:40', 'Đã giao', 'Chá» thanh toĂ¡n', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'Đặng Đạt', '0809060409', 'datd9079@gmail.com', '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', 'Chá» xá»­ lĂ½', 'dqdqdqd', 'Chưa nhận hàng', NULL),
('TCG-ORD-021', 'TCG-USR-012', '2026-07-09', '19:13:49', 'Hoàn thành', 'Đã thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'T1 Keria', '0908090908', 'facehugging845@gmail.com', 'k1, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Đã giao', 'ádasdad', 'Đã nhận hàng', NULL),
('TCG-ORD-022', 'TCG-USR-012', '2026-07-09', '19:31:00', 'Hoàn thành', 'Đã thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'T1 Keria', '0908090908', 'facehugging845@gmail.com', 'k1, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Đã giao', 'xazXzxZX', 'Đã nhận hàng', NULL),
('TCG-ORD-023', 'TCG-USR-012', '2026-07-09', '19:53:36', 'Chá» xĂ¡c nháº­n', 'Chá» thanh toĂ¡n', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'T1 Keria', '0908090908', 'facehugging845@gmail.com', 'k1, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Chá» xá»­ lĂ½', 'đưqqd', 'Chưa nhận hàng', NULL),
('TCG-ORD-024', 'TCG-USR-012', '2026-07-09', '20:12:21', 'Hoàn trả', 'Đã thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'T1 Keria', '0908090908', 'facehugging845@gmail.com', 'k1, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Hoàn trả', 'ÂDSSADADADA', 'Đã hoàn trả', NULL),
('TCG-ORD-025', 'TCG-USR-012', '2026-07-09', '20:57:50', 'Chá» xĂ¡c nháº­n', 'Chá» thanh toĂ¡n', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'T1 Keria', '0908090908', 'facehugging845@gmail.com', 'k1, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Chá» xá»­ lĂ½', 'EASDASDADA', 'Chưa nhận hàng', NULL),
('TCG-ORD-026', 'TCG-USR-012', '2026-07-09', '21:11:22', 'Chá» xĂ¡c nháº­n', 'Chá» thanh toĂ¡n', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'T1 Keria', '0908090908', 'facehugging845@gmail.com', 'k1, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Chá» xá»­ lĂ½', 'ÁDADASDAD', 'Chưa nhận hàng', NULL),
('TCG-ORD-027', 'TCG-USR-012', '2026-07-09', '21:17:52', 'Chờ xác nhận', 'Chờ thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'T1 Keria', '0908090908', 'facehugging845@gmail.com', 'k1, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Chờ xử lý', 'đâsdadad', 'Chưa nhận hàng', 'NEWUSER20'),
('TCG-ORD-028', 'TCG-USR-012', '2026-07-09', '21:25:22', 'Đã giao', 'Đã thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Nhanh', 'T1 Keria', '0908090908', 'facehugging845@gmail.com', 'k1, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Đã giao', 'DSADADADASD', 'Đã nhận hàng', 'NEWUSER20,FREESHIPMAX'),
('TCG-ORD-029', 'TCG-USR-013', '2026-07-10', '19:44:57', 'Chờ xác nhận', 'Chờ thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Tiêu Chuẩn', 'tày tày', '0809069032', 'datdark0412@gmail.com', '120 yên lãng, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Chờ xử lý', '', 'Chưa nhận hàng', NULL),
('TCG-ORD-030', 'TCG-USR-013', '2026-07-10', '19:45:50', 'Đã giao', 'Đã thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Tiêu Chuẩn', 'tày tày', '0809069032', 'datdark0412@gmail.com', '120 yên lãng, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Đã giao', '', 'Đã nhận hàng', NULL),
('TCG-ORD-031', 'TCG-USR-013', '2026-07-10', '19:51:11', 'Đã giao', 'Đã thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Tiêu Chuẩn', 'tày tày', '0809069032', 'datdark0412@gmail.com', '120 yên lãng, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Đã giao', '', 'Đã nhận hàng', NULL),
('TCG-ORD-032', 'TCG-USR-013', '2026-07-10', '20:29:30', 'Chờ xác nhận', 'Chờ thanh toán', 'Thanh Toán Khi Nhận Hàng', 'Giao Hàng Tiêu Chuẩn', 'tày tày', '0809069032', 'datdark0412@gmail.com', '120 yên lãng, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Chờ xử lý', '', 'Chưa nhận hàng', NULL),
('TCG-ORD-033', 'TCG-USR-013', '2026-07-10', '20:42:16', 'Chờ xác nhận', 'Đã thanh toán', 'Thanh Toán VNPAY', 'Giao Hàng Tiêu Chuẩn', 'tày tày', '0809069032', 'datdark0412@gmail.com', '120 yên lãng, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Chờ xử lý', '', 'Chưa nhận hàng', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_details`
--

CREATE TABLE `order_details` (
  `detail_id` varchar(20) NOT NULL,
  `order_id` varchar(20) NOT NULL,
  `variant_id` varchar(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_amount` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_details`
--

INSERT INTO `order_details` (`detail_id`, `order_id`, `variant_id`, `quantity`, `total_amount`) VALUES
('TCG-ODT-001', 'TCG-ORD-001', 'TCG-VAR-001', 2, 3000000),
('TCG-ODT-002', 'TCG-ORD-001', 'TCG-VAR-003', 1, 800000),
('TCG-ODT-003', 'TCG-ORD-029', 'TCG-VAR-017', 1, 900000),
('TCG-ODT-004', 'TCG-ORD-029', 'TCG-VAR-002', 1, 1550000),
('TCG-ODT-005', 'TCG-ORD-030', 'TCG-VAR-012', 1, 780000),
('TCG-ODT-006', 'TCG-ORD-031', 'TCG-VAR-003', 2, 3160000),
('TCG-ODT-007', 'TCG-ORD-031', 'TCG-VAR-017', 1, 900000),
('TCG-ODT-008', 'TCG-ORD-032', 'TCG-VAR-019', 899, 1123750000),
('TCG-ODT-009', 'TCG-ORD-033', 'TCG-VAR-019', 1, 1250000),
('TCG-ODT-010', 'TCG-ORD-033', 'TCG-VAR-004', 1, 1600000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `product_id` varchar(20) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_desc` text NOT NULL,
  `cate_id` varchar(20) NOT NULL,
  `brand_id` varchar(20) NOT NULL,
  `sc_id` varchar(20) NOT NULL,
  `team_id` varchar(20) DEFAULT NULL,
  `product_image` varchar(255) NOT NULL,
  `create_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `product_buying` int(11) NOT NULL,
  `product_rating` float NOT NULL,
  `product_rating_count` int(11) NOT NULL,
  `product_image_2` varchar(255) DEFAULT NULL,
  `product_image_3` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_desc`, `cate_id`, `brand_id`, `sc_id`, `team_id`, `product_image`, `create_at`, `update_at`, `product_buying`, `product_rating`, `product_rating_count`, `product_image_2`, `product_image_3`) VALUES
('TCG-PRO-001', 'Chuột gaming Razer DeathAdder', 'Chuột gaming chuyên nghiệp với cảm biến chính xác cao, phù hợp cho game thủ FPS.', 'TCG-CAT-001', 'TCG-BRN-001', 'TCG-SUB-001', NULL, 'img/mouse_razer.jpg', '2025-10-01 12:00:00', '2025-10-15 12:00:00', 100, 4.5, 50, 'img/mouse_razer_2.jpg', 'img/mouse_razer_3.jpg'),
('TCG-PRO-002', 'Bàn phím Logitech G Pro', 'Bàn phím cơ gaming với switch quang học, đèn RGB tùy chỉnh.', 'TCG-CAT-001', 'TCG-BRN-002', 'TCG-SUB-002', NULL, 'img/keyboard_logi.jpg', '2025-10-02 12:00:00', '2025-10-16 12:00:00', 80, 5, 30, 'img/keyboard_logi_2.jpg', 'img/keyboard_logi_3.jpg'),
('TCG-PRO-003', 'Áo đấu T1 LoL 2025 Jacket\r\n', 'Áo thi đấu chính hãng T1 League of Legends mùa giải 2025, chất liệu thoáng khí, in logo và tên người chơi.', 'TCG-CAT-002', 'TCG-BRN-006', 'TCG-SUB-003', 'TCG-TM-001', 'img/jersey_t1_lol_2025.jpg', '2025-10-03 12:00:00', '2025-10-17 12:00:00', 200, 4.8, 100, 'img/jersey_t1_lol_2025_2.jpg', 'img/jersey_t1_lol_2025_3.jpg'),
('TCG-PRO-004', 'Tai nghe Corsair Void', 'Tai nghe gaming không dây với âm thanh vòm 7.1, mic rõ nét.', 'TCG-CAT-001', 'TCG-BRN-004', 'TCG-SUB-005', NULL, 'img/headset_corsair.jpg', '2025-10-04 12:00:00', '2025-10-18 12:00:00', 50, 4.2, 20, 'img/headset_corsair_2.jpg', 'img/headset_corsair_3.jpg'),
('TCG-PRO-005', 'Áo đấu T1 Worlds 2025 Jersey', 'Áo thi đấu chính hãng T1 Worlds 2025, thiết kế hiện đại, chất liệu cao cấp.', 'TCG-CAT-002', 'TCG-BRN-006', 'TCG-SUB-003', 'TCG-TM-002', 'img/jersey_t1_worlds_2025.jpg', '2025-10-05 12:00:00', '2025-10-19 12:00:00', 150, 4.6, 40, 'img/jersey_t1_worlds_2025_2.jpg', 'img/jersey_t1_worlds_2025_3.jpg'),
('TCG-PRO-010', 'Áo đấu T1 PUBG 2025 Jersey', 'Áo thi đấu chính hãng T1 PUBG Mobile/PUBG PC 2025, chất liệu thoáng khí, in logo T1.', 'TCG-CAT-002', 'TCG-BRN-006', 'TCG-SUB-003', 'TCG-TM-003', 'img/jersey_t1_pubg_2025.jpg', '2025-12-01 10:00:00', '2025-12-01 10:00:00', 120, 4.7, 85, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `responses`
--

CREATE TABLE `responses` (
  `response_id` varchar(20) NOT NULL,
  `user_id` varchar(20) DEFAULT NULL,
  `cmt_id` varchar(20) DEFAULT NULL,
  `parent_response_id` varchar(20) DEFAULT NULL,
  `response_text` text DEFAULT NULL,
  `product_id` varchar(20) DEFAULT NULL,
  `create_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `responses`
--

INSERT INTO `responses` (`response_id`, `user_id`, `cmt_id`, `parent_response_id`, `response_text`, `product_id`, `create_at`) VALUES
('TCG-RSP-001', 'TCG-USR-001', 'TCG-CMT-001', NULL, 'Cảm ơn bạn đã đánh giá! Chúng tôi sẽ tiếp tục cải thiện sản phẩm.', 'TCG-PRO-001', '2025-10-15 11:00:00'),
('TCG-RSP-002', 'TCG-USR-001', 'TCG-CMT-002', NULL, 'Rất vui khi bạn thích bàn phím. Chúc bạn chơi game vui vẻ!', 'TCG-PRO-002', '2025-10-16 12:00:00'),
('TCG-RSP-003', 'TCG-USR-001', 'TCG-CMT-003', NULL, 'Hài lòng là niềm vui của shop. Mời bạn mua thêm nhé!', 'TCG-PRO-003', '2025-10-17 13:00:00'),
('TCG-RSP-004', 'TCG-USR-001', 'TCG-CMT-004', NULL, 'Cảm ơn phản hồi, chúng tôi sẽ kiểm tra pin ở lô sau.', 'TCG-PRO-004', '2025-10-18 14:00:00'),
('TCG-RSP-005', 'TCG-USR-001', 'TCG-CMT-005', NULL, 'Cảm ơn đánh giá về áo custom. Sẽ hỗ trợ thêm nếu cần chỉnh sửa.', 'TCG-PRO-005', '2025-10-19 15:00:00'),
('TCG-RSP-0736ace8', NULL, 'TCG-CMT-056432e2', NULL, 'ádadasd', 'TCG-PRO-004', '2026-01-16 00:21:24'),
('TCG-RSP-0ebcff4a', NULL, 'TCG-CMT-f8ae584e', NULL, 'vậy sao', 'TCG-PRO-005', '2026-01-18 00:17:48'),
('TCG-RSP-62d657e3', NULL, 'TCG-CMT-f8ae584e', 'TCG-RSP-0ebcff4a', 'hên xui', 'TCG-PRO-005', '2026-01-18 00:23:49'),
('TCG-RSP-66c4e627', NULL, 'TCG-CMT-056432e2', NULL, 'mày nói thật không ???', 'TCG-PRO-004', '2026-01-16 00:29:29'),
('TCG-RSP-da6721dd', NULL, 'TCG-CMT-003', 'TCG-RSP-003', 'à thế à', 'TCG-PRO-003', '2026-01-18 00:16:54'),
('TCG-RSP-e29a89b3', NULL, 'TCG-CMT-f8ae584e', 'TCG-RSP-0ebcff4a', 'ừ đúng rồi', 'TCG-PRO-005', '2026-01-18 00:18:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `site_ratings`
--

CREATE TABLE `site_ratings` (
  `rating_id` varchar(20) NOT NULL,
  `user_id` varchar(20) DEFAULT NULL,
  `guest_name` varchar(100) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` varchar(500) DEFAULT NULL,
  `create_at` datetime DEFAULT NULL,
  `guest_email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `site_ratings`
--

INSERT INTO `site_ratings` (`rating_id`, `user_id`, `guest_name`, `rating`, `comment`, `create_at`, `guest_email`) VALUES
('TCG-SRT-001', 'TCG-USR-001', 'Nguyễn Văn An', 5, 'Website dễ sử dụng, sản phẩm chất lượng cao.', '2025-10-20 10:00:00', 'an@example.com'),
('TCG-SRT-002', NULL, 'Khách B', 4, 'Giao hàng nhanh, nhưng hỗ trợ khách hàng cần cải thiện.', '2025-10-21 10:00:00', 'khachb@example.com'),
('TCG-SRT-003', 'TCG-USR-002', 'Trần Thị Bình', 5, 'Rất hài lòng với đa dạng gaming gear và jerseys.', '2025-10-22 10:00:00', 'binh@example.com'),
('TCG-SRT-004', NULL, 'Khách C', 3, 'Giá hơi cao so với thị trường.', '2025-10-23 10:00:00', 'khachc@example.com'),
('TCG-SRT-005', 'TCG-USR-003', 'Lê Văn Cường', 4, 'Tốt, sẽ mua lại.', '2025-10-24 10:00:00', 'cuong@example.com');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sizes`
--

CREATE TABLE `sizes` (
  `size_id` varchar(20) NOT NULL,
  `size_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `sizes`
--

INSERT INTO `sizes` (`size_id`, `size_name`) VALUES
('TCG-SIZ-001', 'S'),
('TCG-SIZ-002', 'M'),
('TCG-SIZ-003', 'L'),
('TCG-SIZ-004', 'XL'),
('TCG-SIZ-005', 'XXL');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sub_categories`
--

CREATE TABLE `sub_categories` (
  `sc_id` varchar(20) NOT NULL,
  `sc_name` varchar(100) NOT NULL,
  `sc_image` varchar(255) NOT NULL,
  `cate_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `sub_categories`
--

INSERT INTO `sub_categories` (`sc_id`, `sc_name`, `sc_image`, `cate_id`) VALUES
('TCG-SUB-001', 'Chuột gaming', 'img/mouse.jpg', 'TCG-CAT-001'),
('TCG-SUB-002', 'Bàn phím', 'img/keyboard.jpg', 'TCG-CAT-001'),
('TCG-SUB-003', 'Áo đấu đội tuyển', 'img/jersey_team.jpg', 'TCG-CAT-002'),
('TCG-SUB-004', 'Áo cá nhân hóa', 'img/jersey_custom.jpg', 'TCG-CAT-002'),
('TCG-SUB-005', 'Tai nghe', 'img/headset.jpg', 'TCG-CAT-001');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `teams`
--

CREATE TABLE `teams` (
  `team_id` varchar(20) NOT NULL,
  `team_name` varchar(100) NOT NULL,
  `team_image` varchar(255) NOT NULL,
  `team_counts` int(11) DEFAULT NULL,
  `team_established` datetime NOT NULL,
  `team_game` varchar(100) NOT NULL,
  `team_tournament` varchar(100) NOT NULL,
  `team_country` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `teams`
--

INSERT INTO `teams` (`team_id`, `team_name`, `team_image`, `team_counts`, `team_established`, `team_game`, `team_tournament`, `team_country`) VALUES
('TCG-TM-001', 'T1 League of Legends', 'img/t1_lol.jpg', 5, '2004-01-01 00:00:00', 'League of Legends', 'LCK', 'Hàn Quốc'),
('TCG-TM-002', 'T1 Valorant', 'img/t1_valorant.jpg', 6, '2020-01-01 00:00:00', 'Valorant', 'VCT Pacific', 'Hàn Quốc'),
('TCG-TM-003', 'T1 PUBG', 'img/t1_pubg.jpg', 5, '2018-01-01 00:00:00', 'PUBG', 'PMS', 'Hàn Quốc');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `teams_players`
--

CREATE TABLE `teams_players` (
  `player_id` varchar(20) NOT NULL,
  `player_fullname` varchar(100) NOT NULL,
  `player_ig_name` varchar(50) NOT NULL,
  `player_image` varchar(255) NOT NULL,
  `team_id` varchar(20) NOT NULL,
  `player_role` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `teams_players`
--

INSERT INTO `teams_players` (`player_id`, `player_fullname`, `player_ig_name`, `player_image`, `team_id`, `player_role`) VALUES
('TCG-TPL-001', 'Lee Sang-hyeok', 'Faker', 'img/player_faker.jpg', 'TCG-TM-001', 'Mid Laner'),
('TCG-TPL-002', 'Ryu Min-seok\r\n', 'Keria', 'img/player_keria.jpg', 'TCG-TM-001', 'Support'),
('TCG-TPL-003', 'Moon Hyeon-jun', 'Oner', 'img/player_oner.jpg', 'TCG-TM-001', 'Jungler'),
('TCG-TPL-004', 'Choi Hyeon-jun', 'Doran', 'img/player_doran.jpg', 'TCG-TM-001', 'Top Laner'),
('TCG-TPL-005', ' Kim Soo-hwan', 'Peyz', 'img/player_peyz.jpg', 'TCG-TM-001', 'AD Carry'),
('TCG-TPL-006', 'Kim Gu-taek', 'stax', 'img/player_stax.jpg', 'TCG-TM-002', 'IGL / Initiator'),
('TCG-TPL-007', 'Lee Jae-hyeok', 'carpe', 'img/player_carpe.jpg', 'TCG-TM-002', 'Controller'),
('TCG-TPL-008', 'Yu Byung-chul', 'BuZz', 'img/player_buzz.jpg', 'TCG-TM-002', 'Duelist'),
('TCG-TPL-009', 'Kim Tae-oh', 'Meteor', 'img/player_meteor.jpg', 'TCG-TM-002', 'Flex'),
('TCG-TPL-010', 'Ham Woo-Joo', 'iZu', 'img/player_izu.jpg', 'TCG-TM-002', 'Sentinel'),
('TCG-TPL-011', 'Byeon Sang-beom', 'Munchkin', 'img/player_munchkin.jpg', 'TCG-TM-002', 'Controller'),
('TCG-TPL-012', 'Roh Tae-young', 'EEND', 'img/player_eend.jpg', 'TCG-TM-003', 'IGL / Driver'),
('TCG-TPL-013', 'Kim Jong-myung', 'Rain1ng', 'img/player_rain1ng.jpg', 'TCG-TM-003', 'Fragger'),
('TCG-TPL-014', 'Lee Jin-woo', 'Type', 'img/player_type.jpg', 'TCG-TM-003', 'Support'),
('TCG-TPL-015', 'Cha Ji-hun', 'Heather', 'img/player_heather.jpg', 'TCG-TM-003', 'Fragger');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` varchar(20) NOT NULL,
  `user_fullname` varchar(100) NOT NULL,
  `user_username` varchar(50) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_phone_number` varchar(20) DEFAULT NULL,
  `user_isActive` int(11) NOT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `user_isAdmin` int(11) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `facebook_id` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_confirmed` varchar(30) DEFAULT 'CHƯA XÁC THỰC',
  `verification_token` varchar(100) DEFAULT NULL,
  `token_expires_at` datetime DEFAULT NULL,
  `reset_password_token` varchar(100) DEFAULT NULL,
  `reset_token_expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `user_fullname`, `user_username`, `user_password`, `user_email`, `user_phone_number`, `user_isActive`, `user_image`, `user_isAdmin`, `google_id`, `facebook_id`, `created_at`, `updated_at`, `is_confirmed`, `verification_token`, `token_expires_at`, `reset_password_token`, `reset_token_expires_at`) VALUES
('TCG-USR-001', 'Nguyễn Văn An', 'nguyenvanan', 'hashedpass1', 'an@gmail.com', '0123456789', 1, 'img/user1.jpg', 1, NULL, NULL, '2026-02-25 21:29:54', '2026-07-09 17:37:02', 'ĐÃ XÁC THỰC', NULL, NULL, NULL, NULL),
('TCG-USR-002', 'Trần Thị Bình', 'tranthibinh', 'hashedpass2', 'binh@example.com', '0987654321', 1, 'img/user2.jpg', 0, NULL, NULL, '2026-02-25 21:29:54', '2026-07-09 17:37:02', 'ĐÃ XÁC THỰC', NULL, NULL, NULL, NULL),
('TCG-USR-003', 'Lê Văn Cường', 'levancuong', 'hashedpass3', 'cuong@example.com', '0111222333', 1, 'img/user3.jpg', 0, NULL, NULL, '2026-02-25 21:29:54', '2026-07-09 17:37:02', 'ĐÃ XÁC THỰC', NULL, NULL, NULL, NULL),
('TCG-USR-004', 'Phạm Thị Dung', 'phamthidung', 'hashedpass4', 'dung@example.com', '0444555666', 1, 'img/user4.jpg', 0, NULL, NULL, '2026-02-25 21:29:54', '2026-07-09 17:37:02', 'ĐÃ XÁC THỰC', NULL, NULL, NULL, NULL),
('TCG-USR-005', 'Hoàng Văn Em', 'hoangvanem', 'hashedpass5', 'em@example.com', '0777888999', 1, 'img/user5.jpg', 0, NULL, NULL, '2026-02-25 21:29:54', '2026-07-09 17:37:02', 'ĐÃ XÁC THỰC', NULL, NULL, NULL, NULL),
('TCG-USR-006', 'Đặng Đặng', 'dangdang', '$2b$10$WkidTZ99460tXD43C/HyWOWGPHPltxIpvPihY35Mu1UhgiMYcWB4m', 'knight@gmail.com', '+84364655292', 1, 'img/users/1769869084411-530112317-faker.jpg', 0, NULL, NULL, '2026-02-25 21:29:54', '2026-07-09 17:37:02', 'ĐÃ XÁC THỰC', NULL, NULL, NULL, NULL),
('TCG-USR-008', 'Bruh Văn', 'bruhvan', '$2b$10$PLG1ZXbxRj8EW5nqXUgV.O/v9kJVJU2Oz0jYBxd1pLTuUeDWzwVma', 'hba87738@gmail.com', '01823644255', 1, 'img/1769869642315-710987545-fakerW24.jpg', 0, NULL, NULL, '2026-02-25 21:29:54', '2026-07-09 17:37:02', 'ĐÃ XÁC THỰC', NULL, NULL, NULL, NULL),
('TCG-USR-009', 'Lee Sang Hiếc', 'leesanghiec', '$2b$10$TOOQAEMl65Q4H9hdF.46j.vCBj05aHddl.K7Xx0Eel.jWy.I.g/fy', 'abc@gmail.com', '0907080907', 1, 'img/1771603512146-202307366-faker2025.jpg', 0, NULL, NULL, '2026-02-25 21:29:54', '2026-07-09 17:37:02', 'ĐÃ XÁC THỰC', NULL, NULL, NULL, NULL),
('TCG-USR-010', 'Tiến Đạt Đặng Đặng', 'tiendatdangnguyen', '', 'siuu@gmail.com', '0908090908', 1, 'img/1783419585603-833601717-maxresdefault.jpg', 0, NULL, '122109074865227856', '2026-02-25 21:29:54', '2026-07-09 17:37:02', 'ĐÃ XÁC THỰC', NULL, NULL, NULL, NULL),
('TCG-USR-011', 'Đặng Đạt', 'dangdat', '', 'datd9079@gmail.com', '0809060409', 1, 'img/1783418533623-453621022-avatar-google.jpg', 0, '104143569109046861426', NULL, '2026-02-25 21:30:20', '2026-07-09 17:37:02', 'ĐÃ XÁC THỰC', NULL, NULL, NULL, NULL),
('TCG-USR-012', 'T1 Keria', 'hunter2facehugging', '', 'facehugging845@gmail.com', '0908090908', 1, 'img/1783424760130-926208256-avatar-google.jpg', 0, '112761235228829734678', NULL, '2026-07-07 17:57:24', '2026-07-09 17:37:02', 'ĐÃ XÁC THỰC', NULL, NULL, NULL, NULL),
('TCG-USR-013', 'tày tày', 'taytay', '$2b$10$V.KwOXSATfu/E58KK0.PmOqsFMXKuc6dxuwZstJk5DvejmvLVcAe2', 'datdark0412@gmail.com', '0809069032', 1, 'img/1783613032050-751188259-maxresdefault.jpg', 0, NULL, NULL, '2026-07-09 23:03:52', '2026-07-09 23:09:25', 'Đã xác thực', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_activities`
--

CREATE TABLE `user_activities` (
  `id` int(11) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `ref_id` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user_activities`
--

INSERT INTO `user_activities` (`id`, `user_id`, `type`, `ref_id`, `description`, `created_at`) VALUES
(1, 'TCG-USR-011', 'UPDATE_PROFILE', NULL, 'Bạn đã cập nhật thông tin cá nhân', '2026-07-06 18:09:20'),
(2, 'TCG-USR-011', 'ORDER', 'TCG-ORD-014', 'Bạn đã đặt đơn hàng thành công', '2026-07-06 18:11:06'),
(3, 'TCG-USR-011', 'UPDATE_PROFILE', NULL, 'Bạn vừa cập nhật số điện thoại thành \"0809060409\"', '2026-07-06 18:44:25'),
(4, 'TCG-USR-011', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 16:29:28'),
(5, 'TCG-USR-011', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 16:36:43'),
(6, 'TCG-USR-011', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 16:44:27'),
(7, 'TCG-USR-011', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 16:58:21'),
(8, 'TCG-USR-011', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 16:59:09'),
(9, 'TCG-USR-010', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 17:00:58'),
(10, 'TCG-USR-010', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 17:01:17'),
(11, 'TCG-USR-010', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 17:01:33'),
(12, 'TCG-USR-010', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 17:01:42'),
(13, 'TCG-USR-011', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 17:02:11'),
(14, 'TCG-USR-011', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 17:02:13'),
(15, 'TCG-USR-010', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 17:19:38'),
(16, 'TCG-USR-010', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 17:19:45'),
(17, 'TCG-USR-012', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 18:00:18'),
(18, 'TCG-USR-012', 'ORDER', 'TCG-ORD-015', 'Bạn đã đặt đơn hàng thành công', '2026-07-07 18:01:19'),
(19, 'TCG-USR-012', 'ORDER', 'TCG-ORD-016', 'Bạn đã đặt đơn hàng thành công', '2026-07-07 18:26:06'),
(20, 'TCG-USR-012', 'ORDER', 'TCG-ORD-017', 'Bạn đã đặt đơn hàng thành công', '2026-07-07 18:32:24'),
(21, 'TCG-USR-012', 'UPDATE_PROFILE', NULL, 'Bạn vừa cập nhật tên thành \"T1 Keria\" và số điện thoại thành \"0809090809\"', '2026-07-07 18:39:34'),
(22, 'TCG-USR-012', 'ADDRESS', 'ADDR-1783424675449-608', 'Bạn đã thêm địa chỉ mới', '2026-07-07 18:44:35'),
(23, 'TCG-USR-012', 'UPDATE_AVATAR', NULL, 'Bạn đã cập nhật ảnh đại diện', '2026-07-07 18:46:00'),
(24, 'TCG-USR-012', 'UPDATE_PROFILE', NULL, 'Bạn vừa cập nhật số điện thoại thành \"\"', '2026-07-07 23:00:24'),
(25, 'TCG-USR-012', 'UPDATE_PROFILE', NULL, 'Bạn vừa cập nhật số điện thoại thành \"0908090908\"', '2026-07-07 23:06:01'),
(26, 'TCG-USR-012', 'ADDRESS', 'ADDR-1783440926524-686', 'Bạn đã thêm địa chỉ mới', '2026-07-07 23:15:26'),
(27, 'TCG-USR-012', 'ORDER', 'TCG-ORD-018', 'Bạn đã đặt đơn hàng thành công', '2026-07-07 23:45:22'),
(28, 'TCG-USR-011', 'ORDER', 'TCG-ORD-019', 'Báº¡n Ä‘Ă£ đặt đơn hàng thành công', '2026-07-09 18:49:45'),
(29, 'TCG-USR-011', 'ORDER', 'TCG-ORD-020', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 19:10:40'),
(30, 'TCG-USR-012', 'ORDER', 'TCG-ORD-021', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 19:13:49'),
(31, 'TCG-USR-012', 'ORDER', 'TCG-ORD-022', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 19:31:00'),
(32, 'TCG-USR-012', 'ORDER', 'TCG-ORD-023', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 19:53:36'),
(33, 'TCG-USR-012', 'ORDER', 'TCG-ORD-024', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 20:12:21'),
(34, 'TCG-USR-012', 'ORDER', 'TCG-ORD-025', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 20:57:50'),
(35, 'TCG-USR-012', 'ORDER', 'TCG-ORD-026', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 21:11:22'),
(36, 'TCG-USR-012', 'ORDER', 'TCG-ORD-027', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 21:17:52'),
(37, 'TCG-USR-012', 'ORDER', 'TCG-ORD-028', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 21:25:22'),
(38, 'TCG-USR-013', 'ORDER', 'TCG-ORD-029', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 23:12:20'),
(39, 'TCG-USR-013', 'ORDER', 'TCG-ORD-030', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 23:21:33'),
(40, 'TCG-USR-013', 'ORDER', 'TCG-ORD-031', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 23:35:03'),
(41, 'TCG-USR-013', 'ORDER', 'TCG-ORD-032', 'Bạn đã đặt đơn hàng thành công', '2026-07-09 23:38:46'),
(42, 'TCG-USR-013', 'ADDRESS', 'ADDR-1783679771564-366', 'Bạn đã thêm địa chỉ mới', '2026-07-10 17:36:11'),
(43, 'TCG-USR-013', 'ORDER', 'TCG-ORD-033', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 18:04:32'),
(44, 'TCG-USR-013', 'ORDER', 'TCG-ORD-033', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 18:08:26'),
(45, 'TCG-USR-013', 'ORDER', 'TCG-ORD-034', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 18:08:42'),
(46, 'TCG-USR-013', 'ORDER', 'TCG-ORD-033', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 18:21:18'),
(47, 'TCG-USR-013', 'ORDER', 'TCG-ORD-033', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 18:21:18'),
(48, 'TCG-USR-013', 'ORDER', 'TCG-ORD-034', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 18:29:05'),
(49, 'TCG-USR-013', 'ORDER', 'TCG-ORD-034', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 18:29:05'),
(50, 'TCG-USR-013', 'ORDER', 'TCG-ORD-034', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 18:32:59'),
(51, 'TCG-USR-013', 'ORDER', 'TCG-ORD-029', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 18:41:08'),
(52, 'TCG-USR-013', 'ORDER', 'TCG-ORD-030', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 18:47:53'),
(53, 'TCG-USR-013', 'ORDER', 'TCG-ORD-031', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 19:15:08'),
(54, 'TCG-USR-013', 'ORDER', 'TCG-ORD-032', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 19:17:53'),
(55, 'TCG-USR-013', 'ORDER', 'TCG-ORD-033', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 19:19:23'),
(56, 'TCG-USR-013', 'ORDER', 'TCG-ORD-029', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 19:28:08'),
(57, 'TCG-USR-013', 'ORDER', 'TCG-ORD-030', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 19:30:51'),
(58, 'TCG-USR-013', 'ORDER', 'TCG-ORD-031', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 19:35:58'),
(59, 'TCG-USR-013', 'ORDER', 'TCG-ORD-029', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 19:38:18'),
(60, 'TCG-USR-013', 'ORDER', 'TCG-ORD-029', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 19:41:09'),
(61, 'TCG-USR-013', 'ORDER', 'TCG-ORD-029', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 19:43:15'),
(62, 'TCG-USR-013', 'ORDER', 'TCG-ORD-029', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 19:44:57'),
(63, 'TCG-USR-013', 'ORDER', 'TCG-ORD-030', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 19:45:50'),
(64, 'TCG-USR-013', 'ORDER', 'TCG-ORD-031', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 19:51:11'),
(65, 'TCG-USR-013', 'ORDER', 'TCG-ORD-032', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 20:29:30'),
(66, 'TCG-USR-013', 'ADDRESS', 'ADDR-1783690888363-420', 'Bạn đã thêm địa chỉ mới', '2026-07-10 20:41:28'),
(67, 'TCG-USR-013', 'ORDER', 'TCG-ORD-033', 'Bạn đã đặt đơn hàng thành công', '2026-07-10 20:42:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_addresses`
--

CREATE TABLE `user_addresses` (
  `address_id` varchar(20) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `recipient_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user_addresses`
--

INSERT INTO `user_addresses` (`address_id`, `user_id`, `address`, `recipient_name`, `phone_number`, `is_default`, `created_at`, `updated_at`) VALUES
('ADDR-1772283059235-3', 'TCG-USR-010', 'nb20a, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'Burh bruqhs', '090807090', 1, '2026-02-28 19:50:59', '2026-07-01 18:28:20'),
('ADDR-1783440926524-6', 'TCG-USR-012', 'k1, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'T1 Keria', '6454048484', 1, '2026-07-07 23:15:26', '2026-07-07 23:15:26'),
('ADDR-1783679771564-3', 'TCG-USR-013', '120 yên lãng, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'tày tày', '0809069032', 1, '2026-07-10 17:36:11', '2026-07-10 17:36:11'),
('ADDR-1783690888363-4', 'TCG-USR-013', '120 an lieenxg, Xã Đông Thạnh, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam', 'tày tày', '0809069032', 0, '2026-07-10 20:41:28', '2026-07-10 20:41:28'),
('TCG-ADR-001', 'TCG-USR-009', '123 Đường số 1, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', NULL, NULL, 0, '2026-02-26 21:36:50', '2026-02-26 21:36:50'),
('TCG-ADR-002', 'TCG-USR-011', '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', NULL, NULL, 1, '2026-02-26 21:36:50', '2026-07-05 19:22:02'),
('TCG-ADR-003', 'TCG-USR-010', '456 Lê Ba Chấm, Phường Chấm Hỏi, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam', NULL, NULL, 0, '2026-02-26 21:36:50', '2026-07-01 18:28:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_eco_infos`
--

CREATE TABLE `user_eco_infos` (
  `eco_info_id` varchar(20) NOT NULL,
  `eco_total` float NOT NULL,
  `eco_orders_total` int(11) NOT NULL,
  `user_id` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user_eco_infos`
--

INSERT INTO `user_eco_infos` (`eco_info_id`, `eco_total`, `eco_orders_total`, `user_id`) VALUES
('TCG-UEC-013', 4840000, 2, 'TCG-USR-013');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `variants`
--

CREATE TABLE `variants` (
  `variant_id` varchar(20) NOT NULL,
  `product_id` varchar(20) NOT NULL,
  `size_id` varchar(20) DEFAULT NULL,
  `color_id` varchar(20) DEFAULT NULL,
  `price` float NOT NULL,
  `stock` int(11) NOT NULL,
  `create_at` datetime NOT NULL,
  `update_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `variants`
--

INSERT INTO `variants` (`variant_id`, `product_id`, `size_id`, `color_id`, `price`, `stock`, `create_at`, `update_at`) VALUES
('TCG-VAR-001', 'TCG-PRO-001', NULL, 'TCG-COL-003', 1500000, 150, '2025-10-01 13:00:00', '2025-10-01 13:00:00'),
('TCG-VAR-002', 'TCG-PRO-001', NULL, 'TCG-COL-004', 1550000, 80, '2025-10-01 13:00:00', '2025-10-01 13:00:00'),
('TCG-VAR-003', 'TCG-PRO-001', NULL, 'TCG-COL-001', 1580000, 56, '2025-10-01 13:00:00', '2025-10-01 13:00:00'),
('TCG-VAR-004', 'TCG-PRO-001', NULL, 'TCG-COL-002', 1600000, 40, '2025-10-01 13:00:00', '2025-10-01 13:00:00'),
('TCG-VAR-005', 'TCG-PRO-002', NULL, 'TCG-COL-003', 2000000, 100, '2025-10-02 13:00:00', '2025-10-02 13:00:00'),
('TCG-VAR-006', 'TCG-PRO-002', NULL, 'TCG-COL-004', 2050000, 70, '2025-10-02 13:00:00', '2025-10-02 13:00:00'),
('TCG-VAR-007', 'TCG-PRO-002', NULL, 'TCG-COL-005', 1980000, 90, '2025-10-02 13:00:00', '2025-10-02 13:00:00'),
('TCG-VAR-008', 'TCG-PRO-004', NULL, 'TCG-COL-003', 2500000, 80, '2025-10-04 13:00:00', '2025-10-04 13:00:00'),
('TCG-VAR-009', 'TCG-PRO-004', NULL, 'TCG-COL-004', 2550000, 50, '2025-10-04 13:00:00', '2025-10-04 13:00:00'),
('TCG-VAR-010', 'TCG-PRO-004', NULL, 'TCG-COL-001', 2600000, 30, '2025-10-04 13:00:00', '2025-10-04 13:00:00'),
('TCG-VAR-011', 'TCG-PRO-003', 'TCG-SIZ-001', NULL, 620000, 58, '2025-10-03 13:00:00', '2025-10-03 13:00:00'),
('TCG-VAR-012', 'TCG-PRO-003', 'TCG-SIZ-002', NULL, 780000, 197, '2025-10-03 13:00:00', '2025-10-03 13:00:00'),
('TCG-VAR-013', 'TCG-PRO-003', 'TCG-SIZ-003', NULL, 800000, 250, '2025-10-03 13:00:00', '2025-10-03 13:00:00'),
('TCG-VAR-014', 'TCG-PRO-003', 'TCG-SIZ-004', NULL, 820000, 120, '2025-10-03 13:00:00', '2025-10-03 13:00:00'),
('TCG-VAR-015', 'TCG-PRO-003', 'TCG-SIZ-005', NULL, 1050000, 40, '2025-10-03 13:00:00', '2025-10-03 13:00:00'),
('TCG-VAR-016', 'TCG-PRO-005', 'TCG-SIZ-001', NULL, 850000, 49, '2025-10-05 13:00:00', '2025-10-05 13:00:00'),
('TCG-VAR-017', 'TCG-PRO-005', 'TCG-SIZ-002', NULL, 900000, 178, '2025-10-05 13:00:00', '2025-10-05 13:00:00'),
('TCG-VAR-018', 'TCG-PRO-005', 'TCG-SIZ-003', NULL, 1200000, 220, '2025-10-05 13:00:00', '2025-10-05 13:00:00'),
('TCG-VAR-019', 'TCG-PRO-005', 'TCG-SIZ-004', NULL, 1250000, 90, '2025-10-05 13:00:00', '2025-10-05 13:00:00'),
('TCG-VAR-020', 'TCG-PRO-005', 'TCG-SIZ-005', NULL, 1300000, 0, '2025-10-05 13:00:00', '2025-10-05 13:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vouchers`
--

CREATE TABLE `vouchers` (
  `voucher_id` varchar(20) NOT NULL,
  `voucher_code` varchar(50) NOT NULL,
  `voucher_type` varchar(50) NOT NULL,
  `voucher_value` float NOT NULL,
  `min_order_value` float DEFAULT NULL,
  `max_discount` float DEFAULT NULL,
  `voucher_usage_time` int(11) NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `create_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vouchers`
--

INSERT INTO `vouchers` (`voucher_id`, `voucher_code`, `voucher_type`, `voucher_value`, `min_order_value`, `max_discount`, `voucher_usage_time`, `start_date`, `end_date`, `create_at`, `update_at`) VALUES
('TCG-VCH-001', 'GAMING50', 'Phần trăm', 10, 1000000, 500000, 100, '2025-10-01 00:00:00', '2025-12-31 23:59:59', '2025-10-01 14:00:00', '2025-10-01 14:00:00'),
('TCG-VCH-002', 'JERSEY100K', 'Cố định', 100000, 500000, NULL, 50, '2025-10-02 00:00:00', '2025-11-30 23:59:59', '2025-10-02 14:00:00', '2025-10-02 14:00:00'),
('TCG-VCH-003', 'NEWUSER20', 'Phần trăm', 20, 0, 200000, 184, '2025-10-03 00:00:00', '2026-12-31 23:59:59', '2025-10-03 14:00:00', '2025-10-03 14:00:00'),
('TCG-VCH-004', 'T1FAN2025', 'Cố định', 150000, 800000, NULL, 29, '2025-10-04 00:00:00', '2026-12-31 23:59:59', '2025-10-04 14:00:00', '2025-10-04 14:00:00'),
('TCG-VCH-005', 'GEAR300K', 'Cố định', 300000, 2000000, NULL, 20, '2025-10-05 00:00:00', '2025-11-15 23:59:59', '2025-10-05 14:00:00', '2025-10-05 14:00:00'),
('TCG-VCH-006', 'FREESHIPMAX', 'Miễn phí vận chuyển', 100, 500000, 50000, 85, '2026-07-05 00:00:00', '2026-12-31 23:59:59', '2026-07-05 18:56:30', '2026-07-05 18:56:30'),
('TCG-VCH-007', 'GIAMSHIP15K', 'Giảm phí vận chuyển', 15000, 200000, NULL, 200, '2026-07-05 00:00:00', '2026-12-31 23:59:59', '2026-07-05 18:56:30', '2026-07-05 18:56:30');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`blog_id`);

--
-- Chỉ mục cho bảng `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`blog_cate_id`);

--
-- Chỉ mục cho bảng `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`brand_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`cate_id`);

--
-- Chỉ mục cho bảng `colors`
--
ALTER TABLE `colors`
  ADD PRIMARY KEY (`color_id`);

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`cmt_id`);

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`noti_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Chỉ mục cho bảng `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`detail_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Chỉ mục cho bảng `responses`
--
ALTER TABLE `responses`
  ADD PRIMARY KEY (`response_id`),
  ADD KEY `fk_responses_user` (`user_id`),
  ADD KEY `idx_parent` (`parent_response_id`);

--
-- Chỉ mục cho bảng `site_ratings`
--
ALTER TABLE `site_ratings`
  ADD PRIMARY KEY (`rating_id`);

--
-- Chỉ mục cho bảng `sizes`
--
ALTER TABLE `sizes`
  ADD PRIMARY KEY (`size_id`);

--
-- Chỉ mục cho bảng `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`sc_id`);

--
-- Chỉ mục cho bảng `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`team_id`);

--
-- Chỉ mục cho bảng `teams_players`
--
ALTER TABLE `teams_players`
  ADD PRIMARY KEY (`player_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Chỉ mục cho bảng `user_activities`
--
ALTER TABLE `user_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_time` (`user_id`,`created_at`);

--
-- Chỉ mục cho bảng `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `user_eco_infos`
--
ALTER TABLE `user_eco_infos`
  ADD PRIMARY KEY (`eco_info_id`);

--
-- Chỉ mục cho bảng `variants`
--
ALTER TABLE `variants`
  ADD PRIMARY KEY (`variant_id`);

--
-- Chỉ mục cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`voucher_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `user_activities`
--
ALTER TABLE `user_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `responses`
--
ALTER TABLE `responses`
  ADD CONSTRAINT `fk_parent_response` FOREIGN KEY (`parent_response_id`) REFERENCES `responses` (`response_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_responses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `user_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
