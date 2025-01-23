import { Button } from "@heroui/react";

interface ChapterNavigationProps {
  chapter: { slug: string } | null;
  onPress: (slug: string) => void;
  isDisabled: boolean;
  label: string;
  iconPath: string;
}

const ChapterNavigation = ({
  chapter,
  onPress,
  isDisabled,
  label,
  iconPath,
}: ChapterNavigationProps) => {
  return (
    <Button
      isDisabled={isDisabled}
      color="primary"
      onPress={() => {
        if (chapter) {
          onPress(chapter.slug);
        }
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
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
      {label}
    </Button>
  );
};

export default ChapterNavigation;
