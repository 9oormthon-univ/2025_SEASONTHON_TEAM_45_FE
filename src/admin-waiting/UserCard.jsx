import './UserCard.css';

function UserCard({ user, onCall, onCardClick }) {
  const showCallButton = user.status === '대기 중';
  
  return (
    <div className="user-card" >
      <div className="user-box">
        <div className="user-area"onClick={() => onCardClick(user)}>
          <div className="user-info">
            <p>{user.name}</p>
            <p> {user.age}세</p>
            <p> ({user.gender})</p>
          </div>
          <div className="user-appointment">
            <p>{user.appointmentTime}</p>
            <p>{user.department}</p>
          </div>
      </div>
      {showCallButton && (
      <button
        onClick={() => onCall(user.id)}
        className="call-button"
      >
        호출
      </button>
    )}
      </div>
    </div>
  );
}

export default UserCard;
