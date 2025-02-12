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

  // Cookie và các header cần thiết, lấy từ api trả về
  const headers = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
    "Cache-Control": "max-age=0",
    Cookie:
      "_tccl_visitor=e0f867a7-609c-4b48-840d-ffcb055ecd29; XSRF-TOKEN=eyJpdiI6IkxrN05uTUNHbGlWNWd6eGU0VjRGYVE9PSIsInZhbHVlIjoic1BiMW1SZGhseGVCL044UVZtYldUbkJqLyszQWhGRlp6djVTOGhHVXdROU1oOXRub3gvSzNWKy9QZGtSRURZTVp1dFQ3MVZLYnU3eWJXNjUwaGpzWVYxamhmcFdtZ21Hc2dyZ2Jxc0tDOUFlZnpkdzFtaDdRUlpSRGtRSUk5cjAiLCJtYWMiOiIzYzM0MTA5NzgxMWM3MTY2NmZlNzIxYWZlMmY0MDhhNjI0ZmM3ZDMyZTY1MjE5ZGVkZDFhNTcxODZmYjhhNTIwIiwidGFnIjoiIn0%3D; conduongbachunet_session=eyJpdiI6IkxwdWt0c00zK1FmQVMySlhGbGJlN3c9PSIsInZhbHVlIjoiWWdqQUdqVnpEdmdwcEVrM3FsS0FaU1JIL1JiM2VCbTJvRnVrd2pvN2RHRzBucW1tbno5eDdZYXdCZWMwcDJLYU40UXZEK1g2Q1UxejltK0tnRGE2Y1J5b09rb0R5eXg3aGJKNkd3dHgzdm1nZEl5Z3J2eDlkT1dCWk9ydDBwMTAiLCJtYWMiOiJiZmY3NmVhN2RkZDdkMmIzYzQxZjZmNTAzNDQ1ZjE3NGMxYTUwMWY2MGY3YWJjYTUzYmU0OTRmMGJmZDgzNzI4IiwidGFnIjoiIn0%3D",
    Referer: "https://conduongbachu.net/",
    "Sec-CH-UA":
      '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
  };

  try {
    // Gửi request với headers và cookies đã cấu hình
    const response = await axios.get(url, { headers });
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
