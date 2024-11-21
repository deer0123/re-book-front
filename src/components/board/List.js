import React, { useState, useEffect } from "react";
import axios from "axios";

const List = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("rating"); // 기본 정렬 기준
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    // 책 목록을 불러오는 API 호출
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:8181/board/list`, {
          params: {
            page: page,
            sort: sort,
            query: query,
          },
          // Authorization 헤더 제거
          headers: {},
        });

        setBooks(response.data.result.bList);
        setLoading(false); // 로딩 완료
      } catch (err) {
        setError("책 목록을 불러오는 데 실패했습니다.");
        setLoading(false); // 로딩 완료
        console.error(err);
      }
    };

    fetchBooks();
  }, [sort, query, page]); // sort, query, page 값이 바뀔 때마다 실행

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>책 목록</h1>

      {/* 검색바 */}
      <div>
        <input
          type="text"
          placeholder="검색어 입력"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => setPage(0)}>검색</button>
      </div>

      {/* 정렬 기준 선택 */}
      <div>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="rating">평점순</option>
          <option value="year">출판연도순</option>
          {/* 다른 정렬 기준을 추가할 수 있습니다. */}
        </select>
      </div>

      {/* 책 목록 */}
      {books.length > 0 ? (
        <div>
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <div>
                  <h3>{book.name}</h3>
                  <p>저자: {book.writer}</p>
                  <p>출판년도: {book.year}</p>
                  <p>평점: {book.rating}</p>
                  <p>리뷰수: {book.reviewCount}</p>
                  {/* 책 이미지가 있다면 여기서 렌더링 */}
                  {book.coverImage && (
                    <img src={book.coverImage} alt={book.name} />
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* 페이지네이션 */}
          <div>
            <button onClick={() => setPage(page - 1)} disabled={page === 0}>
              이전
            </button>
            <button onClick={() => setPage(page + 1)}>다음</button>
          </div>
        </div>
      ) : (
        <p>책 목록이 없습니다.</p>
      )}
    </div>
  );
};

export default List;
