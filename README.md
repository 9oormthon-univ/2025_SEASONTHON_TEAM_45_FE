# Care Free Pass FE

---

## 1. admin-login

1. LoginPage
    - 설명: 로그인 페이지
    - 역할: 관리자 정보로 로그인

---

## 2. admin-waiting

1. AdminDashBoard
    - 설명: 메인 대기 화면
    - 역할: 전체 대기 목록과 페이지 레이아웃 관리 및 과 필터링 기능
2. StatusColumn
    - 설명: 환자 상태 대기열
    - 역할: 환자 상태별 대기 목록 컬럼 표시
3. UserCard
    - 설명: 환자 정보 카드
    - 역할: 개별 환자 요약 카드

---

## 3. admin-seting

1. AdminPage
    - 설명: 관리자 설정 페이지
    - 역할: 관리자 시간, 날짜 관리 / 진료실 관리 페이지 선택 가능

---

## 4. admin-date-setting

1. AdminSetting
    - 설명: 관리자용 날짜, 시간 관리 화면
    - 역할: 전체 목록과 페이지 레이아웃 관리 및 날짜 선택 기능
2. TimeSlots
    - 설명: 예약 시간대 차단
    - 역할: 관리자용 과별 예약 시간대 차단 기능 (예약 중인 환자가 있는 경우 차단 불가능)
3. UserAdminList
    - 설명: 날짜별 환자 정보 열람
    - 역할: AdminSetting에서 선택한 날짜의 예약한 환자 확인
4. UserCardRow
    - 설명: 환자 정보 카드
    - 개별 환자 정보 요약 카드 가로 정렬 버전

---

## 5. admin-room-setting

1. AdminRoomSetting
    - 설명: 관리자용 진료실 관리 화면
    - 역할: 기존 진료실 정보 수정 및 삭제, 신규 진료실 추가 기능

---

## 6. component

1. AdminHeader 
    - 설명: 관리자 헤더
    - 역할: 상단 헤더, 병원 로고, 관리자 정보 등 담당
2. UserModal
    - 설명: 환자 정보 모달
    - 역할: 환자 상세 정보 (이름, 나이, 성별, 전화번호, 상태, 진료과, 방문 예정 시간) 모달
3. UserMenu
    - 설명: 관리자 계정 드롭 다운
    - 역할: 로그아웃 / 관리자 페이지 이동 기능