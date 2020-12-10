const express = require('express');
const router = express.Router();

const Event = require('../models/event');

router.get('/events', async (req, res) => {
    let list = [];

    try {
        if(req.query.lng !== null && req.query.lat !== null){
            list = await Event.geoSearch(
                {type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]},
                {maxDistance: 100000, spherical: true}
            );
        } else if(req.query.orgkey !== null){
            list = await Event.findOne({organizerId: req.query.orgkey});
        } else if(req.query.keyword !== null) {
            list = await Event.find()
        } else {
            list = await Event.find({});
        }
    
        res.json({
            success: true,
            message: 'Operation successfully',
            data: list
        })
    } catch (error) {
        
    }
});

router.get('/events/:id', (req, res) => {});

router.post('/events', (req, res) => {});

router.delete('/events/:id', (req, res) => {});

module.exports = router;