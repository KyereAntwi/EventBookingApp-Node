const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TicketSchema = new schema({
    user: {
        type: String
    },

    amountPaid: {
        type: Number
    },

    paidAt: {
        type: String,
        default: new Date().toISOString()
    }
});

module.exports = TicketSchema;