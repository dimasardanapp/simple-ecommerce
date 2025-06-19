import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = [];

  const showPages = new Set<number>();
  showPages.add(1);
  showPages.add(totalPages);
  showPages.add(currentPage);
  if (currentPage > 1) showPages.add(currentPage - 1);
  if (currentPage < totalPages) showPages.add(currentPage + 1);

  const pagesToShow = Array.from(showPages).sort((a, b) => a - b);

  for (let i = 0; i < pagesToShow.length - 1; i++) {
    pageNumbers.push(pagesToShow[i]);
    if (pagesToShow[i + 1] - pagesToShow[i] > 1) {
      pageNumbers.push("...");
    }
  }

  if (
    pagesToShow.length > 0 &&
    pagesToShow[pagesToShow.length - 1] !== pageNumbers[pageNumbers.length - 1]
  ) {
    pageNumbers.push(pagesToShow[pagesToShow.length - 1]);
  }

  return (
    <div className="flex justify-center mt-4">
      <nav
        className="inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <span className="sr-only">Previous</span>
          &larr;
        </button>

        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            ) : (
              <button
                onClick={() => typeof page === "number" && onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === page
                    ? "z-10 bg-foreground border-foreground text-background"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <span className="sr-only">Next</span>
          &rarr;
        </button>
      </nav>
    </div>
  );
}
