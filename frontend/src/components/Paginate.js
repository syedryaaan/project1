// NexaStore — Paginate Component (RRD v6)
import React from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Paginate = ({ pages, page, keyword = "", isAdmin = false }) => {
  if (pages <= 1) return null;

  const getUrl = (p) => {
    if (isAdmin) return `/admin/productlist/${p}`;
    if (keyword) return `/search/${keyword}/page/${p}`;
    return `/page/${p}`;
  };

  return (
    <div className="pagination">
      <Link
        to={page > 1 ? getUrl(page - 1) : "#"}
        className={`page-btn ${page <= 1 ? "disabled" : ""}`}
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </Link>

      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          to={getUrl(x + 1)}
          className={`page-btn ${x + 1 === page ? "active" : ""}`}
        >
          {x + 1}
        </Link>
      ))}

      <Link
        to={page < pages ? getUrl(page + 1) : "#"}
        className={`page-btn ${page >= pages ? "disabled" : ""}`}
        aria-label="Next page"
      >
        <FiChevronRight />
      </Link>
    </div>
  );
};

export default Paginate;
