import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";

function Card({ book, imageUrl }) {
  return (
    <div className={`${styles.card} mb-4 shadow-sm`}>
      <a href={`/board/detail/${book.bookUuid}`} className={styles["text-decoration-none"]}>
        <img
          src={imageUrl}
          className={`${styles["card-img-top"]} ${styles["card-img"]}`}
          alt={`Cover of ${book.bookName}`}
        />
        <div className={styles["card-info"]}>
          <h3 className={styles["card-title"]}>{book.bookName}</h3>
          <p className={styles["author-pub"]}>
            {book.bookWriter} | {book.bookPub}
          </p>
          <div className={styles["like-rating"]}>
            <strong>❤️ {book.likeCount}</strong>
            <strong>
              ⭐{" "}
              {book.reviewCount === 0
                ? "0"
                : (book.bookRating / book.reviewCount).toFixed(1)}
            </strong>
            <strong> 🗨️ {book.reviewCount}</strong>
          </div>
        </div>
      </a>
    </div>
  );
}

function Section({ title, books, imageUrl }) {
  return (
    <div>
      <h2 className={styles["mt-5"]}>{title}</h2>
      <div className={styles.slider}>
        <div className={styles["slider-wrapper"]}>
          {books.map((book) => (
            <Card key={book.bookUuid} book={book} imageUrl={imageUrl} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [data, setData] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8181/")
      .then((res) => res.json())
      .then((result) => {
        if (result.result) {
          setData(result.result);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prevSection) => (prevSection + 1) % sections.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSection, data]);

  if (!data) {
    return <p>Loading...</p>;
  }

  const sections = [
    {
      title: "🔥HOT🔥 평점이 높은 도서",
      books: data.recommendedByRating,
      imageUrl: "/images/Cover1.jpg",
    },
    {
      title: "🔥HOT🔥 리뷰 수가 많은 도서",
      books: data.recommendedByReviewCount,
      imageUrl: "/images/Cover2.jpg",
    },
    {
      title: "🔥HOT🔥 좋아요 수가 많은 도서",
      books: data.recommendedByLikeCount,
      imageUrl: "/images/Cover3.jpg",
    },
  ];

  const handleSwitchSection = (direction) => {
    setCurrentSection((prevSection) => (
      prevSection + direction + sections.length) % sections.length);
  };

  return (
    <div className={`${styles.container} my-5 text-center`}>
      {sections.map((section, index) => (
        <div
          key={index}
          className={`${styles.section} ${
            currentSection === index ? styles["active-section"] : ""
          }`}
        >
          <Section
            title={section.title}
            books={section.books}
            imageUrl={section.imageUrl}
          />
        </div>
      ))}

      <button
        className={`${styles["control-button"]} ${styles["prev-button"]}`}
        onClick={() => handleSwitchSection(-1)}
      >
        &#9664;
      </button>
      <button
        className={`${styles["control-button"]} ${styles["next-button"]}`}
        onClick={() => handleSwitchSection(1)}
      >
        &#9654;
      </button>
    </div>
  );
}

export default Home;
