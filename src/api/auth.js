import axios from 'axios';

const ADMIN_URL = import.meta.env.VITE_REACT_APP_ADMIN_URL; // Vite 환경에서 올바른 접근

const BASE_URL = `${ADMIN_URL}/auth/hospital`;

// 토큰 관리 헬퍼 함수들
export const tokenManager = {
  // 토큰 저장
  setTokens: (accessToken, refreshToken = null) => {
    localStorage.setItem('token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    // 토큰 저장 시간도 기록 (만료 시간 추정용)
    localStorage.setItem('tokenSetTime', Date.now().toString());
  },

  // 토큰 가져오기
  getToken: () => localStorage.getItem('token'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),

  // 토큰 삭제
  clearTokens: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenSetTime');
  },

  // 토큰 만료 여부 확인 (JWT 디코딩)
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      // JWT payload 디코딩
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // exp 필드가 있으면 확인, 없으면 저장 시간 기준으로 추정 (보통 1시간)
      if (payload.exp) {
        return payload.exp < currentTime;
      } else {
        // exp 필드가 없으면 저장 시간 기준으로 1시간 후 만료로 추정
        const tokenSetTime = localStorage.getItem('tokenSetTime');
        if (tokenSetTime) {
          const oneHour = 60 * 60 * 1000; // 1시간을 밀리초로
          return Date.now() - parseInt(tokenSetTime) > oneHour;
        }
        return true;
      }
    } catch (error) {
      console.error('토큰 디코딩 실패:', error);
      return true; // 디코딩 실패 시 만료된 것으로 처리
    }
  },

  // 토큰이 곧 만료될 예정인지 확인 (5분 전)
  isTokenExpiringSoon: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const fiveMinutes = 5 * 60; // 5분
      
      if (payload.exp) {
        return payload.exp - currentTime < fiveMinutes;
      }
      return false;
    } catch (error) {
      return true;
    }
  }
};

// 토큰 갱신 API (서버에 refresh token 엔드포인트가 있다고 가정)
export const refreshAccessToken = async () => {
  try {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const response = await axios.post(
      `${BASE_URL}/refresh`, // refresh 엔드포인트 (서버에 맞게 수정)
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data?.data || response.data;
    if (data.accessToken) {
      tokenManager.setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    }
    
    throw new Error('No access token in refresh response');
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    tokenManager.clearTokens();
    
    // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    
    throw error;
  }
};

// 자동 토큰 갱신이 포함된 API 요청 함수
export const makeAuthenticatedRequest = async (requestConfig) => {
  let token = tokenManager.getToken();
  
  // 토큰이 없으면 에러
  if (!token) {
    throw new Error('No token available');
  }
  
  // 토큰이 만료되었거나 곧 만료될 예정이면 갱신 시도
  if (tokenManager.isTokenExpired(token) || tokenManager.isTokenExpiringSoon(token)) {
    try {
      token = await refreshAccessToken();
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }
  
  // 요청에 토큰 헤더 추가
  const config = {
    ...requestConfig,
    headers: {
      ...requestConfig.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    // 401 에러 (인증 실패) 시 토큰 갱신 재시도
    if (error.response?.status === 401) {
      try {
        token = await refreshAccessToken();
        
        // 갱신된 토큰으로 재요청
        config.headers['Authorization'] = `Bearer ${token}`;
        const retryResponse = await axios(config);
        return retryResponse;
      } catch (refreshError) {
        console.error('토큰 갱신 후 재요청 실패:', refreshError);
        throw refreshError;
      }
    }
    
    throw error;
  }
};

// 회원가입 API
export const signUp = async (adminName, adminEmail, adminPassword, hospitalName, hospitalAddress) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/sign-up`,
      {
        adminName,
        adminEmail,
        adminPassword,
        hospitalName,
        hospitalAddress
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data?.data || response.data;
    
    // 회원가입 성공 시 토큰 저장
    if (data.accessToken) {
      tokenManager.setTokens(data.accessToken, data.refreshToken);
    }
    
    return data;
  } catch (error) {
    console.error('회원가입 오류:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// 로그인 API
export const signIn = async (adminEmail, adminPassword) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/sign-in`,
      { adminEmail, adminPassword },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data?.data || response.data;
    
    // 로그인 성공 시 토큰 저장
    if (data.accessToken) {
      tokenManager.setTokens(data.accessToken, data.refreshToken);
    }
    
    return data;
  } catch (error) {
    console.error('로그인 오류:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// 로그아웃 API
export const signOut = async () => {
  try {
    const token = tokenManager.getToken();
    
    if (token) {
      // 서버에 로그아웃 요청 (선택사항)
      await makeAuthenticatedRequest({
        method: 'POST',
        url: `${BASE_URL}/sign-out`
      });
    }
  } catch (error) {
    console.error('로그아웃 오류:', error);
  } finally {
    // 로컬 토큰 삭제
    tokenManager.clearTokens();
  }
};

// 토큰 상태 확인 함수
export const checkTokenStatus = () => {
  const token = tokenManager.getToken();
  
  if (!token) {
    return { valid: false, expired: true, message: 'No token found' };
  }
  
  if (tokenManager.isTokenExpired(token)) {
    return { valid: false, expired: true, message: 'Token expired' };
  }
  
  if (tokenManager.isTokenExpiringSoon(token)) {
    return { valid: true, expired: false, expiringSoon: true, message: 'Token expiring soon' };
  }
  
  return { valid: true, expired: false, expiringSoon: false, message: 'Token valid' };
};