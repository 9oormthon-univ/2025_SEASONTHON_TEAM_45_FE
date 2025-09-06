import './UserCardRow.css';

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

function UserRowCard({ user,onCardClick }) {
  const formattedTime = (() => {
    const timeParts = user.appointmentTime.split(':');
    return `${timeParts[0]}시 ${timeParts[1]}분`;
  })();
  const formattedDate = user.appointmentDate; // "2024-12-31"
  const age = calculateAge(user.memberBirthDate);
  const genderShort =
    user.gender === '남성' ? '(남)' :
    user.gender === '여성' ? '(여)' :
    '';

  return (
    <div className="date-user-card">
      <div className="date-user-box">
        <div className="date-user-area" onClick={() => onCardClick(user)}>
          <div className="date-user-info">
            <p>{user.memberName}</p>
            <p>만 {age}세</p>
            <p>{genderShort}</p>
          </div>
          <div className="date-user-appointment">
            <p>{formattedTime}</p>
            <p>{user.department}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRowCard;
