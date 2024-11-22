import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Switch -> Routes로 변경
import List from "./components/board/List"; // List 컴포넌트 경로
import Detail from "./components/board/Detail"; // BookDetailPage 컴포넌트 경로
import Home from "./components/board/Home";
import SignIn from "./components/user/Sign-in";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />{" "}
        <Route path="/" element={<Home />} />{" "}
        <Route path="/board/list" element={<List />} />{" "}
        <Route path="/board/detail/:bookId" element={<Detail />} />{" "}
      </Routes>
    </Router>
  );
};

export default App;
