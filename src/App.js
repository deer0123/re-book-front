import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Switch -> Routes로 변경
import List from "./components/List"; // List 컴포넌트 경로
import Detail from "./components/Detail"; // BookDetailPage 컴포넌트 경로
import Home from "./components/Home";
import LoginPage from "./components/LoginPage"; 
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<LoginPage />} />{" "}
        <Route path="/" element={<Home />} />{" "}
        <Route path="/board/list" element={<List />} />{" "}
        <Route path="/board/detail/:bookId" element={<Detail />} />{" "}
      </Routes>
    </Router>
  );
};

export default App;
