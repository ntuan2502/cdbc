"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Chapter } from "@/types/chapter";
import { Button, Spinner } from "@heroui/react";
import { formatDate } from "../utils/formatDate";

export default function ChapterPage() {
  const router = useRouter();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [previousChapter, setPreviousChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const { slug } = useParams();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [wordCount, setWordCount] = useState(0); // Thêm state để lưu số lượng từ

  useEffect(() => {
    if (!slug) return;

    const fetchChapter = async () => {
      const response = await fetch(
        `${API_URL}/articles?filters[slug][$eq]=${slug}&`
      );
      const data = await response.json();

      if (data.data.length > 0) {
        const currentChapter = data.data[0];
        setChapter(currentChapter);

        // Đếm số lượng từ trong nội dung chapter
        const content = currentChapter.content;
        const wordCount = countWords(content); // Tính số lượng từ
        setWordCount(wordCount); // Lưu vào state

        const currentNumber = currentChapter.number;

        // Fetch chương trước
        const previousResponse = await fetch(
          `${API_URL}/articles?filters[number][$eq]=${
            currentNumber - 1
          }&fields=title,slug`
        );
        const previousData = await previousResponse.json();
        if (previousData.data.length > 0) {
          setPreviousChapter(previousData.data[0]);
        }

        // Fetch chương sau
        const nextResponse = await fetch(
          `${API_URL}/articles?filters[number][$eq]=${
            currentNumber + 1
          }&fields=title,slug`
        );
        const nextData = await nextResponse.json();
        if (nextData.data.length > 0) {
          setNextChapter(nextData.data[0]);
        }
      }
    };

    fetchChapter();
  }, [slug, API_URL]);

  const countWords = (text: string): number => {
    // Sử dụng biểu thức regular để tách các từ
    const words = text?.trim().split(/\s+/);
    return words?.filter(Boolean).length || 0; // Đảm bảo không đếm các khoảng trắng liên tiếp
  };

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
        <Button
          isDisabled={previousChapter ? false : true}
          color="primary"
          onPress={() => {
            if (previousChapter) router.push(`/${previousChapter.slug}`);
          }}
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
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          Chương trước
        </Button>
        <Button
          isDisabled={nextChapter ? false : true}
          color="primary"
          onPress={() => {
            if (nextChapter) router.push(`/${nextChapter.slug}`);
          }}
        >
          Chương kế
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
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Button>
      </div>

      <div className="flex justify-center items-center text-center text-xl font-semibold my-4">
        {chapter.title}
      </div>

      <div className="my-4 text-center">
        <p>Số lượng từ trong chương: {wordCount}</p>
        <p>Thời gian: {formatDate(chapter.createdAt)}</p>
      </div>

      <div dangerouslySetInnerHTML={{ __html: chapter.content }} />

      <div className="flex justify-between my-2">
        <Button
          isDisabled={previousChapter ? false : true}
          color="primary"
          onPress={() => {
            if (previousChapter) router.push(`/${previousChapter.slug}`);
          }}
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
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          Chương trước
        </Button>
        <Button
          isDisabled={nextChapter ? false : true}
          color="primary"
          onPress={() => {
            if (nextChapter) router.push(`/${nextChapter.slug}`);
          }}
        >
          Chương kế
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
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
