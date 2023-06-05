import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import styles from "./pagination.module.scss";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(page);
  const [inputPage, setInputPage] = useState(page.toString());

  const handlePreviousPage = () => {
    const newPage = currentPage - 1;
    if (newPage >= 1) {
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  const handleNextPage = () => {
    const newPage = currentPage + 1;
    if (newPage <= totalPages) {
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  const handleInputPage = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputPage(value);
  };

  const handleGoToPage = () => {
    const newPage = parseInt(inputPage, 10);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleGoToPage();
    }
  };

  return (
    <div className={styles["pagination"]}>
      <button
        className={styles["actionBtn"]}
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
      >
        上一页
      </button>
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        if (
          pageNumber === 1 ||
          pageNumber === totalPages ||
          (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
        ) {
          return (
            <button
              key={index}
              className={styles["pageBtn"]}
              onClick={() => {
                setCurrentPage(pageNumber);
                onPageChange(pageNumber);
              }}
              disabled={currentPage === pageNumber}
            >
              {pageNumber}
            </button>
          );
        } else if (
          pageNumber === currentPage - 3 ||
          pageNumber === currentPage + 3
        ) {
          return <span key={index}>...</span>;
        }
        return null;
      })}
      <button
        className={styles["actionBtn"]}
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        下一页
      </button>
      <input
        className={styles["input"]}
        type="number"
        min="1"
        max={totalPages}
        value={inputPage}
        onChange={handleInputPage}
      />
      <button className={styles["actionBtn"]} onClick={handleGoToPage}>
        跳转
      </button>
    </div>
  );
};

export default Pagination;
