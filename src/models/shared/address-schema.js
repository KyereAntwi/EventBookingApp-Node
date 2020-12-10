const mongoose = require('mongoose');
const schema = mongoose.Schema;

const AddressSchema = new schema({
    locality: {
        type: String,
        required: [true, 'Locality must not be empty']
    },

    region: {
        type: String,
        required: [true, 'Region must not be empty']
    },

    country: {
        type: String,
        default: 'Ghana'
    },

    digitalAddress: {
        type: String,
        required: false
    }
});

module.exports = AddressSchema;