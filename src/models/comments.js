const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CommentSchema = new schema({
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
    },

    wikiId: {
        type: String,
        required: true
    }
});

const WikiComment = mongoose.model('wikiComment', CommentSchema);
module.exports = WikiComment;