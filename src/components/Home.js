import React, { useEffect, useState } from "react";

function Home() {
  const [data, setData] = useState(null); // 초기값을 null로 설정

  useEffect(() => {
    // 로컬 스토리지에서 토큰을 가져옵니다.

    // API 데이터 가져오기
    fetch("http://localhost:8181/")
      .then((res) => res.json())
      .then((result) => {
        console.log("API Response:", result);
        if (result.result) {
          setData(result.result); // result.result 데이터를 상태로 저장
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  if (!data) {
    return <p>Loading...</p>; // 데이터가 없으면 로딩 상태를 표시
  }

  return (
    <div>
      <h1>Home</h1>
      <h2>Recommended by Rating</h2>
      <ul>
        {data.recommendedByRating.map((book) => (
          <li key={book.bookUuid}>
            {book.bookName} by {book.bookWriter}
          </li>
        ))}
      </ul>
      <h2>Recommended by Review Count</h2>
      <ul>
        {data.recommendedByReviewCount.map((book) => (
          <li key={book.bookUuid}>
            {book.bookName} by {book.bookWriter}
          </li>
        ))}
      </ul>
      <h2>Recommended by Like Count</h2>
      <ul>
        {data.recommendedByLikeCount.map((book) => (
          <li key={book.bookUuid}>
            {book.bookName} by {book.bookWriter}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
