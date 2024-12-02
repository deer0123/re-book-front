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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
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
        console.log(`Fetching page: ${currentPage}`);
        const response = await axios.get(
          `http://localhost:8181/profile/my-reviews?page=${currentPage}&size=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data.result?.myReviews)) {
          setReviews(response.data.result.myReviews);
          setTotalPages(response.data.result.pagination.totalPages || 1);
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
  }, [token, currentPage, navigate]);

  const handleBookClick = (bookId) => {
    navigate(`/board/detail/${bookId}`);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      console.log(`Changing to page: ${page}`);
      setCurrentPage(page);
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
                style={{ cursor: "pointer", color: " #26945f", }}
              >
                {review.bookName || "정보 없음"}
              </h3>
              <p>{review.content}</p>
              <p>
                <strong>저자:</strong> {review.writer || "정보 없음"}
              </p>
              <p>
                <strong>❤️</strong>{review.likeCount || 0} {" "}
                <strong>⭐</strong>{review.rating}
              </p>
              
              
            </li>
          ))}
        </ul>
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

export default MyReviews;
