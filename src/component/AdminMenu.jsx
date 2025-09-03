import { useNavigate } from "react-router-dom";
import "./AdminMenu.css";

const AdminMenu = ({ onClose }) => {
  const navigate = useNavigate();

  // 관리자 설정 페이지로 이동
  const goToAdminSettings = () => {
    navigate("/admin/settings"); // App.jsx에서 Route로 연결
    if (onClose) onClose();      // 메뉴 닫기
  };

  // 로그아웃 처리 후 로그인 페이지로 이동
  const handleLogout = () => {
    localStorage.removeItem("token"); // 로그인 토큰 삭제
    navigate("/login");
    if (onClose) onClose();           // 메뉴 닫기
  };

  return (
    <div className="dropdown-menu">
      <div className="menu-item" onClick={goToAdminSettings}>
        관리자 설정
      </div>
      <div className="menu-item" onClick={handleLogout}>
        로그아웃
      </div>
    </div>
  );
};

export default AdminMenu;
    