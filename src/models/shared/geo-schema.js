const mongoose = require('mongoose');
const schema = mongoose.Schema;

const GeoSchema = new schema({
    type: {
        type: String,
        default: 'Point'
    },

    coordinates: {
        type: [Number],
        index: '2dsphere'
    }
});

module.exports = GeoSchema;