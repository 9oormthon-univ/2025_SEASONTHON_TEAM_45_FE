import { useState } from "react";
import "./AdminHeader.css";

const AdminHeader = ({ adminName, hospitalName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const goToAdminSettings = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // 토큰 있으면 관리자 설정 페이지로 이동
      window.location.href = "/admin/settings";
    } else {
      // 토큰 없으면 로그인 페이지로 이동
      window.location.href = "/login";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // 토큰 삭제
    window.location.href = "/login";   // 로그인 페이지로 이동
  };

  return (
    <header className="admin-header">
      <div className="logo-placeholder"></div>

      <div className="right-section">
        <div className="admin-info">
          <h2 className="hospital-name">{hospitalName}</h2>
          <span className="admin-name">관리자 {adminName}</span>
        </div>

        <div className="dropdown-container">
          <button
            type="button"
            className="admin-toggle"
            onClick={toggleMenu}
          >
            ▼
          </button>

          {isMenuOpen && (
            <div className="dropdown-menu">
              <div className="menu-item" onClick={goToAdminSettings}>
                관리자 설정
              </div>
              <div className="menu-item" onClick={handleLogout}>
                로그아웃
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
