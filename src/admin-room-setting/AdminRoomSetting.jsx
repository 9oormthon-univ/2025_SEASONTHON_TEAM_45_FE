// AdminRoomSetting.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminRoomSetting.css';
import AdminHeader from '../component/AdminHeader.jsx';

function AdminRoomSetting() {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState({ adminName: '김관리', hospitalName: '구름대병원' });
  const [departments, setDepartments] = useState([]);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [editDeptDesc, setEditDeptDesc] = useState('');

  const hospitalId = 1;
  const BASE_URL = import.meta.env.VITE_REACT_APP_ADMIN_URL;
  const API_BASE = '${BASE_URL}/admin/hospitals';

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return alert('로그인 후 시도해주세요.');

        const response = await axios.get(`${API_BASE}/${hospitalId}/departments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if ((response.data.code === 'SUCCESS' || response.data.code === 'HOSPITAL_3002') 
            && Array.isArray(response.data.data)) {
          setDepartments(response.data.data);
        } else {
          throw new Error('Invalid response');
        }
      } catch (err) {
        console.error('진료과 불러오기 실패:', err);
        setDepartments([
          { departmentId: 1, name: '내과', description: '일반적인 내과 진료를 담당합니다.' },
          { departmentId: 2, name: '정형외과', description: '일반적인 정형외과 진료를 담당합니다.' },
        ]);
      }
    };
    fetchDepartments();
  }, []);

  const handleBackClick = () => navigate(-1);

  const handleDelete = async (departmentId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/${hospitalId}/departments/${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(prev => prev.filter(d => d.departmentId !== departmentId));
      alert('삭제 완료');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleAdd = async () => {
    if (!newDeptName || !newDeptDesc) return alert('이름과 설명을 입력해주세요.');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE}/${hospitalId}/departments`,
        { name: newDeptName, description: newDeptDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.code === 'SUCCESS') {
        setDepartments(prev => [...prev, response.data.data]);
        setNewDeptName('');
        setNewDeptDesc('');
        setIsAddModalOpen(false);
        alert('추가 완료');
      }
    } catch (error) {
      console.error('추가 실패:', error);
      alert('추가에 실패했습니다.');
    }
  };

  const handleEdit = async () => {
    if (!editDeptDesc) return alert('설명을 입력해주세요.');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE}/${hospitalId}/departments/${selectedDept.departmentId}`,
        { name: selectedDept.name, description: editDeptDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.code === 'SUCCESS') {
        setDepartments(prev =>
          prev.map(d =>
            d.departmentId === selectedDept.departmentId
              ? { ...d, description: editDeptDesc }
              : d
          )
        );
        setIsDetailModalOpen(false);
        alert('수정 완료');
      } else {
        alert('수정 실패: ' + response.data.message);
      }
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정에 실패했습니다.');
    }
  };

  const openDetailModal = (dept) => {
    setSelectedDept(dept);
    setEditDeptDesc(dept.description);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="admin-room-setting-container">
      <AdminHeader adminName={adminInfo.adminName} hospitalName={adminInfo.hospitalName} />

      <div className="room-container">
        <nav className="breadcrumb">
          <button onClick={handleBackClick} className="back-page">← 뒤로 가기</button>
        </nav>

        <section className="admin-page-info">
          <h1 className="date-title">진료실 관리</h1>
        </section>

        <div className="admin-setting-department">
          <div className='admin-department-top'>
            <h1 className="section-title2">진료과 관리</h1>

            <div className="admin-department-info">
              {departments.map(dept => (
                <div key={dept.departmentId} className="department-item">
                  <span className="department-name">{dept.name}</span>
                  <button
                    className="department-open-modal-btn"
                    onClick={() => openDetailModal(dept)}
                  >
                    수정/삭제
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            className="room-add-button"
            onClick={() => setIsAddModalOpen(true)}
          >
            + 진료과 추가하기
          </button>
        </div>

        {(isAddModalOpen || isDetailModalOpen) && (
          <div
            className="room-modal-overlay"
            onClick={() => { setIsAddModalOpen(false); setIsDetailModalOpen(false); }}
          >
            <div className="room-modal" onClick={e => e.stopPropagation()}>

              {/* 모달 헤더 */}
              <div className="modal-header">
                <h2>{isAddModalOpen ? '진료과 추가' : `${selectedDept.name} 상세 정보`}</h2>
                <button
                  className="modal-close-button"
                  onClick={() => { setIsAddModalOpen(false); setIsDetailModalOpen(false); }}
                ></button>
              </div>

              <div className="modal-body">
                {isAddModalOpen ? (
                  <>
                    <input
                      type="text"
                      placeholder="과 이름"
                      value={newDeptName}
                      onChange={e => setNewDeptName(e.target.value)}
                    />
                    <textarea
                      placeholder="설명"
                      value={newDeptDesc}
                      onChange={e => setNewDeptDesc(e.target.value)}
                    />
                  </>
                ) : (
                  <textarea
                    placeholder="설명"
                    value={editDeptDesc}
                    onChange={e => setEditDeptDesc(e.target.value)}
                  />
                )}
              </div>

              <div className="room-modal-footer">
                {isAddModalOpen ? (
                  <button className="modal-add-btn" onClick={handleAdd}>추가</button>
                ) : (
                  <>
                    <button className="modal-edit-btn" onClick={handleEdit}>수정</button>
                    <button
                      className="modal-delete-btn"
                      onClick={() => { handleDelete(selectedDept.departmentId); setIsDetailModalOpen(false); }}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRoomSetting;
