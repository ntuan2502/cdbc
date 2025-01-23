"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Chapter } from "@/types/chapter";
import { Spinner } from "@heroui/react";
import { formatDate } from "../utils/formatDate";
import ChapterNavigation from "../components/ChapterNavigation";

const fetchChapterData = async (slug: string, API_URL: string) => {
  const response = await fetch(`${API_URL}/articles?filters[slug][$eq]=${slug}&`);
  const data = await response.json();
  return data.data[0] || null;
};

const fetchAdjacentChapter = async (number: number, direction: "previous" | "next", API_URL: string) => {
  const response = await fetch(
    `${API_URL}/articles?filters[number][$eq]=${number + (direction === "previous" ? -1 : 1)}&fields=title,slug`
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

  const fetchData = useCallback(async () => {
    if (!slug) return;

    const currentChapter = await fetchChapterData(slug, API_URL);
    setChapter(currentChapter);

    if (currentChapter) {
      const content = currentChapter.content;
      setWordCount(countWords(content));

      const previous = await fetchAdjacentChapter(currentChapter.number, "previous", API_URL);
      const next = await fetchAdjacentChapter(currentChapter.number, "next", API_URL);

      setPreviousChapter(previous);
      setNextChapter(next);
    }
  }, [slug, API_URL]);

  useEffect(() => {
    fetchData();
  }, [slug, fetchData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(Boolean).length;
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
        <p>Số lượng từ trong chương: {wordCount}</p>
        <p>Thời gian: {formatDate(chapter.createdAt)}</p>
      </div>

      <div dangerouslySetInnerHTML={{ __html: chapter.content }} />

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
