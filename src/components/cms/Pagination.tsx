"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    // Build page numbers with ellipsis
    const getPageNumbers = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            // Show window around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="mt-6 flex items-center justify-center gap-1.5">
            {/* First page */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(1)}
                className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40"
                title="First page"
            >
                <ChevronsLeft size={16} />
            </button>

            {/* Previous */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40"
                title="Previous page"
            >
                <ChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, idx) =>
                    page === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-1.5 text-sm text-gray-400">
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`min-w-[36px] rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${currentPage === page
                                    ? "bg-[#0B1F3B] text-white shadow-sm"
                                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            {page}
                        </button>
                    ),
                )}
            </div>

            {/* Next */}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40"
                title="Next page"
            >
                <ChevronRight size={16} />
            </button>

            {/* Last page */}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
                className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40"
                title="Last page"
            >
                <ChevronsRight size={16} />
            </button>
        </div>
    );
}
