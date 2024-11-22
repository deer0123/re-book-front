import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/UserContext.js';
import { jwtDecode } from 'jwt-decode';

import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  const navigate = useNavigate();
  const { onLogin } = useContext(AuthContext);

  const doLogin = async () => {
    const loginData = {
      email,
      password,
    };

    setIsLoading(true); // 로딩 시작
    try {
      const res = await axios.post(
        'http://localhost:8181/sign-in', // 환경 변수로 API URL 관리
        loginData
      );

      console.log('로그인 성공:', res);

      // 응답 데이터 처리
      alert('로그인 성공!');
      const token = res.data.result.token;
      const id = res.data.result.id;
      const role = jwtDecode(token).role;
      localStorage.setItem('token', token);
      onLogin(token, id, role); // Context에 상태 전달
      navigate('/'); // 메인 페이지로 이동
    } catch (e) {
      console.error('로그인 실패:', e.response?.data || e.message);
      const errorMessage = e.response?.data?.statusMessage || '로그인 실패!';
      alert(errorMessage);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardHeader title="로그인" style={{ textAlign: 'center' }} />
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                doLogin();
              }}
            >
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button color="secondary" fullWidth>
                    비밀번호 변경
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    fullWidth
                    disabled={isLoading} // 로딩 중 버튼 비활성화
                  >
                    {isLoading ? '로그인 중...' : '로그인'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
