import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./MyReviews.css";

const MyReviews = () => {
  const { token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching page: ${currentPage}`); // 현재 페이지 로그 출력
        const response = await axios.get(
          `http://localhost:8181/profile/my-reviews?page=${currentPage}&size=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API Response:", response.data); // API 응답 확인

        if (response.data && Array.isArray(response.data.result?.myReviews)) {
          setReviews(response.data.result.myReviews);
          setTotalPages(response.data.result.pagination.totalPages || 1); // 총 페이지 수 설정
        } else {
          setError("리뷰 데이터를 찾을 수 없습니다.");
        }
      } catch (err) {
        setError("리뷰 목록 조회 중 오류가 발생했습니다.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token, currentPage, navigate]); // currentPage가 변경될 때마다 호출

  const handleBookClick = (bookId) => {
    navigate(`/board/detail/${bookId}`);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      console.log(`Changing to page: ${page}`); // 페이지 변경 로그
      setCurrentPage(page); // 페이지 상태 업데이트
    }
  };

  if (loading) return <p className="my-reviews-message">로딩 중...</p>;
  if (error) return <p className="my-reviews-message">{error}</p>;

  return (
    <div className="my-reviews-container">
      <h1>내 리뷰 목록</h1>
      {reviews.length === 0 ? (
        <p className="my-reviews-message">등록된 리뷰가 없습니다.</p>
      ) : (
        <ul className="my-reviews-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-item">
              <h3
                className="review-title"
                onClick={() => handleBookClick(review.bookId)}
                style={{ cursor: "pointer", color: "#4a90e2", textDecoration: "underline" }}
              >
                {review.bookName || "정보 없음"}
              </h3>
              <p>{review.content}</p>
              <p>
                <strong>저자:</strong> {review.writer || "정보 없음"}
              </p>
              <small>평점: {review.rating}</small>
            </li>
          ))}
        </ul>
      )}
      {/* 페이지 번호 버튼 생성 */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        {/* 페이지 번호 버튼 */}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MyReviews;
