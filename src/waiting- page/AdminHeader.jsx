import './AdminHeader.css';

const AdminHeader = ({ adminName, hospitalName, onToggleSidebar }) => {
  return (
    <header className="admin-header">

      <div className="logo-placeholder"></div>

      <div className="right-section">
        <div className="admin-info">
            <h2 className="hospital-name">{hospitalName}</h2>
            <span className="admin-name">관리자 {adminName}</span>
        </div>
        <button className="admin-toggle" onClick={onToggleSidebar}>
          ▼
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
