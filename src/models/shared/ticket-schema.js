const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TicketSchema = new schema({
    user: {
        type: String,
        required: true
    },

    amountPaid: {
        type: Number
    },

    paidAt: {
        type: String,
        default: new Date().toISOString()
    },

    eventId: {
        type: String,
        required: true
    }
});

const Ticket = mongoose.model('ticket', TicketSchema);
module.exports = Ticket;