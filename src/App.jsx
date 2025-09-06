import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './admin-login/LoginPage.jsx';
import AdminPage from './admin-setting/AdminPage.jsx';
import AdminDateSetting from './admin-date-setting/AdminSetting.jsx';
import AdminRoomSetting from './admin-room-setting/AdminRoomSetting.jsx';
import AdminDashboard from './admin-waiting/AdminDashBoard.jsx';
import './api/auth.js'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  
  // const DUMMY_USER = {
  //   adminName: '김관리',
  //   adminEmail: 'test@example.com',
  //   adminPassword: 'password123',
  //   hospitalName: '구름대병원',
  //   hospitalAddress: 'Seoul, Korea'
  // };

  useEffect(() => {
    const handleInitialSetup = async () => {
      try {
        // console.log('백그라운드에서 회원가입을 시작합니다...');

        // await signUp(
        //   DUMMY_USER.adminName,
        //   DUMMY_USER.adminEmail,
        //   DUMMY_USER.adminPassword,
        //   DUMMY_USER.hospitalName,
        //   DUMMY_USER.hospitalAddress
        // );
        // console.log('회원가입 완료');

      } catch (error) {
        console.error(
          '회원가입 실패:',
          error.response ? error.response.data : error.message
        );
      }
    };
    handleInitialSetup();

    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <AdminDashboard handleLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute>
          <AdminPage handleLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings/date" element={
        <ProtectedRoute>
          <AdminDateSetting />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings/room" element={
        <ProtectedRoute>
          <AdminRoomSetting />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
    </Routes>
  );
}

export default App;
