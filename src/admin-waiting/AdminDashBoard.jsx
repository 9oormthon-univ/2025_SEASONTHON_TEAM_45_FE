import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import StatusColumn from './StatusColumn.jsx';
import AdminHeader from '../component/AdminHeader.jsx';
import UserModal from '../component/UserModal.jsx';
import './AdminDashBoard.css';

const statusMap = {
  WAITING: '내원전',
  SCHEDULED: '내원전',
  BOOKED: '예약됨',
  ARRIVED: '대기중',
  CALLED: '호출됨',
  COMPLETED: '완료됨',
  CANCELLED: '취소됨',
};

// 더미 환자
const dummyAppointments = [
  { appointmentId: 101, memberName: '홍길동', memberPhoneNumber: '010-1111-2222', memberBirthDate: '1992-05-12', memberGender: '남성', hospitalName: '구름대병원', department: '내과', appointmentDate: '2025-09-06', appointmentTime: '15:30', status: 'SCHEDULED', statusDescription: '예약 완료', canCall: true },
  { appointmentId: 102, memberName: '김영희', memberPhoneNumber: '010-3333-4444', memberBirthDate: '1988-08-21', memberGender: '여성', hospitalName: '구름대병원', department: '정형외과', appointmentDate: '2025-09-06', appointmentTime: '10:30', status: 'CALLED', statusDescription: '호출됨', canCall: true },
  { appointmentId: 103, memberName: '박철수', memberPhoneNumber: '010-5555-6666', memberBirthDate: '1995-02-03', memberGender: '남성', hospitalName: '구름대병원', department: '이비인후과', appointmentDate: '2025-09-06', appointmentTime: '13:00', status: 'ARRIVED', statusDescription: '예약 완료', canCall: true },
  { appointmentId: 104, memberName: '최민지', memberPhoneNumber: '010-7777-8888', memberBirthDate: '1990-11-15', memberGender: '여성', hospitalName: '구름대병원', department: '외과', appointmentDate: '2025-09-06', appointmentTime: '09:30', status: 'CALLED', statusDescription: '호출됨', canCall: true },
  { appointmentId: 105, memberName: '이준호', memberPhoneNumber: '010-9999-0000', memberBirthDate: '1985-07-09', memberGender: '남성', hospitalName: '구름대병원', department: '피부과', appointmentDate: '2025-09-06', appointmentTime: '10:00', status: 'CALLEDD', statusDescription: '예약 완료', canCall: true },
  { appointmentId: 106, memberName: '이수현', memberPhoneNumber: '010-1234-1234', memberBirthDate: '1985-08-06', memberGender: '여성', hospitalName: '구름대병원', department: '내과', appointmentDate: '2025-09-06', appointmentTime: '16:00', status: 'SCHEDULED', statusDescription: '예약 완료', canCall: true },
  { appointmentId: 107, memberName: '전지현', memberPhoneNumber: '010-5678-5678', memberBirthDate: '1985-09-09', memberGender: '남성', hospitalName: '구름대병원', department: '정형외과', appointmentDate: '2025-09-06', appointmentTime: '15:00', status: 'SCHEDULED', statusDescription: '예약 완료', canCall: true },
  { appointmentId: 108, memberName: '박대기', memberPhoneNumber: '010-1234-5678', memberBirthDate: '1985-09-09', memberGender: '여성', hospitalName: '구름대병원', department: '정형외과', appointmentDate: '2025-09-06', appointmentTime: '15:30', status: 'SCHEDULED', statusDescription: '예약 완료', canCall: true },
];

const Sidebar = ({ onClose }) => (
  <div>
    <button onClick={onClose}>닫기</button>
    <p>사이드바</p>
  </div>
);

function AdminDashboard() {
  // Vite 환경 변수 사용
  const BASE_URL = import.meta.env.VITE_REACT_APP_ADMIN_URL;
  const token = localStorage.getItem('token');

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({ adminName: '', hospitalName: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  const validateToken = () => {
    if (!token) {
      console.error('토큰이 없습니다.');
      return false;
    }
    return true;
  };

  const handleApiError = (error, operation) => {
    console.error(`${operation} 실패:`, error);
  };

  const fetchDepartments = useCallback(async () => {
    if (!validateToken()) {
      setDepartments(['내과', '정형외과', '이비인후과', '외과', '피부과']);
      console.log('✅ 더미 진료과 로드 완료');
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/admin/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const deptNames = res.data.data?.map(d => d.name) || [];
      setDepartments(deptNames.length ? deptNames : ['내과', '정형외과', '이비인후과', '외과', '피부과']);
      console.log('✅ 서버 진료과 로드 성공:', deptNames);
    } catch (e) {
      handleApiError(e, '진료과 불러오기');
      setDepartments(['내과', '정형외과', '이비인후과', '외과', '피부과']);
    }
  }, [BASE_URL, token]);

  const fetchAppointments = useCallback(async () => {
    if (!validateToken()) {
      setAppointments(dummyAppointments);
      console.log('✅ 더미 예약 데이터 로드 완료');
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/appointments/today`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const apiData = res.data.data || [];
      const formattedApi = apiData.map(a => ({
        ...a,
        status: statusMap[a.status] || a.statusDescription,
        name: a.memberName
      }));
      const formattedDummy = dummyAppointments.map(a => ({
        ...a,
        status: statusMap[a.status] || a.statusDescription,
        name: a.memberName
      }));
      setAppointments([...formattedApi, ...formattedDummy]);
      console.log(`✅ 서버 예약 ${apiData.length}건 + 더미 예약 ${dummyAppointments.length}건 불러오기 성공`);
    } catch (e) {
      handleApiError(e, '예약 불러오기');
      setAppointments(dummyAppointments);
    }
  }, [BASE_URL, token]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setAdminInfo({ adminName: '김관리', hospitalName: '구름대병원' });
      await fetchDepartments();
      await fetchAppointments();
      setLoading(false);
      console.log('✅ AdminDashboard 초기화 완료');
    };
    init();
  }, [fetchDepartments, fetchAppointments]);

  useEffect(() => {
    const interval = setInterval(() => fetchAppointments(), 300000);
    return () => clearInterval(interval);
  }, [fetchAppointments]);

  const handleCall = async (id) => {
    if (!validateToken()) return;
    try {
      await axios.put(`${BASE_URL}/appointments/${id}/status/CALLED`, {}, { headers: { Authorization: `Bearer ${token}` } });
      await fetchAppointments();
      alert('환자 호출 성공');
      console.log(`✅ 환자 호출 성공: appointmentId=${id}`);
    } catch (e) {
      handleApiError(e, '환자 호출');
      alert('환자 호출 실패');
    }
  };

  const handleCardClick = (user) => { setSelectedUser(user); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedUser(null); };
  const handleToggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const handleDepartmentChange = (e) => setSelectedDepartment(e.target.value);

  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`;

  const filteredAppointments = selectedDepartment
    ? appointments.filter(a => a.department === selectedDepartment)
    : appointments;

  const pendingUsers = filteredAppointments.filter(a => a.status === '내원전');
  const waitingUsers = filteredAppointments.filter(a => a.status === '대기중');
  const calledUsers = filteredAppointments.filter(a => a.status === '호출됨');

  if (loading) return <div style={{ textAlign:'center', fontSize:'150px' }}>로딩 중...</div>;

  return (
    <div>
      <AdminHeader adminName={adminInfo.adminName} hospitalName={adminInfo.hospitalName} onToggleSidebar={handleToggleSidebar} />
      {isSidebarOpen && <Sidebar onClose={handleToggleSidebar} />}

      <div className="dashboard">
        <div className="board-waiting-box">
          <div className="board-left-area">
            <div className="board-waiting-info">
              <h2 className="board-waiting-title">대기 목록</h2>
            </div>
          </div>
          <div className="board-right-area">
            <select value={selectedDepartment} onChange={handleDepartmentChange} className="chip-style">
              <option value="">과를 선택하세요</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <p className="board-waiting-date">{formattedDate}</p>
          </div>
        </div>

        <div className="board-status-list">
          <StatusColumn title="내원전" users={pendingUsers} onCall={handleCall} onCardClick={handleCardClick} />
          <StatusColumn title="대기중" users={waitingUsers} onCall={handleCall} onCardClick={handleCardClick} />
          <StatusColumn title="호출됨" users={calledUsers} onCall={handleCall} onCardClick={handleCardClick} />
        </div>
      </div>

      {isModalOpen && selectedUser && <UserModal user={selectedUser} onClose={handleCloseModal} />}
    </div>
  );
}

export default AdminDashboard;
