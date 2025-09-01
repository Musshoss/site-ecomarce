import React from "react";

const Pagination = ({
  currentPage = 1,
  totalPages = 10,
  onPageChange = () => {},
  maxVisiblePages = 5,
  loading = false,
}) => {
  const getVisiblePages = () => {
    const delta = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 2;
  const showRightEllipsis =
    visiblePages[visiblePages.length - 1] < totalPages - 1;

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages && !loading) {
      onPageChange(page);
    }
  };

  const baseButtonStyle = {
    minWidth: "40px",
    height: "40px",
    padding: "0 10px",
    background: "#ffffff",
    border: "1px solid #f0f0fe",
    borderRadius: "10px",
    color: "#070738",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  };

  const activeButtonStyle = {
    background: "linear-gradient(135deg, #f0f0fe, #f0f0fe)",
    color: "#070738",
    borderColor: "#f0f0fe",
    fontWeight: "600",
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "16px",
        borderRadius: "16px",
        opacity: loading ? 0.6 : 1,
        flexWrap: "wrap",
      }}
    >
      {/* Previous */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        style={{
          ...baseButtonStyle,
          opacity: currentPage === 1 || loading ? 0.4 : 1,
          cursor:
            currentPage === 1 || loading ? "not-allowed" : "pointer",
        }}
      >
        ←
      </button>

      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => handlePageClick(1)}
            disabled={loading}
            style={{
              ...baseButtonStyle,
              ...(currentPage === 1 ? activeButtonStyle : {}),
            }}
          >
            1
          </button>
          {showLeftEllipsis && <span style={{ padding: "0 4px" }}>...</span>}
        </>
      )}

      {/* Visible Pages */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          disabled={loading}
          style={{
            ...baseButtonStyle,
            ...(currentPage === page ? activeButtonStyle : {}),
          }}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {showRightEllipsis && <span style={{ padding: "0 4px" }}>...</span>}
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={loading}
            style={{
              ...baseButtonStyle,
              ...(currentPage === totalPages ? activeButtonStyle : {}),
            }}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        style={{
          ...baseButtonStyle,
          opacity: currentPage === totalPages || loading ? 0.4 : 1,
          cursor:
            currentPage === totalPages || loading ? "not-allowed" : "pointer",
        }}
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
