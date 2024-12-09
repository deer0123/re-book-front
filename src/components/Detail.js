import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // useParams 임포트
import { jwtDecode } from "jwt-decode"; // jwt-decode 라이브러리 사용
import axios from "axios";
import AuthContext from "../context/AuthContext"; // AuthContext 가져오기
import "./Detail.css"; // CSS 파일을 import
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Detail = () => {
  const { bookId } = useParams(); // URL 파라미터에서 bookId 추출
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: "", content: "" });
  const [modReview, setModReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  ); // 로그인 상태 확인 변수
  const [liked, setLiked] = useState(false);
  // 페이징 처리
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [pageSize] = useState(10);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/board/detail/${bookId}`
        );
        const data = response.data;
        if (data.statusCode === 200) {
          setLiked(data.result.isLiked);
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
  }, []);

  const toggleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      // 로그인 페이지로 리다이렉트 (선택 사항)
      // window.location.href = "/login";
      return; // 토큰이 없으면 더 이상 요청하지 않도록 종료
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/board/detail/${bookId}/toggle-like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰 추가
          },
        }
      );

      const { success, isLiked, likeCount } = response.data.result;
      if (success) {
        setLiked(isLiked); // 좋아요 상태 업데이트
        setBook((prevBook) => ({
          ...prevBook,
          likeCount, // 좋아요 수 업데이트
        }));
      } else {
        alert("좋아요 요청 중 문제가 발생했습니다.");
      }
    } catch (err) {
      console.error("좋아요 토글 요청 중 오류:", err);
      alert("좋아요 요청 중 문제가 발생했습니다.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPage) {
      fetchReviews(newPage);
    }
  };

  const fetchReviews = async (page) => {
    setLoading(true); // 로딩 시작
    try {
      const headers = {}; // 기본 headers 빈 객체 생성

      // 로그인된 경우에만 Authorization 헤더 추가
      if (localStorage.getItem("token")) {
        headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
      }

      const response = await axios.get(
        `${API_BASE_URL}/board/detail/${bookId}?page=${page}&size=${pageSize}`,
        { headers } // headers를 조건부로 전달
      );

      const data = response.data;

      if (data.statusCode === 200) {
        const result = data.result;
        setLiked(result.isLiked);
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

  // 리뷰 작성할때
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      // 로그인 페이지로 리다이렉트 (선택 사항)
      // window.location.href = "/login";
      return; // 토큰이 없으면 더 이상 요청하지 않도록 종료
    }
    // 입력 값 검증
    if (!newReview.content || !newReview.rating) {
      alert("리뷰 내용을 입력하고 평점을 선택해주세요.");
      return;
    }

    try {
      // 리뷰 작성 API 호출
      const response = await axios.post(
        `${API_BASE_URL}/board/detail/${bookId}/create`,
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

        setReviews((prevReviews) => [
          { ...response.data.result, memberUuid: userId }, // 버튼을 위한 정보 추가
          ...prevReviews,
        ]);

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
      reviewId: review.reviewId, // 수정할 리뷰의 ID
      content: review.content, // 기존 내용
      rating: review.rating, // 기존 평점
    });

    console.log("Updated modReview state:", {
      reviewId: review.id,
      content: review.content,
      rating: review.rating,
    });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    try {
      // 수정 요청 보내기
      const response = await axios.put(
        `${API_BASE_URL}/board/detail/${modReview.reviewId}`,
        modReview,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Updated Review Response:", response.data.result);
      console.log("modReview.reviewId:", modReview.reviewId);

      // 요청 성공 시 상태 업데이트
      if (response.data.statusCode === 200) {
        // 상태 업데이트 (리뷰 목록 수정)
        setReviews((prevReviews) => {
          const updatedReviews = prevReviews.map((review) => {
            console.log(
              "Review ID:",
              review.id,
              "ModReview ID:",
              modReview.reviewId
            );
            if (review.reviewId === modReview.reviewId) {
              console.log("modReview: ", modReview);
              return {
                ...review,
                ...modReview,
              }; // 수정된 리뷰로 교체
            }
            return review; // 나머지는 그대로 유지
          });

          console.log("Updated Reviews State:", updatedReviews);
          return updatedReviews;
        });

        alert("리뷰가 성공적으로 수정되었습니다.");
        setModReview(null); // 수정 폼 초기화
      } else {
        // 요청 실패 시 에러 처리
        console.error("리뷰 수정 실패:", response.data);
        alert("리뷰 수정에 실패했습니다.");
        setError("리뷰 수정에 실패했습니다.");
      }
    } catch (err) {
      // 요청 중 오류 처리
      console.error("리뷰 수정 중 오류가 발생했습니다:", err);
      setError("리뷰 수정 중 오류가 발생했습니다.");
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async (review) => {
    const confirmDelete = window.confirm("이 리뷰를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    console.log("review to delete: ", review);

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/board/detail/${review.reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 사용자 인증 토큰
          },
        }
      );

      if (response.data.statusCode === 200) {
        // 삭제 성공 시 상태 업데이트
        setReviews(
          (prevReviews) =>
            prevReviews.filter((r) => r.reviewId !== review.reviewId) // 삭제된 리뷰만 제외
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
      <h1>{book.name}</h1>
      <div className="book-info">
        <div className="book-cover">
          <img
            src={book.coverImage || "https://re-book-front1326.s3.ap-northeast-2.amazonaws.com/Book3.jpg"}
            alt={book.name}
            style={{ width: "150px", height: "auto", marginBottom: "20px" }}
          />
        </div>
        <div className="book-details">
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
            <strong>평점:</strong>{" "}
            {book.reviewCount ? (book.rating / book.reviewCount).toFixed(1) : 0}
          </p>
          <p>
            <strong>리뷰수:</strong> {book.reviewCount}
          </p>
          <p>
            <strong>좋아요 수:</strong> {book.likeCount}
          </p>
        </div>
      </div>

      <div className="like-button">
        <button onClick={toggleLike} className={liked ? "liked" : "unliked"}>
          {liked ? "❤️" : "🤍"}
        </button>
      </div>

      <ul>
        {reviews.length > 0 ? (
          reviews.map((review) =>
            modReview && modReview.reviewId === review.reviewId ? (
              // 디버깅 로그 추가
              (console.log(
                "Rendering edit form for review:",
                review,
                "with modReview:",
                modReview
              ),
              (
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
                        <option value="">평점</option>
                        <option value="1">⭐</option>
                        <option value="2">⭐⭐</option>
                        <option value="3">⭐⭐⭐</option>
                        <option value="4">⭐⭐⭐⭐</option>
                        <option value="5">⭐⭐⭐⭐⭐</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="edit-content">리뷰 내용:</label>
                      <textarea
                        id="edit-content"
                        name="content"
                        value={modReview.content}
                        onChange={(e) =>
                          setModReview({
                            ...modReview,
                            content: e.target.value,
                          })
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
              ))
            ) : (
              // 일반 리뷰 출력 상태일 때
              <li key={review.id}>
                <strong>{review.memberName}</strong>
                <p> {"⭐".repeat(review.rating)}</p>
                <p>{review.content}</p>

                {isAuthenticated && userId === review.memberUuid && (
                  <>
                    {/* <p>현재 로그인된 사용자 ID: {userId}</p> */}
                    {/* <p>리뷰작성자의ID: {review.memberUuid}</p> */}

                    <button onClick={() => handleEditClick(review)}>
                      수정
                    </button>
                    <button onClick={() => handleDeleteReview(review)}>
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
          <h3>리뷰</h3>
          <form onSubmit={handleReviewSubmit}>
            <div>
              {/* <label htmlFor="rating">평점:</label> */}
              <select
                id="rating"
                name="rating"
                value={newReview.rating}
                onChange={handleReviewChange}
              >
                <option value="">평점</option>
                <option value="1">⭐</option>
                <option value="2">⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
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
