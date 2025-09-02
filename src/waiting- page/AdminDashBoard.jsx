import React, { useState, useEffect } from 'react';
import StatusColumn from './StatusColumn.jsx';
import AdminHeader from './AdminHeader.jsx';
import UserModal from './UserModal.jsx';
import './AdminDashBoard.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({ adminName: '', hospitalName: '' });
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 환자 정보

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
    const fetchUsers = async () => {
      // const response = await fetch('/api/users');
      //  throw new Error('환자 정보를 불러오지 못했습니다.');
      //}
      // const data = await response.json();
      // return data;

      return [
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
  
  const pendingUsers = users.filter(user => user.status === '내원 전');
  const waitingUsers = users.filter(user => user.status === '대기 중');
  const calledUsers = users.filter(user => user.status === '호출됨');

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>;
  }
  
  return (
    <div style={{ backgroundColor:'#F0F0F0', fontFamily: 'pretendard', padding: '24px' }}>
      <AdminHeader adminName={adminInfo.adminName} hospitalName={adminInfo.hospitalName}/>

      <div className='patient-list'>
        <div className='waiting-box'>
          <div className='waiting-info'>
            <h2 className='waiting-title'>대기 목록</h2>
            <p>대기 목록입니다.</p>
          </div>
          <p className="waiting-date">2025.04.22</p>
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
