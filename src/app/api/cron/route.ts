// src/app/api/cron/route.ts

import cron from "node-cron";
import axios from "axios";

// Tạo hàm để gọi API
const fetchCategories = async () => {
  try {
    const response = await axios.get(
      "https://cdbc-api.onrender.com/api/categories"
    );

    // Kiểm tra xem response có dữ liệu không
    if (response.data && response.data.data && response.data.data.length > 0) {
      const currentTime = new Date().toLocaleString(); // Lấy thời gian hiện tại dưới dạng chuỗi
      console.log(
        `Time: ${currentTime} - Category: ${response.data.data[0].name}`
      );
    } else {
      console.log("Không có dữ liệu từ API.");
    }
  } catch (error) {
    console.error("Errors:", error);
  }
};

// Thiết lập cron job để gọi API mỗi 10 giây và log thời gian chạy
export const GET = async () => {
  console.log("Cron job bắt đầu chạy...");
  cron.schedule("*/10 * * * * *", () => {
    fetchCategories();
  });

  return new Response("Cron job setup successful", {
    status: 200,
  });
};
