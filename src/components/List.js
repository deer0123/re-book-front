import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import "./List.css"; // CSS 파일을 import
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const List = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("rating");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수 상태
  const [currentPageRange, setCurrentPageRange] = useState([0, 9]); // 현재 페이지 범위
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/board/list`, {
          params: { page: page, sort: sort, query: query },
        });
        setBooks(response.data.result.bList);
        setTotalPages(response.data.result.maker.totalPages); // 전체 페이지 수 설정
        setLoading(false);
      } catch (err) {
        setError("책 목록을 불러오는 데 실패했습니다.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchBooks();
  }, [sort, query, page]);

  useEffect(() => {
    // 페이지 번호 범위 계산 (10개 단위로 나누기)
    const startPage = Math.floor(page / 10) * 10;
    const endPage = Math.min(startPage + 9, totalPages - 1);
    setCurrentPageRange([startPage, endPage]);
  }, [page, totalPages]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePreviousRange = () => {
    setPage(currentPageRange[0] - 1);
  };

  const handleNextRange = () => {
    setPage(currentPageRange[1] + 1);
  };

  const handleBookClick = (bookId) => {
    navigate(`/board/detail/${bookId}`); // 상세 페이지로 이동
  };

  return (
    <div className="container">
      <h1> 📖Book List </h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="검색어 입력"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => setPage(0)}>검색</button>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="rating">평점순</option>
          <option value="year">출판연도순</option>
          <option value="reviewCount">리뷰순</option>
          <option value="likeCount">좋아요순</option>
        </select>
      </div>

      {books.length > 0 ? (
        <div className="book-list">
          {books.map((book) => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => handleBookClick(book.id)} // 클릭 시 상세 페이지로 이동
            >
              <div className="book-cover">
                <img
                  src={book.coverImage || "https://re-book-image1326.s3.ap-northeast-2.amazonaws.com/Book3.jpg"}
                  alt={book.name}
                  style={{
                    width: "150px",
                    height: "auto",
                    marginBottom: "20px",
                  }}
                />
              </div>
              <h3>{book.name}</h3>
              <p>저자: {book.writer}</p>
              <p>출판년도: {book.year}</p>
              <div className="ratings">
                <p>
                  ❤️ {book.likeCount} ⭐{" "}
                  {book.reviewCount
                    ? (book.rating / book.reviewCount).toFixed(1)
                    : 0}{" "}
                  🗨 {book.reviewCount}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>책 목록이 없습니다.</p>
      )}

      {/* 페이지네이션 */}
      <div className="pagination">
        {currentPageRange[0] > 0 && (
          <button onClick={handlePreviousRange}>이전</button>
        )}

        {Array.from(
          { length: currentPageRange[1] - currentPageRange[0] + 1 },
          (_, index) => currentPageRange[0] + index
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`page-number ${page === pageNumber ? "active" : ""}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber + 1}
          </button>
        ))}

        {currentPageRange[1] < totalPages - 1 && (
          <button onClick={handleNextRange}>다음</button>
        )}
      </div>
    </div>
  );
};

export default List;
