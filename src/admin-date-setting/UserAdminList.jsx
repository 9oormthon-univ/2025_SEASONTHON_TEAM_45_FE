// UserAdminList.jsx
import React, { useState } from 'react';
import UserCardRow from './UserCardRow.jsx';
import './UserAdminList.css';

function UserAdminList({ title, users, onCardClick }) {
  const [sortOrder, setSortOrder] = useState('desc');
  const statusMap = {
    '내원전': 'status-type-pre-visit',
    '대기중': 'status-type-on-call',
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

   return (
    <div className="future-status-column">
      <div className="future-status-box">
        <div className="future-status-info">
          <div className="future-status-title-circle">
            <span className="daily-status-circle"></span>
            <h3 className="daily-status-title">{title}</h3>
          </div>
        </div>
        <button onClick={handleSort} className='sorted-button'>
          {sortOrder === 'desc' ? '최신순 ▼' : '오래된순 ▲'}
        </button>
      </div>
      <div className="date-user-card-list">
        {sortedUsers.length === 0 ? (
          <div className="no-reservations" style={{ marginTop: '20px' }}>
            예약이 없습니다.
          </div>
        ) : (
          sortedUsers.map(user => (
            <UserCardRow 
              key={user.appointmentId} 
              user={user} 
              onCardClick={onCardClick} 
            />
          ))
        )}
      </div>
    </div>
  );
}

export default UserAdminList;