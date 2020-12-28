const express = require('express');
const verify = require('../models/shared/verify-token');

const router = express.Router();

const Ticket = require('../models/shared/ticket-schema');
const Event = require('../models/event');

router.get('/tickets/all-event-tickets/:eventId', verify, async (req, res) => {
    if (!req.params.eventId) res.status(400).send('Event Id was not provided');

    try {
        let list = [];

        list = await Ticket.find({ eventId: req.params.eventId });
        res.json({
            success: true,
            message: 'Request successful',
            data: list
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send('There was a problem loading tickets');
    }
});

router.get('/tickets', verify, async (req, res) => {
    let list = [];

    try {
        if (req.query.created)
            list = await Ticket.find({ createdAt: req.query.createdAt });
        else if (req.query.user)
            list = await Ticket.find({ user: req.query.user });
        else
            list = await Ticket.find({});

        res.json({
            success: true,
            message: 'Operation successful',
            data: list
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Problem loading data');
    }
});

router.post('/tickets', verify, async (req, res) => {
    if (!req.body) res.status(400).send('Bad request');

    let body = req.body;
    body.user = req.user._id;
    body.paidAt = new Date().toISOString();

    try {
        const event = await Event.findById({ _id: body.eventId });

        if (!event) res.status(404).send('The event specified does not exist');

        // if event is private then perform external ticket payment here

        body.amountPaid = event.ticketAmount;
        const newTicket = new Ticket(body);
        const response = await newTicket.save();
        res.status(201).json({
            success: true,
            message: 'Ticket purchased successfully',
            data: response
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Something went wrong');
    }
})

module.exports = router;
