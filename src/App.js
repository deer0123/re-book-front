import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import List from "./components/List";
import Detail from "./components/Detail";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import { AuthProvider } from "./context/AuthContext"; // AuthProvider 가져오기
import Header from "./components/Header";
const App = () => {
  return (
    <AuthProvider>
      <Header />
      <Router>
        <Routes>
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/board/list" element={<List />} />
          <Route path="/board/detail/:bookId" element={<Detail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
