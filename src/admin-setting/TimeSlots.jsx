// TimeSlots.jsx
import React, { useState } from 'react';
import './TimeSlots.css';

const AMSlots = [
  '10:00', '10:30', '11:00', '11:30',
];
const PMSlots = [
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30'
];

function TimeSlots() {
  const initialSlots = [...AMSlots, ...PMSlots];

  const [slots, setSlots] = useState(
    initialSlots.map(time => ({ time, status: 'allow' }))
  );

  const toggleSlot = (time) => {
    setSlots(slots.map(slot =>
      slot.time === time
        ? { ...slot, status: slot.status === 'allow' ? 'deny' : 'allow' }
        : slot
    ));
  };

  const handleApply = () => {
    const unavailable = slots.filter(slot => slot.status === 'deny').map(s => s.time);
    console.log('예약 불가 시간대:', unavailable);
    alert(`예약 불가 시간대: ${unavailable.join(', ')}`);
  };

  return (
    <div className="time-slot-container">
      <div className="status-info">
        <div className="status-title-circle">
          <span className="status-circle"></span>
          <h3 className="status-title">시간 관리</h3>
        </div>
        <p className="status-sub">예약 불가능한 시간을 선택하세요.</p>
      </div>
      
      {/* 오전 시간대 */}
      <div className="time-group">
        <h4>오전</h4>
        <div className="slots-grid">
          {AMSlots.map(time => {
            const slot = slots.find(s => s.time === time);
            return (
              <button
                key={time}
                className={`slot-button ${slot?.status}`}
                onClick={() => toggleSlot(time)}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      {/* 오후 시간대 */}
      <div className="time-group">
        <h4>오후</h4>
        <div className="slots-grid">
          {PMSlots.map(time => {
            const slot = slots.find(s => s.time === time);
            return (
              <button
                key={time}
                className={`slot-button ${slot?.status}`}
                onClick={() => toggleSlot(time)}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      <div className="legend">
        <span><span className="box allow"></span> 예약 허용</span>
        <span><span className="box deny"></span> 예약 거부</span>
      </div>
      <div className="button-box">
        <button className="apply-button" onClick={handleApply}>적용</button>
      </div>
      
    </div>
  );
}

export default TimeSlots;