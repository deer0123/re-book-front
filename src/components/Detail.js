import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // useParams 임포트
import axios from "axios";

const Detail = () => {
  const { bookId } = useParams(); // URL 파라미터에서 bookId 추출
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // 로그인 상태 확인 변수

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

  // 리뷰 작성 처리
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // 입력 값 검증
    if (!newReview.content || !newReview.rating) {
      alert("리뷰 내용을 입력하고 평점을 선택해주세요.");
      return;
    }

    try {
      // 리뷰 작성 API 호출
      const response = await axios.post(
        `http://localhost:8181/board/detail/${bookId}/create`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 로그인된 사용자의 토큰을 보내야 함
          },
        }
      );

      if (response.data.statusCode === 200) {
        // 리뷰 작성 성공 시, 리뷰 목록에 새 리뷰 추가
        setReviews((prevReviews) => [response.data.result, ...prevReviews]);
        setNewReview({ rating: "", content: "" }); // 리뷰 작성 후 폼 초기화
      } else {
        setError("리뷰 작성에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("리뷰 작성 중 오류가 발생했습니다.");
    }
  };

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
          reviews.map((review) => (
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

      {isAuthenticated ? (
        <div className="review-form">
          <h3>리뷰 작성</h3>
          <form onSubmit={handleReviewSubmit}>
            <div>
              <label htmlFor="rating">평점:</label>
              <select
                id="rating"
                name="rating"
                value={newReview.rating}
                onChange={handleReviewChange}
              >
                <option value="">선택</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div>
              <label htmlFor="content">리뷰 내용:</label>
              <textarea
                id="content"
                name="content"
                value={newReview.content}
                onChange={handleReviewChange}
              />
            </div>
            <button type="submit">리뷰 작성</button>
          </form>
        </div>
      ) : (
        <p>로그인 후 리뷰를 작성할 수 있습니다.</p>
      )}
    </div>
  );
};

export default Detail;
