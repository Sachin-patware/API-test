import { useState, useEffect, useCallback } from 'react';
import { getTickets, createTicket, updateTicketStatus, getTicketStats } from './api';
import Board from './components/Board';
import CreateTicketForm from './components/CreateTicketForm';
import Filters from './components/Filters';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [filters, setFilters] = useState({
    priority: '',
    breached: false
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ticketsData, statsData] = await Promise.all([
        getTickets(filters),
        getTicketStats()
      ]);
      setTickets(ticketsData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTicket = async (ticketData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createTicket(ticketData);
      await fetchData(); // Refresh board and stats
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setError(null);
      // Optimistic update could go here, but refetching is safer for stats consistency
      await updateTicketStatus(id, newStatus);
      await fetchData(); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update ticket status.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>DeskFlow Support Triage</h1>
      </header>

      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}

        <section className="top-section">
          <div className="form-container">
            <CreateTicketForm 
              onSubmit={handleCreateTicket} 
              isSubmitting={isSubmitting} 
            />
          </div>
          <div className="filters-container-wrapper">
            <Filters 
              filters={filters} 
              onFilterChange={setFilters} 
              stats={stats} 
            />
          </div>
        </section>

        {loading ? (
          <div className="loading-spinner">Loading tickets...</div>
        ) : (
          <Board 
            tickets={tickets} 
            onStatusChange={handleStatusChange} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
