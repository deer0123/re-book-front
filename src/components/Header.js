import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import AuthContext from "../context/AuthContext"; // AuthContext 가져오기

const Header = () => {
  const { isLoggedIn, onLogout, userName } = useContext(AuthContext);
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 개별 버튼의 호버 상태 관리
  const [hoveredButton, setHoveredButton] = useState(null);

  // 호버 상태 설정 함수
  const handleMouseEnter = (button) => setHoveredButton(button);
  const handleMouseLeave = () => setHoveredButton(null);

  return (
    <header style={styles.header}>
      <h1
        style={styles.logo}
        onClick={() => navigate("/")} // 로고 클릭 시 홈으로 이동
      >
        Re:Book
      </h1>
      <nav style={styles.nav}>
        <div style={styles.categoryButtons}>
          <Link
            to="/board/list"
            style={
              hoveredButton === "board"
                ? { ...styles.categoryButton, ...styles.categoryButtonHover }
                : styles.categoryButton
            }
            onMouseEnter={() => handleMouseEnter("board")}
            onMouseLeave={handleMouseLeave}
          >
            게시판
          </Link>

          {/* 로그인 상태에 따라 다른 버튼을 보여줍니다. */}
          {isLoggedIn ? (
            <>
              <Link
                to="/profile/info"
                style={
                  hoveredButton === "info"
                    ? {
                        ...styles.categoryButton,
                        ...styles.categoryButtonHover,
                      }
                    : styles.categoryButton
                }
                onMouseEnter={() => handleMouseEnter("info")}
                onMouseLeave={handleMouseLeave}
              >
                내 정보
              </Link>
              <Link
                to="/profile/liked-books"
                style={
                  hoveredButton === "liked-books"
                    ? {
                        ...styles.categoryButton,
                        ...styles.categoryButtonHover,
                      }
                    : styles.categoryButton
                }
                onMouseEnter={() => handleMouseEnter("liked-books")}
                onMouseLeave={handleMouseLeave}
              >
                좋아요 한 책
              </Link>
              <Link
                to="/profile/my-reviews"
                style={
                  hoveredButton === "my-reviews"
                    ? {
                        ...styles.categoryButton,
                        ...styles.categoryButtonHover,
                      }
                    : styles.categoryButton
                }
                onMouseEnter={() => handleMouseEnter("my-reviews")}
                onMouseLeave={handleMouseLeave}
              >
                내 리뷰
              </Link>
              <span style={styles.memberName}>
                웰컴,
                <br /> {userName}
              </span>
              <button onClick={onLogout} style={styles.logoutButton}>
                로그아웃
              </button>
            </>
          ) : (
            <div style={styles.nav}>
              <Link to="/sign-in" style={styles.loginButton}>
                로그인
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "linear-gradient(90deg, #4CAF50, #2E7D32)", // 그라데이션 배경
    color: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 하단 그림자 효과
  },
  logo: {
    fontSize: "30px", // 로고 글씨 크기 확대
    fontWeight: "bold",
    color: "#fff",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  memberName: {
    marginRight: "20px",
    fontSize: "18px", // 사용자 이름 글씨 크기 확대
    color: "#F9F9F9",
  },
  loginButton: {
    color: "#fff",
    textDecoration: "none",
    padding: "8px 15px",
    border: "2px solid #fff",
    borderRadius: "5px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease, color 0.3s ease",
    ":hover": {
      backgroundColor: "#1B5E20", // 로그인 버튼 호버 시 색 변경
      color: "#fff",
    },
  },
  logoutButton: {
    background: "#D32F2F",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: "#B71C1C", // 로그아웃 버튼 호버 시 색 변경
    },
  },
  categoryButtons: {
    display: "flex",
    gap: "15px", // 버튼 간격
  },
  categoryButton: {
    color: "white",
    textDecoration: "none",
    padding: "8px 15px",
    border: "2px solid transparent",
    borderRadius: "5px",
    fontWeight: "bold",
    backgroundColor: "rgba(0, 64, 0, 0.2)",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  categoryButtonHover: {
    backgroundColor: "#1B5E20", // 호버 시 진한 녹색 배경
    transform: "scale(1.1)", // 크기 살짝 키우기
  },
};

export default Header;
