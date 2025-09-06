import React, { useState, useEffect } from 'react';
import AdminHeader from '../component/AdminHeader.jsx';
import UserModal from '../component/UserModal.jsx';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './AdminSetting.css';
import UserAdminList from './UserAdminList.jsx';
import TimeSlots from './TimeSlots.jsx';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_REACT_APP_ADMIN_URL;

function AdminSetting() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({ adminName: '', hospitalName: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const today = new Date();

  const statusMap = {
    SCHEDULED: '내원전',
    WAITING: '내원전',
    BOOKED: '예약됨',
    ARRIVED: '대기중',
    CALLED: '호출됨',
    COMPLETED: '완료됨',
    CANCELLED: '취소됨',
  };

  const token = localStorage.getItem("token");

  // 날짜별 예약 조회
  const fetchAppointmentsByDate = async (date) => {
    setLoading(true);
    try {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;

      const response = await fetch(`${BASE_URL}/appointments/date?date=${formattedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('예약 정보를 불러오지 못했습니다.');
      const data = await response.json();

      // data.data 배열을 바로 map 처리
      const formattedList = (data.data || []).map(item => ({
        ...item,
        name: item.memberName,
        status: statusMap[item.status] || item.statusDescription
      }));

      setUsers(formattedList);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAdminInfo({ adminName: '김관리', hospitalName: '구름대병원' });
    fetchAppointmentsByDate(selectedDate);
  }, []);

  const handleCardClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleToggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const handleGoBack = () => navigate('/admin/settings');

  // 상태 필터링
  const pendingUsers = users.filter(user => user.status === '내원전');

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>로딩 중...</div>;

  return (
    <div style={{ padding:'24px' }}>
      <AdminHeader 
        adminName={adminInfo.adminName} 
        hospitalName={adminInfo.hospitalName} 
        onToggleSidebar={handleToggleSidebar} 
      />

      {isSidebarOpen && <div><button onClick={handleToggleSidebar}>닫기</button></div>}

      <div className='system-list'>
        <div>
          <button className="back-page" onClick={handleGoBack}>← 뒤로 가기</button>
        </div>
        <div className='date-box'>
          <div className='date-info'>
            <h2 className='date-title'>날짜 • 시간 관리</h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                fetchAppointmentsByDate(date);
              }}
              dateFormat="yyyy.MM.dd"
              className="waiting-date"
              placeholderText="날짜 선택"
              minDate={today}
            />
          </div>
        </div>

        <div className="system-box">
          <UserAdminList 
            title="날짜별 예약 목록" 
            users={pendingUsers} 
            onCardClick={handleCardClick} 
          />
          <div className="timetable-control">
            <TimeSlots
              BASE_URL={BASE_URL}
              token={token}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>

      {isModalOpen && selectedUser && <UserModal user={selectedUser} onClose={handleCloseModal} />}
    </div>
  );
}

export default AdminSetting;
