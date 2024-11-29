import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import List from "./components/List";
import Detail from "./components/Detail";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import { AuthProvider } from "./context/AuthContext"; // AuthProvider 가져오기
import Header from "./components/Header";
import ProfileInfo from "./components/ProfileInfo";
import LikedBooks from "./components/LikedBooks";
import MyReviews from "./components/MyReviews";
import SignUp from "./components/SignUp";
import SignUp from "./components/SignUp";

const App = () => {
  return (
    <Router>
      {" "}
      {/* Router를 가장 최상위로 위치시킴 */}
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/board/list" element={<List />} />
          <Route path="/board/detail/:bookId" element={<Detail />} />
          <Route path="/profile/info" element={<ProfileInfo />} />
          <Route path="/profile/liked-books" element={<LikedBooks />} />
          <Route path="/profile/my-reviews" element={<MyReviews />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
