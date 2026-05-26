import { useState } from 'react';
import './CreateTicketForm.css';

const CreateTicketForm = ({ onSubmit, isSubmitting }) => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    importance: '3',
    dueDate: today,
    status: 'pending',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      importance: Number(formData.importance),
    });
    setFormData({
      title: '',
      description: '',
      importance: '3',
      dueDate: today,
      status: 'pending',
    });
  };

  return (
    <form className="create-ticket-form" onSubmit={handleSubmit}>
      <h3>Create New Task</h3>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
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

      <div className="form-group">
        <label htmlFor="importance">Importance</label>
        <select
          id="importance"
          name="importance"
          value={formData.importance}
          onChange={handleChange}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          min={today}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
};

export default CreateTicketForm;
