"use client"; // Đảm bảo rằng đây là một component client-side

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Chapter } from "@/types/chapter";
import { Button, Spinner } from "@heroui/react";
import { formatDate } from "@/app/utils/formatDate";
import ChapterNavigation from "@/app/components/ChapterNavigation";
import TextToSpeech from "@/components/TextToSpeech";

// Hàm chuyển đổi lượt thích và lượt đọc thành định dạng K/M
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // Phần triệu
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"; // Phần ngàn
  }
  return num.toString();
};

const fetchChapterData = async (slug: string, API_URL: string) => {
  const response = await fetch(
    `${API_URL}/articles?filters[slug][$eq]=${slug}`
  );
  const data = await response.json();
  return data.data[0] || null;
};

const fetchAdjacentChapters = async (
  number: number,
  direction: "previous" | "next",
  API_URL: string
) => {
  const response = await fetch(
    `${API_URL}/articles?filters[number][$eq]=${
      number + (direction === "previous" ? -1 : 1)
    }&fields=title,slug`
  );
  const data = await response.json();
  return data.data[0] || null;
};

export default function ChapterPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [previousChapter, setPreviousChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [fontSize, setFontSize] = useState<number>(16); // Default font size is 16

  useEffect(() => {
    // Kiểm tra và lấy giá trị fontSize từ localStorage sau khi component mount
    const savedFontSize = localStorage.getItem("fontSize");
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!slug) return;

    const currentChapter = await fetchChapterData(slug, API_URL);
    setChapter(currentChapter);

    if (currentChapter) {
      setWordCount(countWords(currentChapter.content));

      const [previous, next] = await Promise.all([
        fetchAdjacentChapters(currentChapter.number, "previous", API_URL),
        fetchAdjacentChapters(currentChapter.number, "next", API_URL),
      ]);

      setPreviousChapter(previous);
      setNextChapter(next);
    }
  }, [slug, API_URL]);

  useEffect(() => {
    fetchData();
  }, [slug, fetchData]);

  useEffect(() => {
    // Đảm bảo cuộn trang lên đầu sau khi tất cả phần tử đã được render
    setTimeout(() => window.scrollTo(0, 0), 200);
  }, [chapter, previousChapter, nextChapter]);

  const countWords = (text: string | null): number =>
    text ? text.trim().split(/\s+/).filter(Boolean).length : 0;

  const updateFontSize = (delta: number) => {
    const newFontSize = Math.max(12, Math.min(fontSize + delta, 20));
    setFontSize(newFontSize);
    localStorage.setItem("fontSize", newFontSize.toString()); // Lưu lại vào localStorage
  };

  const hasChapterContentId =
    chapter?.content && /id=["']chapter-content["']/.test(chapter.content);

  if (!chapter) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="m-4">
      <div className="flex justify-between my-2">
        <ChapterNavigation
          chapter={previousChapter}
          onPress={(slug) => router.push(`/${slug}`)}
          isDisabled={!previousChapter}
          label="Chương trước"
          iconPath="M15.75 19.5 8.25 12l7.5-7.5"
        />
        <ChapterNavigation
          chapter={nextChapter}
          onPress={(slug) => router.push(`/${slug}`)}
          isDisabled={!nextChapter}
          label="Chương kế"
          iconPath="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </div>

      <div className="flex justify-center items-center text-center text-xl font-semibold my-4">
        {chapter.title}
      </div>

      <div className="my-4 text-center">
        <p>Số chữ: {wordCount}</p>
        <p>Lượt thích: {formatNumber(chapter.likes || 0)}</p>
        <p>Lượt đọc: {formatNumber(chapter.reads || 0)}</p>
        <p>Thời gian: {formatDate(chapter.time)}</p>
        {chapter.update && <p>Cập nhật: {formatDate(chapter.update)}</p>}
      </div>

      <div className="flex justify-center items-center gap-4 my-4">
        <Button
          color="primary"
          size="sm"
          onPress={() => updateFontSize(-1)}
          isDisabled={fontSize <= 12}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"
            />
          </svg>
        </Button>
        <p>{fontSize}</p>
        <Button
          color="primary"
          size="sm"
          onPress={() => updateFontSize(1)}
          isDisabled={fontSize >= 20}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
            />
          </svg>
        </Button>
      </div>

      {chapter.content ? (
        <div>
          <TextToSpeech content={chapter.content} />

          <div
            id="chapter-content"
            style={{ fontSize: `${fontSize}px` }}
            dangerouslySetInnerHTML={{
              __html: hasChapterContentId
                ? chapter.content.replace(
                    /(<div id=["']chapter-content["'])/g,
                    `$1 style="font-size: ${fontSize}px"`
                  )
                : chapter.content,
            }}
          />
        </div>
      ) : (
        <div className="text-center">Không có nội dung</div>
      )}

      <div className="flex justify-between my-2">
        <ChapterNavigation
          chapter={previousChapter}
          onPress={(slug) => router.push(`/${slug}`)}
          isDisabled={!previousChapter}
          label="Chương trước"
          iconPath="M15.75 19.5 8.25 12l7.5-7.5"
        />
        <ChapterNavigation
          chapter={nextChapter}
          onPress={(slug) => router.push(`/${slug}`)}
          isDisabled={!nextChapter}
          label="Chương kế"
          iconPath="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </div>
    </div>
  );
}
