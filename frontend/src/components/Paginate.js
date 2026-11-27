// NexaStore — Paginate Component (RRD v6)
import React from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Paginate = ({ pages, page, keyword = "", isAdmin = false }) => {
  if (!pages || pages <= 1) return null;

  const getUrl = (p) => {
    if (isAdmin) return `/admin/productlist/${p}`;
    if (keyword) return `/search/${encodeURIComponent(keyword)}/page/${p}`;
    return `/page/${p}`;
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link
          to={getUrl(page - 1)}
          className="page-btn"
          aria-label="Previous page"
        >
          <FiChevronLeft aria-hidden="true" />
        </Link>
      ) : (
        <span
          className="page-btn disabled"
          aria-disabled="true"
          aria-label="Previous page"
          style={{ opacity: 0.4, cursor: "not-allowed" }}
        >
          <FiChevronLeft aria-hidden="true" />
        </span>
      )}

      {[...Array(pages).keys()].map((x) => {
        const pageNum = x + 1;
        return (
          <Link
            key={pageNum}
            to={getUrl(pageNum)}
            className={`page-btn ${pageNum === page ? "active" : ""}`}
            aria-current={pageNum === page ? "page" : undefined}
          >
            {pageNum}
          </Link>
        );
      })}

      {page < pages ? (
        <Link
          to={getUrl(page + 1)}
          className="page-btn"
          aria-label="Next page"
        >
          <FiChevronRight aria-hidden="true" />
        </Link>
      ) : (
        <span
          className="page-btn disabled"
          aria-disabled="true"
          aria-label="Next page"
          style={{ opacity: 0.4, cursor: "not-allowed" }}
        >
          <FiChevronRight aria-hidden="true" />
        </span>
      )}
    </nav>
  );
};

export default Paginate;
