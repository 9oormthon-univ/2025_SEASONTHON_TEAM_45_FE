import { useState } from 'react';
import './App.css';
import Login from './pages/LoginPage.jsx'; // 로그인 페이지
import AdminDashboard from './AdminDashboard.jsx'; // 관리자 페이지

function App() {
  // 로그인 상태를 관리하는 state
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? (
        <AdminDashboard />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;