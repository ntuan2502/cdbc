"use client"; // Đánh dấu đây là client component

import { useEffect, useState, useCallback } from "react";
import { Chapter } from "@/types/chapter"; // Import type Chapter
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
import { useRouter } from "next/navigation"; // Import useRouter từ next/navigation

export default function Home() {
  const router = useRouter();

  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([]); // Lưu trữ chương đã lọc
  const [currentPage, setCurrentPage] = useState(1); // Lưu trữ trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Lưu trữ tổng số trang
  const [error, setError] = useState<string | null>(null); // Lưu trữ thông báo lỗi
  const [isMounted, setIsMounted] = useState(false); // Cờ để theo dõi component đã mount

  const API_URL = process.env.NEXT_PUBLIC_API_URL; // Lấy URL API từ environment variable
  const chaptersPerPage = 20; // Số chương hiển thị trên mỗi trang

  // Sử dụng useEffect để lấy tham số trang từ URL sau khi component đã mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageQuery = parseInt(urlParams.get("p") || "1");
    setCurrentPage(pageQuery);
    setIsMounted(true); // Đánh dấu component đã mount
  }, []);

  const fetchChapters = useCallback(
    async (page: number) => {
      try {
        const response = await fetch(
          `${API_URL}/articles?fields=title,slug,number,time&sort=number:DESC&pagination[page]=${page}&pagination[pageSize]=${chaptersPerPage}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chapters");
        }

        const data = await response.json();

        const chaptersToStore = data.data.map((chapter: Chapter) => ({
          title: chapter.title,
          slug: chapter.slug,
          number: chapter.number,
          time: chapter.time,
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

  // Gọi API khi trang thay đổi
  useEffect(() => {
    if (isMounted) {
      fetchChapters(currentPage);
    }
  }, [currentPage, fetchChapters, isMounted]);

  // Cập nhật URL khi thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Cập nhật URL với tham số 'p' mới
    router.push(`?p=${page}`); // Cập nhật URL mà không reload trang
  };

  if (!isMounted) return null; // Tránh render trước khi component được mount

  return (
    <div>
      {/* Hiển thị thông báo lỗi nếu có lỗi */}
      {error && <div className="text-red-500 text-center my-4">{error}</div>}

      {/* Hiển thị Pagination nếu có chương */}
      {filteredChapters.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Hiển thị bảng nếu có chương */}
      {filteredChapters.length > 0 ? (
        <Table aria-label="Danh sách chương">
          <TableHeader>
            <TableColumn>Danh sách chương</TableColumn>
          </TableHeader>
          <TableBody items={filteredChapters}>
            {(chapter) => {
              // Kiểm tra thời gian của chương
              const isNew =
                new Date().getTime() - new Date(chapter.time).getTime() <
                24 * 60 * 60 * 1000; // Nếu mới hơn 1 ngày

              return (
                <TableRow key={chapter.slug}>
                  <TableCell>
                    <Link href={`/${chapter.slug}`}>
                      <div className="font-semibold">
                        {chapter.title}
                        {isNew && (
                          <span className="text-red-500 font-bold blink-effect mx-1">
                            NEW{" "}
                          </span>
                        )}
                      </div>
                      <Tooltip
                        showArrow={true}
                        placement="top-start"
                        content={formatDate(chapter.time)}
                      >
                        <div>{formatRelativeTime(chapter.time)}</div>
                      </Tooltip>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            }}
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
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
