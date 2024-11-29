import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import AuthContext from "../context/AuthContext"; // AuthContext 가져오기

const Header = () => {
  const { isLoggedIn, onLogout, userName } = useContext(AuthContext);
  const navigate = useNavigate(); // useNavigate 훅 사용

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
          <Link to="/board/list" style={styles.categoryButton}>
            게시판
          </Link>
          {/* 로그인 상태에 따라 다른 버튼을 보여줍니다. */}
          {isLoggedIn ? (
            <>
              <span style={styles.memberName}>
                웰컴,<br></br> {userName}
              </span>
              <button onClick={onLogout} style={styles.logoutButton}>
                로그아웃
              </button>
              {/* 로그인 후 추가되는 버튼들 */}
              <Link to="/profile/info" style={styles.categoryButton}>
                내 정보
              </Link>
              <Link to="/profile/liked-books" style={styles.categoryButton}>
                좋아요 한 책
              </Link>
              <Link to="/profile/my-reviews" style={styles.categoryButton}>
                내 리뷰
              </Link>
            </>
          ) : (
            <div style={styles.nav}>
              <a href="/sign-in" style={styles.loginButton}>
                로그인
              </a>
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
    padding: "10px 20px",
    background: "#333",
    color: "#fff",
  },
  logo: {
    fontSize: "28px", // 로고 글씨 크기 확대
    fontWeight: "bold",
    color: "#fff", // 로고 색상을 하얀색으로 설정
    cursor: "pointer", // 클릭 가능한 커서
    transition: "color 0.3s ease", // 마우스 오버 시 색상 변화
  },
  nav: {
    display: "flex",
    alignItems: "center",
  },
  memberName: {
    marginRight: "15px",
  },
  loginButton: {
    color: "#fff",
    textDecoration: "none",
    padding: "5px 10px",
    border: "1px solid #fff",
    borderRadius: "5px",
  },
  logoutButton: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  categoryButtons: {
    display: "flex",
    gap: "15px",
  },
  categoryButton: {
    color: "#fff",
    textDecoration: "none",
    padding: "5px 10px",
    border: "1px solid #fff",
    borderRadius: "5px",
  },
};

export default Header;
