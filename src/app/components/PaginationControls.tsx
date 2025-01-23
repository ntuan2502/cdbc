// components/PaginationControls.tsx
import { Pagination } from "@heroui/react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex-col justify-center items-center my-4 flex space-x-4">
      <Pagination
        showControls
        page={currentPage}
        total={totalPages}
        onChange={onPageChange}
      />
    </div>
  );
};

export default PaginationControls;
