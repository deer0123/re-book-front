import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./LikedBooks.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const LikedBooks = () => {
  const { token } = useContext(AuthContext);
  const [likedBooks, setLikedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 페이지네이션 0부터 시작
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchLikedBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/profile/liked-books?page=${currentPage}&size=8`, // 페이지당 8개로 변경
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.result?.likedBooks) {
          const sortedBooks =
            response.data.result.likedBooks.content?.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt); // 최신순 정렬
            }) || [];
          setLikedBooks(sortedBooks);
          setTotalPages(response.data.result.likedBooks.totalPages || 1);
        } else {
          setError("좋아요한 책 목록을 찾을 수 없습니다.");
        }
      } catch (err) {
        if (err.response) {
          setError(
            `서버 오류가 발생했습니다. 상태 코드: ${err.response.status}`
          );
        } else if (err.request) {
          setError("서버에 요청을 보내는 중 오류가 발생했습니다.");
        } else {
          setError("좋아요한 책 목록 조회 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLikedBooks();
  }, [token, currentPage, navigate]);

  const handleBookClick = (bookId) => {
    navigate(`/board/detail/${bookId}`);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <p className="liked-books-message">로딩 중...</p>;
  if (error) return <p className="liked-books-message">{error}</p>;

  return (
    <div className="liked-books-container">
      <h1>내 좋아요 목록</h1>
      {likedBooks.length === 0 ? (
        <p className="liked-books-message">
          좋아요 목록이 없습니다. 첫 좋아요를 눌러보세요!
        </p>
      ) : (
        <div className="liked-books-list">
          {likedBooks.map((book) => (
            <div key={book.id} className="liked-book-card">
              <h3
                className="liked-book-title"
                onClick={() => handleBookClick(book.id)}
              >
                {book.name || "정보 없음"}
              </h3>
              <p>
                <strong>저자:</strong> {book.writer || "정보 없음"}
              </p>
              <p>
                ❤️ {book.likeCount} ⭐{" "}
                {book.reviewCount
                  ? (book.rating / book.reviewCount).toFixed(1)
                  : 0}{" "}
                🗨 {book.reviewCount}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, index) => index).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default LikedBooks;
