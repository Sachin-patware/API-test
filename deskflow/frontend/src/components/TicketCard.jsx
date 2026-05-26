import './TicketCard.css';

const TicketCard = ({ ticket, onStatusChange, onDelete }) => {
  const { _id, title, description, importance, dueDate, priorityScore, status } = ticket;

  const isPending = status === 'pending';
  const nextStatus = isPending ? 'completed' : 'pending';

  const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
  };

  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <h4>{title}</h4>
        <span className={`priority-badge priority-${importance}`}>
          Importance {importance}
        </span>
      </div>

      <div className="ticket-details">
        <div>{description}</div>
        <div>Due: {formatDate(dueDate)}</div>
        <div>Score: {priorityScore}</div>
      </div>

      <div className="ticket-actions">
        <button onClick={() => onStatusChange(_id, nextStatus)}>
          Mark as {isPending ? 'Completed' : 'Pending'}
        </button>
        <button className="btn-danger" onClick={() => onDelete(_id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
