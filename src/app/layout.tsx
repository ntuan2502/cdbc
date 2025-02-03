import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import HeroNavbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "CON ĐƯỜNG BÁ CHỦ",
  description:
    "Là thủ khoa với điểm thi đại học cao nhất toàn quốc, lại trở thành một phế vật ở thế giới tu chân tàn khốc, nơi sức mạnh chính là luật lệ, cá lớn nuốt cá bé, kẻ yếu chỉ như con kiến không có tiếng nói, bị người người giẫm đạp. Hai mắt mù loà, thân phận hèn kém, vạn địch vây quanh...thiếu niên trong tuyệt cảnh thức tỉnh Bá Chủ Hệ Thống, từ đó đặt chân vào lằn ranh sinh tử trên con đường tu chân rực rỡ sắc màu. Vạn tộc tung hoành, thiên kiêu như nấm, giai nhân làm bạn, khoái ý ân cừu, hành tẩu giang hồ, nhất thống thiên địa...viết nên một khúc truyền kỳ bất hủ. Con Đường Bá Chủ là truyện Huyền Huyễn, Tiên Hiệp... được viết ra nhằm mục đích giải trí. Tất cả nội dung, tên nhân vật, địa danh, tôn giáo...trong truyện đều là hư cấu, nếu có lỡ trùng hợp xin rộng lượng bỏ qua.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <HeroNavbar />
          <div className="mx-auto gap-4 text-base md:gap-5 lg:gap-6 md:max-w-3xl min-h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
