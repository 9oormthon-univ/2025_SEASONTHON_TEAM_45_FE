import React from 'react';
import './UserModal.css'; // 모달 스타일링을 위한 CSS 파일

const UserModal = ({ onClose, user }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>

        <h3>환자 상세 정보</h3>
        <p>이름: {user.name}</p>
        <p>나이: {user.age}세</p>
        <p>진료과: {user.department}</p>
        <p>예약 시간: {user.appointmentTime}</p>
        <p>현재 상태: {user.status}</p>

      </div>
    </div>
  );
};

export default UserModal;