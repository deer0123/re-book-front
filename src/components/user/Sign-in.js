import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 에러 상태 추가
  const navigate = useNavigate();

  // 로그인 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8181/sign-in", {
        email: email,
        password: password,
      });

      // 응답에서 토큰 추출
      if (response.data && response.data.data) {
        const { token } = response.data.data; // 서버에서 받은 토큰

        if (token) {
          localStorage.setItem("authToken", token); // 로컬 스토리지에 토큰 저장
          navigate("/dashboard"); // 로그인 성공 후 대시보드로 이동
        }
      } else {
        setError("로그인 실패! 다시 시도해 주세요.");
      }
    } catch (err) {
      setError("서버와 연결할 수 없습니다. 나중에 다시 시도해주세요.");
      console.error("로그인 오류:", err);
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#fff",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            이메일:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 입력"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            비밀번호:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-success">
          로그인
        </button>
      </form>

      <a
        href="/sign-up"
        className="btn btn-primary mt-3"
        style={{ width: "100%" }}
      >
        회원가입
      </a>
    </div>
  );
};

export default SignIn;
