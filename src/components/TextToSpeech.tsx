"use client";

import { useState, useEffect } from "react";

interface TextToSpeechProps {
  content: string; // Nhận content dưới dạng HTML
}

export default function TextToSpeech({ content }: TextToSpeechProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false); // Trạng thái đang nói hay không
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  ); // Đối tượng utterance đang phát
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Chỉ mục đoạn văn bản hiện tại
  const chunkSize = 4000; // Kích thước đoạn văn bản nhỏ (số ký tự tối đa)

  useEffect(() => {
    // Tải danh sách giọng nói khi ứng dụng khởi động
    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices();
      setVoices(allVoices);
    };

    // Chạy hàm loadVoices khi giọng nói đã được tải
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }, []);

  // Hàm chuyển HTML thành text thuần
  const htmlToText = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || ""; // Lấy văn bản thuần từ thẻ body
  };

  // Chia văn bản thành các đoạn nhỏ
  const chunkText = (text: string, size: number) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  };

  // Hàm phát văn bản từng đoạn
  const playTextChunks = (chunks: string[], index: number) => {
    if (index >= chunks.length) {
      setIsSpeaking(false); // Kết thúc khi không còn đoạn nào
      return;
    }

    const newUtterance = new SpeechSynthesisUtterance(chunks[index]);
    newUtterance.lang = "vi-VN";
    const vietnameseVoice =
      voices.find((voice) => voice.lang === "vi-VN") ?? null;
    newUtterance.voice = vietnameseVoice;

    newUtterance.onend = () => {
      // Sau khi phát xong đoạn hiện tại, phát đoạn tiếp theo
      setCurrentIndex(index + 1);
      playTextChunks(chunks, index + 1);
    };

    // Lưu đối tượng utterance để có thể tạm dừng khi cần
    setUtterance(newUtterance);
    speechSynthesis.speak(newUtterance); // Phát đoạn hiện tại
  };

  const handlePlayPause = () => {
    const text = htmlToText(content); // Chuyển HTML thành text
    const chunks = chunkText(text, chunkSize); // Chia văn bản thành các đoạn nhỏ

    if (!isSpeaking) {
      setIsSpeaking(true);
      playTextChunks(chunks, currentIndex); // Bắt đầu phát từ đoạn hiện tại
    } else if (utterance) {
      // Nếu đang phát, tạm dừng và lưu trạng thái
      speechSynthesis.pause();
      setIsSpeaking(false);
    } else {
      // Nếu đã tạm dừng, tiếp tục phát lại từ đoạn đã dừng
      setIsSpeaking(true);
      speechSynthesis.resume(); // Tiếp tục phát
    }
  };

  const handleStop = () => {
    // Dừng hẳn việc phát âm thanh
    if (utterance) {
      speechSynthesis.cancel(); // Hủy bỏ việc phát âm thanh
      setIsSpeaking(false); // Cập nhật trạng thái
      setCurrentIndex(0); // Reset lại chỉ mục đoạn văn bản
      setUtterance(null); // Reset đối tượng utterance
    }
  };

  return (
    <div className="flex justify-center items-center">
      <button onClick={handlePlayPause}>
        {isSpeaking ? (
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
              d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        ) : (
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
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
            />
          </svg>
        )}
        {/* Hiển thị nút play/pause */}
      </button>
      <div className="mx-2">Tính năng thử nghiệm</div>
      <button onClick={handleStop}>
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
            d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
          />
        </svg>
      </button>
      {/* Nút dừng âm thanh */}
    </div>
  );
}
