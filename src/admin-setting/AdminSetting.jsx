import React, { useState, useEffect } from 'react';
import AdminHeader from '../component/AdminHeader.jsx';
import UserModal from '../component/UserModal.jsx';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './AdminSetting.css';
import UserAdminList from './UserAdminList.jsx';
import TimeSlots from './TimeSlots.jsx';

function AdminSetting() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({ adminName: '', hospitalName: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // 날짜 선택 state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAdminInfo = async () => ({ adminName: '박승원', hospitalName: '가톨릭대학교' });

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://13.124.250.98:8080/api/appointments/today');
        if (!response.ok) throw new Error('환자 정보를 불러오지 못했습니다.');
        const data = await response.json();
        return data.length ? data : getDummyData();
      } catch (e) {
        console.error(e);
        return getDummyData();
      }
    };

    const getDummyData = () => [
      { id: 1, name: '김일수', age: 1, gender:'남성', department:'정형외과', appointmentTime: '12:30', status: '대기 중'},
      { id: 2, name: '김이수', age: 2, gender:'남성', department:'내과', appointmentTime: '13:30', status: '내원 전'},
      { id: 3, name: '김삼수', age: 3, gender:'남성', department:'치과', appointmentTime: '14:30', status: '대기 중'},
      // ... 더미 데이터 추가
    ];

    const loadData = async () => {
      setLoading(true);
      const adminData = await fetchAdminInfo();
      const usersData = await fetchUsers();
      setAdminInfo(adminData);
      setUsers(usersData);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleCall = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: '호출됨' } : user
    ));
    console.log('성공적으로 호출하였습니다.');
  };

  const handleCardClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

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

  if (loading) return <div style={{ textAlign: 'center', padding: '500px' }}>로딩 중...</div>;

  return (
    <div style={{ padding:'24px' }}>
      <div>
        <AdminHeader 
          adminName={adminInfo.adminName} 
          hospitalName={adminInfo.hospitalName} 
          onToggleSidebar={handleToggleSidebar} 
        />
      </div>

      <div className='system-list' >
        <div>
          <button className="back-page">← 뒤로 가기</button>
        </div>
        <div className='date-box'>
          <div className='date-info'>
            <h2 className='date-title'>날짜 • 시간 관리</h2>
            <p>관리자 페이지입니다.</p>
          </div>

          {/* 날짜 선택 달력 */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy.MM.dd"
              minDate={new Date(formattedDate)}
              //maxDate={new Date()}
              className="waiting-date"
              placeholderText="날짜 선택"
              popperPlacement="bottom-start"
            />
          </div>
        </div>

        <div className="system-box">
          <div className="admin-list">
            <UserAdminList title="날짜별 예약 목록" users={pendingUsers} onCall={handleCall} onCardClick={handleCardClick}/>
            
          </div>
          <div className="timetable-control">
            <TimeSlots></TimeSlots>
            
          </div>
      </div>
</div>
      {isModalOpen && selectedUser && (
        <UserModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default AdminSetting;
