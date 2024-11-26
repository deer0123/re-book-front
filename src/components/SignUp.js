import React, { useState, useEffect } from "react";
import axios from "axios";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isAuthCodeValid, setIsAuthCodeValid] = useState(false);
  const [authCodeSent, setAuthCodeSent] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState("");
  const [authCodeFeedback, setAuthCodeFeedback] = useState("");
  const [nicknameFeedback, setNicknameFeedback] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState("");

  useEffect(() => {
    toggleSubmitButton();
  }, [isEmailValid, isNicknameValid, isPasswordValid, isAuthCodeValid]);

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailPattern.test(emailValue)) {
      setEmailFeedback("이메일이 유효합니다.");
      setIsEmailValid(true);
    } else {
      setEmailFeedback("올바른 이메일 형식이 아닙니다.");
      setIsEmailValid(false);
    }
  };

  const handleNicknameChange = (e) => {
    const nicknameValue = e.target.value;
    setNickname(nicknameValue);

    if (nicknameValue.length >= 2 && nicknameValue.length <= 8) {
      setNicknameFeedback("");
      setIsNicknameValid(true);
    } else {
      setNicknameFeedback("닉네임은 2~8자 사이여야 합니다.");
      setIsNicknameValid(false);
    }
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (passwordValue.length >= 4 && passwordValue.length <= 14) {
      setPasswordFeedback("");
      setIsPasswordValid(true);
    } else {
      setPasswordFeedback("비밀번호는 4~14자 사이여야 합니다.");
      setIsPasswordValid(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);

    if (confirmPasswordValue === password) {
      setPasswordFeedback("");
      setIsPasswordValid(true);
    } else {
      setPasswordFeedback("비밀번호가 일치하지 않습니다.");
      setIsPasswordValid(false);
    }
  };

  const handleAuthCodeChange = (e) => {
    const authCodeValue = e.target.value;
    setAuthCode(authCodeValue);
  };

  const handleSendAuthCode = () => {
    if (isEmailValid) {
      axios
        .post("http://localhost:8181/send-auth-code", { email })
        .then((response) => {
          setAuthCodeSent(true);
          setAuthCodeFeedback("인증 코드가 이메일로 전송되었습니다.");
        })
        .catch((error) => {
          setAuthCodeFeedback("인증 코드 전송에 실패했습니다.");
        });
    }
  };

  const handleVerifyAuthCode = () => {
    axios
      .post("http://localhost:8181/verify-auth-code", { authCode })
      .then((response) => {
        if (response.data.isValid) {
          setAuthCodeFeedback("인증 코드가 확인되었습니다.");
          setIsAuthCodeValid(true);
        } else {
          setAuthCodeFeedback("인증 코드가 올바르지 않습니다.");
          setIsAuthCodeValid(false);
        }
      })
      .catch((error) => {
        setAuthCodeFeedback("인증 코드 확인에 실패했습니다.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEmailValid && isNicknameValid && isPasswordValid && isAuthCodeValid) {
      // 회원가입 API 호출
      axios
        .post("/sign-up", {
          email,
          nickname,
          password,
          authCode,
        })
        .then((response) => {
          alert("회원가입 성공!");
        })
        .catch((error) => {
          alert("회원가입 실패!");
        });
    }
  };

  const toggleSubmitButton = () => {
    // 모든 유효성 검사 통과 시 버튼 활성화
    const submitButton = document.getElementById("submit-button");
    if (isEmailValid && isNicknameValid && isPasswordValid && isAuthCodeValid) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  };

  return (
    <div className="container">
      <h2>회원가입</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일 입력"
          />
          <div>{emailFeedback}</div>
          <button
            type="button"
            onClick={handleSendAuthCode}
            disabled={!isEmailValid}
          >
            이메일 인증
          </button>
        </div>

        {authCodeSent && (
          <div>
            <label htmlFor="auth-code">인증 코드:</label>
            <input
              type="text"
              id="auth-code"
              value={authCode}
              onChange={handleAuthCodeChange}
              placeholder="인증 코드 입력"
            />
            <button
              type="button"
              onClick={handleVerifyAuthCode}
              disabled={!authCode}
            >
              인증 코드 확인
            </button>
            <div>{authCodeFeedback}</div>
          </div>
        )}

        <div>
          <label htmlFor="nickname">닉네임:</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임 입력"
          />
          <div>{nicknameFeedback}</div>
        </div>

        <div>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호 입력"
          />
          <div>{passwordFeedback}</div>
        </div>

        <div>
          <label htmlFor="confirm-password">비밀번호 확인:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="비밀번호 확인 입력"
          />
        </div>

        <button type="submit" id="submit-button" disabled>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUp;
