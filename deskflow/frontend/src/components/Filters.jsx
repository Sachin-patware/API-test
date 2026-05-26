import './Filters.css';

const Filters = ({ filters, onFilterChange, stats }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label htmlFor="priority-filter">Filter by Priority:</label>
        <select 
          id="priority-filter" 
          name="priority" 
          value={filters.priority} 
          onChange={handleChange}
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="filter-group checkbox-group">
        <input 
          type="checkbox" 
          id="breached-filter" 
          name="breached" 
          checked={filters.breached} 
          onChange={handleChange}
        />
        <label htmlFor="breached-filter" className="danger-text">
          Show Only SLA Breached
        </label>
      </div>

      {stats && (
        <div className="stats-summary">
          <span className="stat-badge warning">
            {stats.breachedUnresolvedCount} Breached Unresolved
          </span>
        </div>
      )}
    </div>
  );
};

export default Filters;
