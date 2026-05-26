import './TicketCard.css';

const TicketCard = ({ ticket, onStatusChange }) => {
  const { _id, subject, priority, ageMinutes, slaBreached, status } = ticket;

  const renderButtons = () => {
    switch (status) {
      case 'open':
        return (
          <button onClick={() => onStatusChange(_id, 'in_progress')}>
            Start Progress
          </button>
        );
      case 'in_progress':
        return (
          <>
            <button className="btn-secondary" onClick={() => onStatusChange(_id, 'open')}>
              Back to Open
            </button>
            <button className="btn-success" onClick={() => onStatusChange(_id, 'resolved')}>
              Resolve
            </button>
          </>
        );
      case 'resolved':
        return (
          <>
            <button className="btn-secondary" onClick={() => onStatusChange(_id, 'in_progress')}>
              Reopen
            </button>
            <button className="btn-danger" onClick={() => onStatusChange(_id, 'closed')}>
              Close
            </button>
          </>
        );
      case 'closed':
        return (
          <button className="btn-secondary" onClick={() => onStatusChange(_id, 'resolved')}>
            Reopen (Resolved)
          </button>
        );
      default:
        return null;
    }
  };

  const formatAge = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={`ticket-card ${slaBreached ? 'breached' : ''}`}>
      <div className="ticket-header">
        <h4>{subject}</h4>
        <span className={`priority-badge priority-${priority}`}>
          {priority}
        </span>
      </div>
      
      <div className="ticket-details">
        <span className="age">Age: {formatAge(ageMinutes)}</span>
        {slaBreached && <span className="breach-indicator">⚠️ SLA Breached</span>}
      </div>

      <div className="ticket-actions">
        {renderButtons()}
      </div>
    </div>
  );
};

export default TicketCard;
