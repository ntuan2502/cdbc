import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

// Hàm để hiển thị thời gian dạng "1 phút trước", "1 giờ trước", "1 ngày trước"
export default function formatRelativeTime(date: string): string {
  const parsedDate = new Date(date);
  return formatDistanceToNow(parsedDate, { addSuffix: true, locale: vi }); // Sử dụng locale tiếng Việt
}
