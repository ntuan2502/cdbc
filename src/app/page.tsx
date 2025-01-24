"use client"; // Đánh dấu đây là client component

import { useEffect, useState, useCallback } from "react";
import { Chapter } from "../types/chapter"; // Import type Chapter
import Link from "next/link"; // Link từ next/link
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@heroui/react";
import { formatDate } from "./utils/formatDate";
import formatRelativeTime from "./utils/formatRelativeTime";
import PaginationControls from "./components/PaginationControls"; // Import PaginationControls

export default function Home() {
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([]); // Lưu trữ chương đã lọc
  const [currentPage, setCurrentPage] = useState(1); // Lưu trữ trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Lưu trữ tổng số trang
  const [error, setError] = useState<string | null>(null); // Lưu trữ thông báo lỗi

  const API_URL = process.env.NEXT_PUBLIC_API_URL; // Lấy URL API từ environment variable
  const chaptersPerPage = 20; // Số chương hiển thị trên mỗi trang

  // Sử dụng useCallback để tối ưu hóa việc tải dữ liệu
  const fetchChapters = useCallback(
    async (page: number) => {
      try {
        const response = await fetch(
          `${API_URL}/articles?fields=title,slug,number,createdAt&sort=number:DESC&pagination[page]=${page}&pagination[pageSize]=${chaptersPerPage}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chapters");
        }

        const data = await response.json();

        const chaptersToStore = data.data.map((chapter: Chapter) => ({
          title: chapter.title,
          slug: chapter.slug,
          number: chapter.number,
          createdAt: chapter.createdAt,
        }));

        setFilteredChapters(chaptersToStore); // Cập nhật các chương
        setTotalPages(data.meta.pagination.pageCount); // Cập nhật thông tin phân trang
        setError(null); // Reset lỗi nếu thành công
      } catch (error) {
        console.error("Error fetching chapters:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu, vui lòng thử lại!"); // Thiết lập thông báo lỗi
      }
    },
    [API_URL]
  );

  useEffect(() => {
    fetchChapters(currentPage); // Gọi API khi trang thay đổi
  }, [currentPage, fetchChapters]);

  return (
    <div>
      {/* Hiển thị thông báo lỗi nếu có lỗi */}
      {error && <div className="text-red-500 text-center my-4">{error}</div>}

      {/* Hiển thị Pagination nếu có chương */}
      {filteredChapters.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Hiển thị bảng nếu có chương */}
      {filteredChapters.length > 0 ? (
        <Table aria-label="Danh sách chương">
          <TableHeader>
            <TableColumn>Danh sách chương</TableColumn>
          </TableHeader>
          <TableBody items={filteredChapters}>
            {(chapter) => (
              <TableRow key={chapter.slug}>
                <TableCell>
                  <Link href={`/${chapter.slug}`}>
                    <div className="font-semibold">{chapter.title}</div>
                    <Tooltip
                      showArrow={true}
                      placement="top-start"
                      content={formatDate(chapter.createdAt)}
                    >
                      <div>{formatRelativeTime(chapter.createdAt)}</div>
                    </Tooltip>
                  </Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-gray-500 mt-4">
          Không có chương nào.
        </div>
      )}

      {/* Hiển thị Pagination nếu có chương */}
      {filteredChapters.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
