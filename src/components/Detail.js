import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // useParams 임포트
import axios from "axios";
import "./Detail.css"; // CSS 파일을 import

const Detail = () => {
  const { bookId } = useParams(); // URL 파라미터에서 bookId 추출
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: "", content: "" });
  const [modReview, setModReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // 로그인 상태 확인 변수
  // 페이징 처리
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [pageSize] = useState(10);

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
      fetchReviews(0); // 첫 페이지 데이터 요청
    }
  }, [bookId]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPage) {
      fetchReviews(newPage);
    }
  };

  const fetchReviews = async (page) => {
    setLoading(true); // 로딩 시작
    try {
      const response = await axios.get(
        `http://localhost:8181/board/detail/${bookId}?page=${page}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 로그인된 사용자의 토큰을 보내야 함
          },
        }
      );
      const data = response.data;
      console.log("페이지 버튼 클릭 후 전달받은 데이터: ", response.data);

      if (data.statusCode === 200) {
        const result = data.result;
        setReviews(result.reviewList); // 현재 페이지의 리뷰 목록
        setCurrentPage(page); // 현재 페이지 번호 업데이트
        setTotalPage(result.page.totalPages); // 전체 페이지 수 설정
      } else {
        alert("리뷰 데이터를 불러오는 데 실패했습니다.");
      }
    } catch (err) {
      console.error("리뷰 데이터 요청 중 오류:", err);
      alert("리뷰 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

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
      console.log("리뷰 작성 성공 후 데이터: ", response.data);

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

  // 리뷰 수정
  const handleEditClick = (review) => {
    setModReview({
      reviewId: review.id, // 수정할 리뷰의 ID
      content: review.content, // 기존 내용
      rating: review.rating, // 기존 평점
    });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8181/board/detail/${modReview.reviewId}`,
        modReview,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === modReview.reviewId
              ? { ...review, ...response.data.result }
              : review
          )
        );
        alert("리뷰가 성공적으로 수정되었습니다.");
        setModReview(null); // 수정 폼 초기화
      } else {
        setError("리뷰 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("리뷰 수정 중 오류가 발생했습니다:", err);
      setError("리뷰 수정 중 오류가 발생했습니다.");
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm("이 리뷰를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:8181/board/detail/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 사용자 인증 토큰
          },
        }
      );

      if (response.data.statusCode === 200) {
        // 삭제 성공 시 상태 업데이트
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewId)
        );
        alert("리뷰가 성공적으로 삭제되었습니다.");
      } else {
        alert("리뷰 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("리뷰 삭제 중 오류가 발생했습니다:", err);
      alert("리뷰 삭제 중 오류가 발생했습니다.");
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
        <div className="book-cover">
          <img
            src={book.coverImage || "https://via.placeholder.com/150"}
            alt={book.name}
            style={{ width: "150px", height: "auto", marginBottom: "20px" }}
          />
        </div>
        <div className="book-details">
          <p><strong>저자:</strong> {book.writer}</p>
          <p><strong>출판년도:</strong> {book.year}</p>
          <p><strong>출판사:</strong> {book.pub}</p>
          <p><strong>평점:</strong> {(book.rating / book.reviewCount).toFixed(1)}</p>
          <p><strong>리뷰수:</strong> {book.reviewCount}</p>
          <p><strong>좋아요 수:</strong> {book.likeCount}</p>
        </div>
      </div>
  
      <div className="like-status">
        <p>{book.liked ? "이미 좋아요를 눌렀습니다." : "좋아요를 누르세요!"}</p>
      </div>
  
      <ul>
        {reviews.length > 0 ? (
          reviews.map((review) =>
            modReview && modReview.reviewId === review.id ? (
              // 수정 폼 활성화 상태일 때
              <li key={review.id}>
                <form onSubmit={handleUpdateReview}>
                  <div>
                    <label htmlFor="edit-rating">평점:</label>
                    <select
                      id="edit-rating"
                      name="rating"
                      value={modReview.rating}
                      onChange={(e) =>
                        setModReview({ ...modReview, rating: e.target.value })
                      }
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
                    <label htmlFor="edit-content">리뷰 내용:</label>
                    <textarea
                      id="edit-content"
                      name="content"
                      value={modReview.content}
                      onChange={(e) =>
                        setModReview({ ...modReview, content: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit">저장</button>
                  <button
                    type="button"
                    onClick={() => setModReview(null)} // 수정 취소
                  >
                    취소
                  </button>
                </form>
              </li>
            ) : (
              // 일반 리뷰 출력 상태일 때
              <li key={review.id}>
                <strong>{review.memberName}:</strong>
                <p>{review.content}</p>
                <p>평점: {review.rating} / 5</p>
                {isAuthenticated && (
                  <>
                    <button onClick={() => handleEditClick(review)}>
                      수정
                    </button>
                    <button onClick={() => handleDeleteReview(review.id)}>
                      삭제
                    </button>
                  </>
                )}
              </li>
            )
          )
        ) : (
          <p>리뷰가 없습니다.</p>
        )}
      </ul>
  
      {/* 페이징 버튼 */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          이전
        </button>
  
        {[...Array(totalPage).keys()].map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              fontWeight: currentPage === page ? "bold" : "normal",
              textDecoration: currentPage === page ? "underline" : "none",
            }}
          >
            {page + 1}
          </button>
        ))}
  
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPage - 1}
        >
          다음
        </button>
      </div>
  
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
