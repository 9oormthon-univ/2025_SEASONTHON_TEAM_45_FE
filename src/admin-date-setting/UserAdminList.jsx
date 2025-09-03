// UserAdminList.jsx
import React, { useState } from 'react';
import UserCardRow from './UserCardRow.jsx';
import './UserAdminList.css';

function UserAdminList({ title, users, onCall, onCardClick }) {
  const [sortOrder, setSortOrder] = useState('desc');
  const statusMap = {
    '내원 전': 'status-type-pre-visit',
    '대기 중': 'status-type-on-call',
    '호출됨': 'status-type-visited',
  };
  
  const statusClass = statusMap[title] || '';
  
  const handleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const sortedUsers = [...users].sort((a, b) => {
    const timeA = a.appointmentTime;
    const timeB = b.appointmentTime;
    
    if (sortOrder === 'desc') {
      return timeB.localeCompare(timeA);
    } else {
      return timeA.localeCompare(timeB);
    }
  });

  if (!users || users.length === 0) {
    return (
      <div className={`status-column ${statusClass}`}>
        <div className="status-box">
          <div className="status-info">
            <h3 className="status-title">{title}</h3>
            <p className="status-sub">부연설명입니다</p>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>예약이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="status-column">
      <div className="status-box">
        <div className="status-info">
          <div className="status-title-circle">
            <span className="status-circle"></span>
            <h3 className="status-title">{title}</h3>
          </div>
          <p className="status-sub">부연설명입니다</p>
        </div>
        <button onClick={handleSort} className='sorted-button'>
          {sortOrder === 'desc' ? '최신순 ▼' : '오래된순 ▲'}
        </button>
      </div>
      <div className="user-card-list">
        {sortedUsers.map(user => (
          <UserCardRow 
            key={user.id} 
            user={user} 
            onCall={onCall} 
            onCardClick={onCardClick} 
          /> 
        ))}
      </div>
    </div>
  );
}

export default UserAdminList;