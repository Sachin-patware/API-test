import Ticket from '../models/Ticket.js';
import { calculateAgeMinutes, checkSLABreach, isValidTransition } from '../utils/helpers.js';

// Helper to format ticket response with derived fields
const formatTicketResponse = (ticket) => {
  const ageMinutes = calculateAgeMinutes(ticket.createdAt, ticket.resolvedAt, ticket.status);
  const slaBreached = checkSLABreach(ticket.priority, ageMinutes, ticket.status);
  
  return {
    ...ticket.toObject(),
    ageMinutes,
    slaBreached
  };
};

export const createTicket = async (req, res) => {
  try {
    const { subject, description, customerEmail, priority } = req.body;
    
    const newTicket = new Ticket({
      subject,
      description,
      customerEmail,
      priority
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(formatTicketResponse(savedTicket));
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error creating ticket' });
  }
};

export const getTickets = async (req, res) => {
  try {
    const { status, priority, breached } = req.query;
    
    // Build initial query based on db fields
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    
    // Add derived fields
    let formattedTickets = tickets.map(formatTicketResponse);

    // Apply breached filter in memory since it depends on derived fields
    if (breached === 'true') {
      formattedTickets = formattedTickets.filter(t => t.slaBreached);
    }

    res.json(formattedTickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets' });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Only handle status updates for now based on requirements
    if (status && status !== ticket.status) {
      if (!isValidTransition(ticket.status, status)) {
        return res.status(400).json({ message: 'Invalid status transition' });
      }

      // Handle resolvedAt logic
      if (status === 'resolved' && ticket.status !== 'resolved') {
        ticket.resolvedAt = Date.now();
      } else if (ticket.status === 'resolved' && status !== 'resolved') {
        // Clear resolvedAt when moving back from resolved
        ticket.resolvedAt = null;
      }
      
      ticket.status = status;
    }

    const updatedTicket = await ticket.save();
    res.json(formatTicketResponse(updatedTicket));
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error updating ticket' });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    
    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ticket' });
  }
};

export const getTicketStats = async (req, res) => {
  try {
    const allTickets = await Ticket.find({});
    
    const stats = {
      statusCounts: {
        open: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0
      },
      priorityCounts: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      },
      breachedUnresolvedCount: 0
    };

    allTickets.forEach(t => {
      // Aggregate status
      if (stats.statusCounts[t.status] !== undefined) {
        stats.statusCounts[t.status]++;
      }
      
      // Aggregate priority
      if (stats.priorityCounts[t.priority] !== undefined) {
        stats.priorityCounts[t.priority]++;
      }

      // Aggregate breached unresolved
      const ageMinutes = calculateAgeMinutes(t.createdAt, t.resolvedAt, t.status);
      const isBreached = checkSLABreach(t.priority, ageMinutes, t.status);
      
      if (isBreached && (t.status === 'open' || t.status === 'in_progress')) {
        stats.breachedUnresolvedCount++;
      }
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};
