import React from 'react';
import axios from 'axios';
import './UserModal.css'; // 모달 스타일링

// ------------------------------
// 유틸 함수
// ------------------------------
function calculateAge(birthDateStr) {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function formatTime(timeStr) {
  const [hourStr, minute] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? '오후' : '오전';
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  return `${period} ${hour}시 ${minute}분`;
}

function formatGender(gender) {
  if (gender === '남성') return '(남)';
  if (gender === '여성') return '(여)';
  return '';
}

function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  if (cleaned.length === 10) return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  return phone;
}

// 상태별 클래스 매핑
const statusMap = {
  '내원전': 'status-type-pre-visit',
  '대기중': 'status-type-on-call',
  '호출됨': 'status-type-visited',
};

// ------------------------------
// UserModal 컴포넌트
// ------------------------------
const API = import.meta.env.VITE_REACT_APP_ADMIN_URL;

const UserModal = ({ onClose, user, fetchAppointments }) => {
  if (!user) return null;

  const age = calculateAge(user.memberBirthDate);
  const genderShort = formatGender(user.memberGender);
  const formattedTime = formatTime(user.appointmentTime);
  const formattedPhone = formatPhoneNumber(user.memberPhoneNumber);
  const statusClass = statusMap[user.status] || '';
  const token = localStorage.getItem("token");

  // ------------------------------
  // 삭제 버튼 핸들러
  // ------------------------------
  const handleDeletePatient = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.delete(`${API}/api/v1/appointments/${user.appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      
      alert("환자가 삭제되었습니다.");
      console.log("삭제할 appointmentId:", user.appointmentId);

      if (fetchAppointments) fetchAppointments(); // 리스트 갱신
      onClose(); // 모달 닫기
    } catch (error) {
      console.error(error);
      alert("환자 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>

        {/* ------------------------------
              제목 + 버튼 영역
            ------------------------------ */}
        <div className='modal-title-area'>
          <div className='modal-title'>
            <p>{user.memberName}</p>
            <p>만 {age}세</p>
            <p>{genderShort}</p>
          </div>

          <div className='modal-button-area'>
            <button className="delete-patient" onClick={handleDeletePatient}>삭제</button>
            <button className="modal-close-button" onClick={onClose}></button>
          </div>
        </div>

        {/* ------------------------------
              상세 정보 영역
            ------------------------------ */}
        <div className='modal-area'>
          {/* 왼쪽 영역 */}
          <div className='modal-left-area'>
            <div className='modal-part'>
              <p className='modal-info-title'>상태</p>
              <div className={`modal-circle-area ${statusClass}`}>
                <span className="status-circle"></span>
                <span className='modal-info'>{user.status}</span>
              </div>
            </div>
            <div className='modal-part'>
              <p className='modal-info-title'>진료과</p>
              <span className='modal-info'>{user.department}</span>
            </div>
          </div>

          {/* 오른쪽 영역 */}
          <div className='modal-right-area'>
            <div className='modal-part'>
              <p className='modal-info-title'>전화번호</p>
              <span className='modal-info'>{formattedPhone}</span>
            </div>
            <div className='modal-part'>
              <p className='modal-info-title'>방문 예정 시간</p>
              <span className='modal-info'>{formattedTime}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserModal;
