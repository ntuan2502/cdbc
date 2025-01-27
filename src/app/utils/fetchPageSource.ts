// src/app/utils/fetchPageSource.ts
import * as cheerio from "cheerio";
import axios from "axios";

// Định nghĩa kiểu dữ liệu trả về
interface PageSource {
  title: string;
  content: string;
  time: string;
  number: number; // Thay chapterNumber thành number
}

// Hàm fetch source của trang từ URL và lấy dữ liệu cần thiết
export const fetchPageSource = async (slug: string): Promise<PageSource> => {
  const url = `https://conduongbachu.net/chapter/${slug}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data); // Load HTML vào cheerio để dễ dàng truy xuất DOM

    // Lấy title từ class "chapter-title"
    const title = $(".chapter-title").text().trim();

    // Sử dụng biểu thức chính quy để lấy số chương và chuyển thành kiểu number
    const numberMatch = title.match(/Chương (\d+):/);
    const number = numberMatch ? parseInt(numberMatch[1], 10) : NaN; // Chuyển thành number và đặt tên là "number"

    // Lấy toàn bộ thẻ div có id "chapter-content" bao gồm cả thẻ mở và đóng
    const content = $.html("#chapter-content") || ""; // Lấy toàn bộ thẻ div (bao gồm cả thẻ mở và đóng)

    // Lấy thời gian tạo từ phần tử chứa class "fa-regular fa-clock"
    const time = $(".fa-regular.fa-clock").parent().text().trim();

    return { title, content, time, number }; // Trả về "number" thay vì "chapterNumber"
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Nếu lỗi là một instance của Error, sử dụng message
      throw new Error(`Lỗi khi fetch dữ liệu: ${error.message}`);
    } else {
      // Nếu không phải lỗi Error, ném lỗi chung
      throw new Error("Không thể lấy dữ liệu từ trang");
    }
  }
};
