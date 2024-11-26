import React, { useContext } from "react";
import AuthContext from "../context/AuthContext"; // AuthContext 가져오기

const Header = () => {
  const { isLoggedIn, onLogout, userRole, userId, userName } =
    useContext(AuthContext);

  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>My Website</h1>
      <nav>
        {isLoggedIn ? (
          <div style={styles.nav}>
            <span style={styles.memberName}>환영합니다, {userName}님!</span>
            <button onClick={onLogout} style={styles.logoutButton}>
              로그아웃
            </button>
          </div>
        ) : (
          <div style={styles.nav}>
            <a href="/sign-in" style={styles.loginButton}>
              로그인
            </a>
          </div>
        )}
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
    fontSize: "24px",
    fontWeight: "bold",
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
};

export default Header;
