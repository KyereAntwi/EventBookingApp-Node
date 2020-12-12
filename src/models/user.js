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
        type: String,
        default: new Date().toISOString()
    },

    imageUrl: {
        type: String
    },

    bannerUrl: {
        type: String
    },

    dateOfBirth: {
        type: String,
        default: new Date().toISOString()
    },

    primaryContact: {
        type: String,
        maxlength: 15,
        minlength: 15
    },

    nationality: {
        type: String,
        default: 'Ghanaian'
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;