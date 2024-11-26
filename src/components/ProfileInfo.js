import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // AuthContext import
import "./ProfileInfo.css"; // CSS 파일을 import

const ProfileInfo = () => {
  const { token, setUserName } = useContext(AuthContext); // AuthContext에서 token 가져오기
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // 닉네임 수정 모드 상태
  const [newNickname, setNewNickname] = useState(""); // 수정할 닉네임
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8181/profile/info", {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 포함
          },
        });

        if (response.data && response.data.result) {
          const { nickname, email, createdAt } = response.data.result.member;
          setProfile({ nickname, email, createdAt }); // 가져온 값만 저장
        } else {
          setError("회원 정보 조회에 실패했습니다.");
        }
      } catch (err) {
        setError("회원 정보 조회 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]); // token이 변경될 때마다 호출

  const handleNicknameChange = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8181/profile/change-nickname",
        { newNickname }, // 데이터가 JSON 형식으로 전송됩니다
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.result) {
        setUserName(newNickname);
        setProfile((prevProfile) => ({
          ...prevProfile,
          nickname: newNickname, // 닉네임 변경
        }));
        setIsEditing(false); // 수정 완료 후 모드 종료
      }
    } catch (err) {
      setError("닉네임 변경에 실패했습니다.");
      console.error(err);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1>내 프로필</h1>

      {profile ? (
        <div className="profile-info">
          <div className="profile-details">
            <p>
              <strong>닉네임:</strong> {profile.nickname}
            </p>
            <p>
              <strong>이메일:</strong> {profile.email}
            </p>
            <p>
              <strong>가입일:</strong> {profile.createdAt}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="edit-nickname-btn"
          >
            닉네임 변경
          </button>

          {/* 닉네임 수정 모드 */}
          {isEditing && (
            <div className="nickname-edit-modal">
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                placeholder="새로운 닉네임"
              />
              <button onClick={handleNicknameChange}>변경</button>
              <button onClick={() => setIsEditing(false)}>취소</button>
            </div>
          )}
        </div>
      ) : (
        <div>프로필 정보가 없습니다.</div>
      )}
    </div>
  );
};

export default ProfileInfo;
