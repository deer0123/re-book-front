import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // BrowserRouter로 변경
import List from "./components/List"; 
import Detail from "./components/Detail"; 
import Home from "./components/Home";
import LoginPage from "./components/LoginPage"; 
import Header from "./components/Header";
import { jwtDecode } from "jwt-decode"; // jwtDecode 추가

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [name, setName] = useState(""); // 사용자 이름
  const [token, setToken] = useState(null); // 토큰 상태 추가

  // 첫 렌더링 시 토큰 확인
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken); // 토큰 디코딩
        setName(decodedToken.name || "Guest");
        setIsLoggedIn(true);
        setToken(storedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setName("");
  };

  return (
    <Router> {/* Router 컴포넌트로 감싸기 */}
      <Header 
        isLoggedIn={isLoggedIn} 
        name={name} 
        onLogout={handleLogout} 
      />
      <Routes>
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/board/list" element={<List />} />
        <Route path="/board/detail/:bookId" element={<Detail />} />
      </Routes>
    </Router>
  );
};

export default App;
