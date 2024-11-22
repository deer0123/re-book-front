import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // useParams 임포트
import axios from "axios";

const Detail = () => {
  const { bookId } = useParams(); // URL 파라미터에서 bookId 추출
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8181/board/detail/${bookId}`
        );
        const data = response.data;

        if (data.statusCode === 200) {
          setBook(data.result.book); // 책 정보 설정
          setReviews(data.result.reviewList); // 리뷰 목록 설정
        } else {
          setError("책 정보를 불러오는 데 실패했습니다.");
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("책 정보를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!book) {
    return <div>책 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="book-detail-container">
      <h1>{book.name} - 상세 정보</h1>
      <div className="book-info">
        <img
          src={book.coverImage || "https://via.placeholder.com/150"}
          alt={book.name}
          className="book-cover"
          style={{ width: "150px", height: "auto", marginBottom: "20px" }}
        />
        <p>
          <strong>저자:</strong> {book.writer}
        </p>
        <p>
          <strong>출판년도:</strong> {book.year}
        </p>
        <p>
          <strong>출판사:</strong> {book.pub}
        </p>
        <p>
          <strong>평점:</strong> {book.rating} / 10
        </p>
        <p>
          <strong>리뷰수:</strong> {book.reviewCount}
        </p>
        <p>
          <strong>좋아요 수:</strong> {book.likeCount}
        </p>
      </div>

      <div className="like-status">
        <p>{book.liked ? "이미 좋아요를 눌렀습니다." : "좋아요를 누르세요!"}</p>
      </div>

      <h2>리뷰 목록</h2>
      <ul>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <li key={review.id}>
              <strong>{review.memberName}:</strong>
              <p>{review.content}</p>
              <p>평점: {review.rating} / 5</p>
            </li>
          ))
        ) : (
          <p>리뷰가 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default Detail;
