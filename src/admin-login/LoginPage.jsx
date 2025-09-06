import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import { signIn } from '../api/auth.js';
import './LoginPage.css'

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signIn(email, password);
      const { accessToken } = response;
      
      if (accessToken) {
        localStorage.setItem('jwt_token', accessToken);
        console.log('로그인 성공! 엑세스 토큰:', accessToken);
        
        onLoginSuccess(); 

        navigate('/admin/dashboard'); 
      } else {
        console.error('로그인 실패: 엑세스 토큰이 없습니다.');
        alert('로그인에 실패했습니다. (토큰 없음)');
      }
      
    } catch (error) {
      console.error('로그인 실패:', error.response ? error.response.data : error.message);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo"></div>
      <h1 className="login-title">관리자 페이지</h1>
      <form onSubmit={handleSubmit}>
        <input 
          id="username"
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="아이디 입력"
          required
        />
        <input 
          id="password"
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="비밀번호 입력"
          required
        />
        <button id="loginBtn" type="submit" className="login-btn">다음으로</button>
      </form>
    </div>
  );
}

export default LoginPage;
