const Ticket = require('../models/Ticket');
const { sendEmail, emailTemplates } = require('../config/email');

const TICKET_PREFIX = 'DDPRO';
const TICKET_SEQUENCE_START = 301;

async function generateTicketNumber() {
  const year = new Date().getFullYear();
  const startOfYear = new Date(year, 0, 1);

  for (let attempt = 0; attempt < 5; attempt++) {
    const count = await Ticket.countDocuments({ createdAt: { $gte: startOfYear } });
    const sequence = TICKET_SEQUENCE_START + count + attempt;
    const candidate = `${TICKET_PREFIX}${year}${String(sequence).padStart(4, '0')}`;
    const exists = await Ticket.exists({ ticketNumber: candidate });
    if (!exists) return candidate;
  }

  return `${TICKET_PREFIX}${year}${Date.now()}`;
}

// @desc    Create ticket (complaint)
// @route   POST /api/tickets
// @access  Public
exports.createTicket = async (req, res) => {
  try {
    if (req.files && req.files.length > 0) {
      req.body.attachments = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        filename: file.originalname
      }));
    }

    const ticketNumber = await generateTicketNumber();

    const ticket = await Ticket.create({
      ...req.body,
      ticketNumber,
      source: req.body.source === 'direct' ? 'direct' : 'public'
    });

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `Nueva queja registrada - ${ticket.ticketNumber}`,
      html: emailTemplates.ticketNotification(ticket)
    });

    res.status(201).json({
      success: true,
      data: {
        ticketNumber: ticket.ticketNumber,
        status: ticket.status
      },
      message: 'Su queja fue registrada. Guarde su número de ticket para dar seguimiento.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Look up ticket status
// @route   GET /api/tickets/lookup
// @access  Public
exports.lookupTicketStatus = async (req, res) => {
  try {
    const { ticketNumber } = req.query;

    if (!ticketNumber) {
      return res.status(400).json({ success: false, error: 'Ticket number is required' });
    }

    const ticket = await Ticket.findOne({
      ticketNumber: ticketNumber.trim().toUpperCase()
    });

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'No ticket found matching that number' });
    }

    res.json({
      success: true,
      data: {
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all tickets (Admin/Worker)
// @route   GET /api/tickets/admin/all
// @access  Private
exports.getAllTickets = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket no encontrado' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update ticket (status / notes)
// @route   PUT /api/tickets/:id
// @access  Private
exports.updateTicket = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = {};
    if (status !== undefined) update.status = status;
    if (notes !== undefined) update.notes = notes;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket no encontrado' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Admin)
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket no encontrado' });
    }

    await ticket.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Send a pre-filled direct complaint link to a client
// @route   POST /api/tickets/send-direct-link
// @access  Private
exports.sendDirectLink = async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, clientAddress } = req.body;

    if (!clientName || !clientName.trim()) {
      return res.status(400).json({ success: false, error: 'Client name is required' });
    }

    const params = new URLSearchParams();
    params.set('name', clientName.trim());
    if (clientEmail) params.set('email', clientEmail.trim());
    if (clientPhone) params.set('phone', clientPhone.trim());
    if (clientAddress) params.set('address', clientAddress.trim());

    const complaintUrl = `${process.env.FRONTEND_URL}/complaint?${params.toString()}`;

    let emailSent = false;
    if (clientEmail && clientEmail.trim()) {
      await sendEmail({
        to: clientEmail.trim(),
        subject: 'File a Complaint — D&D Landscaping Pro',
        html: emailTemplates.complaintInvitation({ clientName: clientName.trim(), complaintUrl })
      });
      emailSent = true;
    }

    res.status(201).json({
      success: true,
      data: { complaintUrl, emailSent }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
