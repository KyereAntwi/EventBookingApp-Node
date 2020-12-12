const mongoose = require('mongoose');
const AddressSchema = require('./shared/address-schema');
const GeoSchema = require('./shared/geo-schema');
const WikiSchema = require('./shared/event-wikis-schema');
const TicketSchema = require('./shared/ticket-schema');
const schema = mongoose.Schema;

const EventSchema = new schema({
    theme: {
        type: String,
        required: [true, 'Theme is required'],
        maxlength: [100, 'Theme must be at most 100 characters'],
        minlength: [2, 'Theme must be atleast 2 characters']
    },

    description: {
        type: String,
        required: false,
    },

    done: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: new Date().toISOString()
    },

    locality: {
        type: String,
        required: [true, 'Locality is required eg: Accra or Achimota']
    },

    private: {
        type: Boolean,
        default: false
    },

    startingDate: {
        type: Date,
        required: true
    },

    endingDate: {
        type: Date,
        required: true
    },

    startingTime: {
        type: String
    },

    organizerId: {
        type: String,
        required: [true, 'Event organizer Id must not be empty']
    }, // created by event organizing company
    
    bannerUrl: {
        type: String
    },

    requirements: {
        type: [String]
    },

    tickets: [TicketSchema],

    geometry: GeoSchema, // add geolocation  
    wikis: [WikiSchema], 
    address: AddressSchema
});

const Event = mongoose.model('event', EventSchema);
module.exports = Event;