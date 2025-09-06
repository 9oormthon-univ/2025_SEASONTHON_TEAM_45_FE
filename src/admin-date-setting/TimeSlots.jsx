// TimeSlots.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './TimeSlots.css';

const BASE_URL = import.meta.env.VITE_REACT_APP_ADMIN_URL;


const AMSlots = ['10:00', '10:30', '11:00', '11:30'];
const PMSlots = [
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30'
];

function TimeSlots({ API, token, selectedDate }) {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [slots, setSlots] = useState([]);
  const hospitalId = 1;

  // 🔹 슬롯 초기화
  const initializeSlots = () => {
    const initialSlots = [...AMSlots, ...PMSlots].map(time => ({
      time,
      status: 'allow',
      exceptionId: null,
      isReserved: false
    }));
    setSlots(initialSlots);
    console.log('[Init] 슬롯 초기화 완료', initialSlots);
  };

  useEffect(() => { initializeSlots(); }, []);

  const validateToken = () => {
    if (!token) {
      console.error('토큰이 없습니다. 로그인이 필요합니다.');
      return false;
    }
    return true;
  };

  // 🔹 진료과 불러오기
  const fetchDepartments = useCallback(async () => {
    if (!validateToken()) return;
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/hospitals/${hospitalId}/departments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code === 'HOSPITAL_3002' && Array.isArray(response.data.data)) {
        setDepartments(response.data.data.map(d => ({ id: d.departmentId, name: d.name })));
        console.log('[Fetch Departments] 완료', response.data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error(error);
      const defaultDepartments = [
        { id: 1, name: '정형외과' },
        { id: 2, name: '내과' },
        { id: 3, name: '치과' },
        { id: 4, name: '산부인과' },
        { id: 5, name: '이비인후과' },
        { id: 6, name: '안과' }
      ];
      setDepartments(defaultDepartments);
      console.log('[Fetch Departments] 기본 목록 적용', defaultDepartments);
    }
  }, [API, token, hospitalId]);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

  // 차단 / 예약된 슬롯 불러오기
  const fetchSlots = useCallback(async () => {
    if (!selectedDepartmentId || !selectedDate) return;

    const dateStr = selectedDate.toISOString().split('T')[0];

    try {
      const blockedRes = await axios.get(
        `${BASE_URL}/admin/time-slots/blocked/date?departmentId=${selectedDepartmentId}&date=${dateStr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const blocked = blockedRes.data.data || [];
      console.log('[Fetch Slots] 차단 슬롯', blocked);

      const reservedRes = await axios.get(
        `${BASE_URL}/appointments/date?date=${dateStr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const reservedRaw = reservedRes.data.data || [];
      const reserved = reservedRaw
        .filter(r => r.departmentId === selectedDepartmentId || r.department === departments.find(d => d.id === selectedDepartmentId)?.name)
        .map(r => ({ time: r.appointmentTime.slice(0, 5) }));
      console.log('[Fetch Slots] 예약 슬롯', reserved);

      setSlots(prev => prev.map(slot => {
        const isBlocked = blocked.find(b => b.exceptionTime.slice(0,5) === slot.time);
        const isReserved = reserved.find(r => r.time === slot.time);
        let status = 'allow';
        let exceptionId = null;

        if (isBlocked) {
          status = 'deny';
          exceptionId = isBlocked.exceptionId;
        } else if (isReserved) {
          status = 'reserved';
        }

        return { ...slot, status, exceptionId, isReserved: !!isReserved };
      }));

    } catch (error) {
      console.error('[Fetch Slots] 오류', error);
      alert('슬롯 조회에 실패했습니다.');
    }
  }, [selectedDepartmentId, selectedDate, API, token, departments]);

  useEffect(() => { fetchSlots(); }, [selectedDepartmentId, selectedDate, fetchSlots]);

  // 슬롯 토글 (임시 상태 변경)
  const toggleSlot = (time) => {
    if (!selectedDepartmentId) return alert('먼저 진료과를 선택하세요.');

    setSlots(prevSlots => prevSlots.map(slot => {
      if (slot.time === time) {
        if (slot.isReserved) {
          alert('이미 예약된 시간은 차단할 수 없습니다.');
          return slot;
        }

        let newStatus = slot.status;
        if (slot.status === 'allow' || slot.status === 'pending-allow') {
          newStatus = 'pending-deny';
        } else if (slot.status === 'deny' || slot.status === 'pending-deny') {
          newStatus = 'pending-allow';
        }

        return { ...slot, status: newStatus };
      }
      return slot;
    }));
  };

  // 🔹 적용 버튼: DB에 반영
  const handleApply = async () => {
    const changesToApply = slots.filter(slot =>
      slot.status === 'pending-deny' || slot.status === 'pending-allow'
    );

    if (changesToApply.length === 0) return alert('변경사항이 없습니다.');
    if (!window.confirm('선택한 시간대 변경사항을 적용하시겠습니까?')) return;

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const requests = changesToApply.map(slot => {
        if (slot.status === 'pending-deny') {
          return axios.post(
            `${BASE_URL}/admin/time-slots/block`,
            {
              departmentId: selectedDepartmentId,
              blockDate: dateStr,
              blockTime: slot.time
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else if (slot.status === 'pending-allow') {
          return axios.delete(
            `${BASE_URL}/admin/time-slots/${slot.exceptionId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        return null;
      });

      await Promise.all(requests.filter(req => req !== null));
      console.log('[Apply] 변경 적용 완료', changesToApply);

      // 적용 후 상태를 즉시 deny/allow로 반영
      setSlots(prev => prev.map(slot => {
        const applied = changesToApply.find(ch => ch.time === slot.time);
        if (!applied) return slot;

        if (applied.status === 'pending-deny') return { ...slot, status: 'deny' };
        if (applied.status === 'pending-allow') return { ...slot, status: 'allow', exceptionId: null };
        return slot;
      }));

      await fetchSlots(); // 최종 상태 재조회
      alert('시간대 변경이 성공적으로 적용되었습니다.');
    } catch (error) {
      console.error('[Apply] 오류', error);
      alert('시간대 변경 적용에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // 🔹 버튼 클래스 결정
  const getButtonClass = (slot) => {
    let className = 'slot-button';
    if (slot.isReserved) className += ' reserved';
    else if (slot.status === 'deny' || slot.status === 'pending-deny') className += ' deny';
    else className += ' allow';
    return className;
  };

  return (
    <div className="time-slot-container">
      <div className="time-slot-top-area">
        <div className="time-status-info">
          <h3 className="time-status-title">시간 관리</h3>
          <p className="time-status-sub">예약 불가능한 시간을 선택하세요.</p>
        </div>
        <select
          id="departmentSelect"
          value={selectedDepartmentId ?? ''}
          onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
          className="time-chip-style"
        >
          <option value="">과를 선택하세요</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>

      {/* 오전 */}
      <div className="time-group">
        <h4>오전</h4>
        <div className="slots-grid">
          {AMSlots.map(time => {
            const slot = slots.find(s => s.time === time) || { time, status: 'allow', isReserved: false };
            return (
              <button
                key={`am-${time}`}
                className={getButtonClass(slot)}
                onClick={() => toggleSlot(time)}
                title={slot.isReserved ? '이미 예약된 시간입니다' : ''}
                disabled={slot.isReserved}
              >
                {time}{slot.isReserved ? ' (예약됨)' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* 오후 */}
      <div className="time-group">
        <h4>오후</h4>
        <div className="slots-grid">
          {PMSlots.map(time => {
            const slot = slots.find(s => s.time === time) || { time, status: 'allow', isReserved: false };
            return (
              <button
                key={`pm-${time}`}
                className={getButtonClass(slot)}
                onClick={() => toggleSlot(time)}
                title={slot.isReserved ? '이미 예약된 시간입니다' : ''}
                disabled={slot.isReserved}
              >
                {time}{slot.isReserved ? ' (예약됨)' : ''}
              </button>
            );
          })}
        </div>
      </div>

      <div className='time-slot-bottom-area'>
        <div className="time-legend">
          <span><span className="box allow"></span> 예약 허용</span>
          <span><span className="box deny"></span> 예약 거부</span>
        </div>
        <div className="button-box">
          <button className="apply-button" onClick={handleApply}>적용</button>
        </div>
      </div>
    </div>
  );
}

export default TimeSlots;
