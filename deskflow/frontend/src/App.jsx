import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import Board from './components/Board';
import CreateTicketForm from './components/CreateTicketForm';
import Filters from './components/Filters';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [filters, setFilters] = useState({
    status: '',
    minImportance: ''
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await getTasks(filters);
      setTasks(tasksData);
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
      await createTask(ticketData);
      await fetchData();
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
      await updateTask(id, { status: newStatus });
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update ticket status.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setError(null);
      await deleteTask(id);
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete task.');
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
            />
          </div>
        </section>

        {loading ? (
          <div className="loading-spinner">Loading tasks...</div>
        ) : (
            <Board 
              tickets={tasks} 
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
            />
          )}
      </main>
    </div>
  );
}

export default App;
