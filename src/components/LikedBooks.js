import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./LikedBooks.css";

const LikedBooks = () => {
  const { token } = useContext(AuthContext);
  const [likedBooks, setLikedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 페이지네이션을 0부터 시작
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
        console.log(`Fetching page: ${currentPage}`);
        const response = await axios.get(
          `http://localhost:8181/profile/liked-books?page=${currentPage}&size=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API Response:", response.data); // API 응답 확인
  
        if (response.data && response.data.result?.likedBooks) {
          // 서버에서 받은 데이터를 최신순으로 정렬
          const sortedBooks = response.data.result.likedBooks.content?.sort((a, b) => {
            // 만약 createdAt이라는 필드가 없다면, 다른 필드를 기준으로 변경해주세요.
            return new Date(b.createdAt) - new Date(a.createdAt); // 최신순 정렬
          }) || [];
          setLikedBooks(sortedBooks);
          setTotalPages(response.data.result.likedBooks.totalPages || 1);
        } else {
          setError("좋아요한 책 목록을 찾을 수 없습니다.");
        }
      } catch (err) {
        if (err.response) {
          console.error("API Error:", err.response);
          setError(`서버 오류가 발생했습니다. 상태 코드: ${err.response.status}`);
        } else if (err.request) {
          console.error("Request Error:", err.request);
          setError("서버에 요청을 보내는 중 오류가 발생했습니다.");
        } else {
          console.error("General Error:", err.message);
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
    // 페이지네이션이 0부터 시작하도록 변경
    if (page >= 0 && page < totalPages) {
      console.log(`Changing to page: ${page}`);
      setCurrentPage(page);
    }
  };

  if (loading) return <p className="liked-books-message">로딩 중...</p>;
  if (error) return <p className="liked-books-message">{error}</p>;

  return (
    <div className="liked-books-container">
      <h1>내 좋아요 목록</h1>
      {likedBooks.length === 0 ? (
        <p className="liked-books-message">좋아요 목록이 없습니다. 첫 좋아요를 눌러보세요!</p>
      ) : (
        <ul className="liked-books-list">
          {likedBooks.map((book) => (
            <li key={book.id} className="liked-book-item">
              <h3
                className="liked-book-title"
                onClick={() => handleBookClick(book.id)}
                style={{ cursor: "pointer", color: "#4a90e2", textDecoration: "underline" }}
              >
                {book.name || "정보 없음"}
              </h3>
              <p>저자: {book.writer || "정보 없음"}</p>
              <small>평점: ★ {(book.rating / book.reviewCount).toFixed(1)}</small>
              <p>좋아요 수: {book.likeCount}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0} // 첫 페이지에서 "이전" 버튼 비활성화
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, index) => index).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page + 1} {/* 페이지 번호는 1부터 표시 */}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1} // 마지막 페이지에서 "다음" 버튼 비활성화
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default LikedBooks;
