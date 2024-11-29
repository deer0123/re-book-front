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
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:8181/profile/my-reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.result?.myReviews)) {
          setReviews(response.data.result.myReviews);
        } else {
          setError("리뷰 데이터를 찾을 수 없습니다.");
        }
      } catch (err) {
        setError("리뷰 목록 조회 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token, navigate]);

  const handleBookClick = (bookId) => {
    navigate(`/board/detail/${bookId}`); // 책 상세 페이지로 이동
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
                onClick={() => handleBookClick(review.bookId)} // 클릭 시 책 상세 페이지로 이동
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
    </div>
  );
};

export default MyReviews;
