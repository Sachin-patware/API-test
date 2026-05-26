import TicketCard from './TicketCard';
import './Board.css';

const COLUMNS = [
  { id: 'open', title: 'Open' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'resolved', title: 'Resolved' },
  { id: 'closed', title: 'Closed' }
];

const Board = ({ tickets, onStatusChange }) => {
  const getTicketsByStatus = (status) => {
    return tickets.filter(t => t.status === status);
  };

  return (
    <div className="board">
      {COLUMNS.map(column => (
        <div key={column.id} className="board-column">
          <div className="column-header">
            <h3>{column.title}</h3>
            <span className="count">{getTicketsByStatus(column.id).length}</span>
          </div>
          <div className="column-content">
            {getTicketsByStatus(column.id).map(ticket => (
              <TicketCard 
                key={ticket._id} 
                ticket={ticket} 
                onStatusChange={onStatusChange}
              />
            ))}
            {getTicketsByStatus(column.id).length === 0 && (
              <div className="empty-state">No tickets</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Board;
