const mongoose = require('mongoose');
const schema = mongoose.Schema;

const EventWiki = new schema({
    user: {
        type: String,
        required: true
    },

    createdAt: {
        type: String,
        default: new Date().toISOString()
    },

    message: {
        type: String,
        required: true
    }
});

module.exports = EventWiki;