import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ⭐ Link 컴포넌트 추가
import './AdminPage.css';
import AdminHeader from '../component/AdminHeader.jsx';

function AdminPage() {
  const [adminInfo, setAdminInfo] = useState({ adminName: '', hospitalName: '' });
  const [loading, setLoading] = useState(true);

  // 관리자 정보를 불러오는 함수
  const fetchAdminInfo = async () => {
    // 실제 API를 통해 관리자 정보를 가져와야 합니다.
    // 여기서는 임시 데이터로 설정합니다.
    return { adminName: '김관리', hospitalName: '구름대병원' };
  };

  // 컴포넌트가 처음 렌더링될 때 관리자 정보 불러오기
  useEffect(() => {
    const loadAdminInfo = async () => {
      setLoading(true);
      const data = await fetchAdminInfo();
      setAdminInfo(data);
      setLoading(false);
    };

    loadAdminInfo();
  }, []);

  // 데이터 로딩 중일 때 로딩 화면 표시
  if (loading) {
    return <div style={{ textAlign: 'center', fontSize: '300px' }}>로딩 중...</div>;
  }

  return (
    <div>
      <div>
        <AdminHeader 
          adminName={adminInfo.adminName} 
          hospitalName={adminInfo.hospitalName} 
        />
      </div>
      <div className="container">
        <div className="admin-card admin-card--large">
          <h1 className="card__heading">관리자 페이지</h1>
        </div>
        <div className="card-wrapper">
          {/* ⭐ 날짜 · 시간 관리 영역에 Link 추가 */}
          <Link to="/admin/settings/date" className="admin-card admin-card--small">
            <h1 className="card-title">날짜 · 시간 관리</h1>
          </Link>
          {/* ⭐ 진료실 관리 영역에 Link 추가 */}
          <Link to="/admin/settings/room" className="admin-card admin-card--small">
            <h1 className="card-title">진료실 관리</h1>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;