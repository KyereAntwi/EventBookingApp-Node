const express = require('express');
const verify = require('../models/shared/verify-token');

const Organizer = require('../models/organizer');
const router = express.Router();

router.get('/organizations', async (req, res) => {
    try {
        let list = [];

        if(req.query.keyword !== undefined){
            list = await Organizer.find({name: {$in: req.query.keyword}})
        } else {
            list = await Organizer.find({})
        }

        res.json({
            success: true,
            message: 'Fetch organization successful',
            data: list
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null
        })
    }
});

router.get('/organizations/:id', async (req, res) => {
    const id = req.params.id;

    if(id === null){
        res.status(422).send('Bad request');
    }

    try {
        const organizaiton = await Organizer.findById({_id: id});

        if(organizaiton === null){
            res.status(404).json({
                success: false,
                message: 'There is no organization with specified id',
                data: null
            })
        }

        res.json({
            success: true,
            message: 'Organization search was successfull',
            data: organizaiton
        })
    } catch (error) {
        
    }
});

router.post('/organizations', verify, async (req, res) => {
    const body = req.body;

    if(body === null){
        res.status(400).send('Bad request');
    }

    body.admin = req.user._id;
    const newOrganization = new Organizer(body);
    
    try {
        const response = await newOrganization.save();
        res.status(201).json({
            success: true,
            message: 'Organization created successfully',
            data: response
        })
    } catch (error) {
        console.log(error.message);
        res.status(422).json({
            success: false,
            message: error.message,
            data : null
        })
    }
});

router.put('/organizations/:id', verify, async (req, res) => {
    const id = req.params.id;
    const user = req.user._id;

    if(id === null || req.body === null){
        res.status(422).json({
            success: false,
            message: 'Id or body was not provided',
            data : null
        });
    }

    try {
        const organizaiton = await Organizer.findById({_id: id});

        if(organizaiton === null){
            res.status(404).json({
                success: false,
                message: 'Organization was not found',
                data : null
            });
        }

        if(organizaiton.admin !== user){
            res.status(400).json({
                success: false,
                message: 'Sorry you do have permission to perform operation',
                data : null
            })
        }

        await Organizer.findByIdAndUpdate({_id: id}, req.body);
        var response = await Organizer.findOne({_id: id});
        res.status(201).json({
            success: true,
            message: 'Update was successfull',
            data : response
        })
    } catch (error) {
        console.log(error.message);
        res.status(422).json({
            success: false,
            message: error.message,
            data : null
        })
    }
});

router.delete('/organizations/:id', verify, async (req, res) => {
    const id = req.params.id;
    const user = req.user._id;

    if(id === null){
        res.status(422).json({
            success: false,
            message: 'Did not provide organizaiton id',
            data: null
        });
    }

    try {
        const organization = await Organizer.findById({_id: id});

        if(organization === null){
            res.status(404).json({
                success: false,
                message: 'There is no organization with specified id',
                data: null
            })
        }

        if(organizaiton.admin !== user){
            res.status(400).json({
                success: false,
                message: 'Sorry you do have permission to perform operation',
                data : null
            })
        }

        const response = await Organizer.findByIdAndRemove({_id: id});

        res.json({
            success: true,
            message: 'Organization removed successfully',
            data: response
        })
    } catch (error) {
        console.log(error.message);
        res.status(422).json({
            success: false,
            message: error.message,
            data : null
        })
    }
});

module.exports = router;