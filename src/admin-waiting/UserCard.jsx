import './UserCard.css';

function calculateAge(birthDateStr) {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function UserCard({ user, onCall, onCardClick }) {
  const showCallButton = user.status === '대기중'; 
  const formattedTime = (() => {
    const timeParts = user.appointmentTime.split(':');
    return `${timeParts[0]}시 ${timeParts[1]}분`;
  })();
  const formattedDate = user.appointmentDate;
  const age = calculateAge(user.memberBirthDate);
  const genderShort =
    user.memberGender === '남성' ? '(남)' :
    user.memberGender === '여성' ? '(여)' :
    '';

  return (
    <div className="board-user-card">
      <div className="board-user-box">
        <div className="board-user-area" onClick={() => onCardClick(user)}>
          <div className="board-user-info">
            <p>{user.memberName}</p>
            <p>만 {age}세</p>
            <p>{genderShort}</p>
          </div>
          <div className="board-user-appointment">
            <p>{formattedTime}</p>
            <p>{user.department}</p>
          </div>
        </div>
      </div>
      {showCallButton && (
        <button
          onClick={() => onCall(user.appointmentId)}
          className='board-call-button'
        >
          호출
        </button>
      )}
    </div>
  );
}

export default UserCard;
