import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/board/Home";
import List from "./components/board/List";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board/list" element={<List />} />
      </Routes>
    </Router>
  );
}

export default App;
