import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "./AdminHeader.css";

const AdminHeader = ({ adminName, hospitalName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 가져오기

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isMenuOpen && !e.target.closest('.dropdown-container')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="admin-header">
      <Link to="/admin/dashboard">
        <div className="logo-placeholder"></div>
      </Link>

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
            <div className="header-dropdown-menu">
              <Link
                to="/admin/dashboard"
                className={`menu-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
              >
                대기 목록
              </Link>
              <Link
                to="/admin/settings"
                className={`menu-item ${location.pathname === '/admin/settings' ? 'active' : ''}`}
              >
                관리자 페이지
              </Link>
              <Link to="/" className="menu-item" onClick={handleLogout}>
                로그아웃
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
