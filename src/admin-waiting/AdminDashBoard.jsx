import React, { useState, useEffect } from 'react';
import StatusColumn from '../StatusColumn.jsx';
import AdminHeader from '../component/AdminHeader.jsx';
import UserModal from '../component/UserModal.jsx';
import './AdminDashBoard.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({ adminName: '', hospitalName: '' });
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 환자 정보
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // 1. 관리자 정보와 병원 정보를 백엔드에서 가져오는 가상의 함수
    const fetchAdminInfo = async () => {
      //const response = await fetch('/api/admin-info');
      //if (!response.ok) {
      //  throw new Error('관리자 정보를 불러오지 못했습니다.');
      //}
      //const data = await response.json();
      //return data;

      return { adminName: '박승원', hospitalName: '가톨릭대학교' };
    };

    // 2. 사용자 목록을 가져오는 가상의 함수
    // 2. 사용자 목록을 가져오는 함수 (API + 더미 병합)
const fetchUsers = async () => {
  try {
    // 실제 API 호출 시
    const response = await fetch('http://13.124.250.98:8080/api/appointments/today');
    if (!response.ok) {
      throw new Error('환자 정보를 불러오지 못했습니다.');
    }
    const data = await response.json();

    // API 데이터가 없거나 테스트용 더미
    const dummyData = [
      { id: 1, name: '김민수', age: 1, gender:'남성', department:'정형외과', appointmentTime: '12:30', status: '대기 중'},
      { id: 2, name: '김민수', age: 2, gender:'남성', department:'내과', appointmentTime: '13:30', status: '내원 전' },
      { id: 3, name: '김민수', age: 3, gender:'남성', department:'치과', appointmentTime: '14:30', status: '대기 중' },
      { id: 4, name: '김민수', age: 4, gender:'남성', department:'정형외과', appointmentTime: '15:30', status: '대기 중' },
      { id: 5, name: '김민수', age: 5, gender:'남성', department:'정형외과', appointmentTime: '16:30', status: '대기 중' },
      { id: 6, name: '김민수', age: 6, gender:'남성', department:'산부인과', appointmentTime: '17:30', status: '내원 전' },
      { id: 7, name: '김민수', age: 7, gender:'남성', department:'산부인과', appointmentTime: '18:30', status: '내원 전' },
      { id: 8, name: '김민수', age: 8, gender:'남성', department:'정형외과', appointmentTime: '19:30', status: '대기 중' },
      { id: 9, name: '김민수', age: 9, gender:'남성', department:'안과', appointmentTime: '20:00', status: '대기 중' },
      { id: 10, name: '김민수', age: 10, gender:'남성', department:'치과', appointmentTime: '20:30', status: '호출됨' },
    ];

    // API 데이터가 비어있으면 더미 데이터 반환
    if (!data || data.length === 0) {
      return dummyData;
    }

    // 실제 API 데이터 + 더미 병합
    return [...data, ...dummyData];

  } catch (error) {
    console.error('API 호출 실패, 더미 데이터 사용:', error);

    // 에러 발생 시 더미 반환
    return [
      { id: 1, name: '김일수', age: 1, gender:'남성', department:'정형외과', appointmentTime: '12:30', status: '대기 중'},
      { id: 2, name: '김이수', age: 2, gender:'남성', department:'내과', appointmentTime: '13:30', status: '내원 전' },
      { id: 3, name: '김삼수', age: 3, gender:'남성', department:'치과', appointmentTime: '14:30', status: '대기 중' },
      { id: 4, name: '김사수', age: 4, gender:'남성', department:'정형외과', appointmentTime: '15:30', status: '대기 중' },
      { id: 5, name: '김오수', age: 5, gender:'남성', department:'정형외과', appointmentTime: '16:30', status: '대기 중' },
      { id: 6, name: '김육수', age: 6, gender:'남성', department:'산부인과', appointmentTime: '17:30', status: '내원 전' },
      { id: 7, name: '김칠수', age: 7, gender:'남성', department:'산부인과', appointmentTime: '18:30', status: '내원 전' },
      { id: 8, name: '김팔수', age: 8, gender:'남성', department:'정형외과', appointmentTime: '19:30', status: '대기 중' },
      { id: 9, name: '김구수', age: 9, gender:'남성', department:'안과', appointmentTime: '20:00', status: '대기 중' },
      { id: 10, name: '김십수', age: 10, gender:'남성', department:'치과', appointmentTime: '20:30', status: '호출됨' },
    ];
  }
};


    const loadData = async () => {
      try {
        setLoading(true);
        const adminData = await fetchAdminInfo();
        const usersData = await fetchUsers();
        
        setAdminInfo(adminData);
        setUsers(usersData);
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);


  const handleCall = (userId) => {
    try{
      const newUsers = users.map(user => 
        user.id === userId ? { ...user, status: '호출됨' } : user
      );
      setUsers(newUsers);
      //const response = await fetch(`http://backend-api.com/api/users/${userId}/status`, {
      //method: 'PUT',
      //headers: {
      //  'Content-Type': 'application/json',
      //},
      //body: JSON.stringify({ status: '호출됨' }),
    //});

    //if (!response.ok) {
    //  throw new Error('상태 업데이트에 실패했습니다.');
    //}

    console.log('성공적으로 호출하였습니다.');

  } catch (error) {
    console.error("상태 업데이트 오류:", error);
  //  alert('호출에 실패했습니다. 다시 시도해 주세요.');
    }
  };

// ⚠️ 모달을 여는 핸들러 함수
  const handleCardClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  // ⚠️ 모달을 닫는 핸들러 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`;

  
  const pendingUsers = users.filter(user => user.status === '내원 전');
  const waitingUsers = users.filter(user => user.status === '대기 중');
  const calledUsers = users.filter(user => user.status === '호출됨');

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>;
  }
  
  return (
    <div style={{ padding: '24px' }}>
      <div>
        <AdminHeader adminName={adminInfo.adminName} hospitalName={adminInfo.hospitalName} onToggleSidebar={handleToggleSidebar} />
      {isSidebarOpen && <Sidebar onClose={handleToggleSidebar} />}
      </div>
      
      <div className='patient-list'>
        <div className='waiting-box'>
          <div className='waiting-info'>
            <h2 className='waiting-title'>대기 목록</h2>
            <p>대기 목록입니다.</p>
          </div>
          <p className="waiting-date">{formattedDate}</p>
        </div>
        <div className='status-list'>
          <StatusColumn title="내원 전" users={pendingUsers} onCall={handleCall} onCardClick={handleCardClick}/>
          <StatusColumn title="대기 중" users={waitingUsers} onCall={handleCall} onCardClick={handleCardClick}/>
          <StatusColumn title="호출됨" users={calledUsers} onCall={handleCall} onCardClick={handleCardClick}/>
        </div>
      </div>
      {isModalOpen && selectedUser && (
        <UserModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default AdminDashboard;
