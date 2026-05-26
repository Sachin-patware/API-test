import { useState } from 'react';
import './CreateTicketForm.css';

const CreateTicketForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    customerEmail: '',
    priority: 'low'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ subject: '', description: '', customerEmail: '', priority: 'low' });
  };

  return (
    <form className="create-ticket-form" onSubmit={handleSubmit}>
      <h3>Create New Ticket</h3>
      
      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <input 
          type="text" 
          id="subject" 
          name="subject" 
          value={formData.subject} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="customerEmail">Customer Email</label>
        <input 
          type="email" 
          id="customerEmail" 
          name="customerEmail" 
          value={formData.customerEmail} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select 
          id="priority" 
          name="priority" 
          value={formData.priority} 
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          required 
          rows="3"
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Ticket'}
      </button>
    </form>
  );
};

export default CreateTicketForm;
