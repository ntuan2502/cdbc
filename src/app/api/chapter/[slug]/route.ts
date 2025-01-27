// src/app/api/chapter/[slug]/route.ts
import { NextResponse } from "next/server";
import { fetchPageSource } from "@/app/utils/fetchPageSource"; // Import hàm fetchPageSource từ utils
import axios from "axios"; // Import axios

const API_URL = process.env.NEXT_PUBLIC_API_URL as string; // Lấy API_URL từ môi trường

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // Đợi params trước khi sử dụng
  const { slug } = await params;

  try {
    // Lấy source của trang từ hàm fetchPageSource
    const { title, number, content, time } = await fetchPageSource(slug);

    // Dữ liệu cần gửi lên API
    const data = {
      data: {
        title,
        slug,
        number,
        author: "rvvxwpb04uou7lh2t6793yff",
        category: "vqlp10gd13lcwe43pfxhx13d",
        content,
        time,
        locale: "en",
      },
    };

    // Đẩy dữ liệu vào API /articles với giao thức POST sử dụng axios
    const response = await axios.post(`${API_URL}/articles`, data, {
      headers: {
        "Content-Type": "application/json", // Đảm bảo gửi dữ liệu dưới dạng JSON
      },
    });
    // Trả về kết quả từ API
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error response: ", error.response?.data);
      return NextResponse.json(
        { error: error.response?.data || error.message },
        { status: 500 }
      );
    } else {
      console.error("General error: ", error);
      return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
    }
  }
}
