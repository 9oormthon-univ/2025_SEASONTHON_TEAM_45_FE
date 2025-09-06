import React, { useState } from 'react';
import UserCard from './UserCard.jsx';
import './StatusColumn.css';

function StatusColumn({ title, users, onCall, onCardClick }) {
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
    <div className={`waiting-status-column ${statusClass}`}> 
      <div className="status-box">
        <div className="status-info">
          <div className="status-title-circle">
            <span className="status-circle"></span>
            <h3 className="status-title">{title}</h3>
          </div>
          {/* <p className="status-sub">부연설명입니다</p> */}
        </div>
        <button onClick={handleSort} className='sorted-button'>
          {sortOrder === 'desc' ? '최신순 ▼' : '오래된순 ▲'}
        </button>
      </div>
      <div className="user-card-list">
        {sortedUsers.map(user => (
          <UserCard 
            key={user.appointmentId} 
            user={user} 
            onCall={onCall} 
            onCardClick={onCardClick} 
          /> 
        ))}
      </div>
    </div>
  );
}

export default StatusColumn;