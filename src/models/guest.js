const mongoose = require('mongoose');
const schema = mongoose.Schema;

const GuestSchema = new schema({
    fullname: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String
    },

    personalitySummary: {
        type: String
    },

    role: {
        type: String
    },

    eventId: {
        type: String,
        required: true
    }
});

const Guest = mongoose.model('guest', GuestSchema);
module.exports = Guest;