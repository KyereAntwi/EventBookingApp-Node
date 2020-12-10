const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    name: {
        type: String,
        required: [true, 'Username is required'],
        minlength: 6,
        maxlength: 50
    },

    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },

    createdAt: {
        type: Date,
        default: new Date().toISOString()
    },

    imageUrl: {
        type: String
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;