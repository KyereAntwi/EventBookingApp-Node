const mongoose = require('mongoose');
const schema = mongoose.Schema;

const AddressSchema = require('./shared/address-schema');

const OrganizerSchema = new schema({
    name: {
        type: String,
        required: [true, 'Name of organization must not be empty'],
        maxlength: [100, 'Name must be atmost 100 characters']
    },

    address: AddressSchema,

    website: {
        type: String,
        required: false
    },

    createdAt: {
        type: Date,
        default: new Date().toISOString()
    },

    admin: {
        type: String,
        required: true,
    },

    employees: {
        type: [String]
    }, // list of users who work with the organizing company

    logoUrl: {
        type: String
    },

    bannerUrl: {
        type: String
    }
});

const Organizer = mongoose.model('organization', OrganizerSchema);
module.exports = Organizer;