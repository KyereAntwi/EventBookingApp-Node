const express = require('express');
const router = express.Router();

const User = require('../models/user');
const validate = require('../models/shared/verify-token');

router.get('/users', validate, async (req, res) => {
    try {
        const list = await User.find({});
        const response = [];

        if(list.length > 0) {
            list.map(user => {
                response.push({
                    name: user.name,
                    dob: user.dateOfBirth,
                    email: user.email,
                    createdAt: user.createdAt,
                    bannerUrl: user.bannerUrl,
                    primaryContact: user.primaryContact,
                    nationality: user.nationality
                })
            })
        }

        res.json({
            success: true,
            message: 'Operation successful',
            data: response
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/users/:id', validate, async (req, res) => {
    if(!req.params.id) {
        res.status(400).send('User id was not provided');
    }

    try {
        const user = await User.findById({_id: req.params.id});

        if(!user) res.status(404).send('User was not found');

        res.json({
            success: true,
            message: 'Operation successful',
            data: {
                name: user.name,
                dob: user.dateOfBirth,
                email: user.email,
                createdAt: user.createdAt,
                bannerUrl: user.bannerUrl,
                primaryContact: user.primaryContact,
                nationality: user.nationality
            }
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/users/updateimage/:id', validate, (req, res) => {});
router.put('/users/updatebanner/:id', validate, (req, res) => {});

router.put('/users/:id', validate, async (req, res) => {
    if(!req.params.id) {
        res.status(400).send('User id was not provided');
    }

    try {
        let user = await User.findById({_id: req.params.id});

        if(!user) res.status(404).send('User was not found');

        req.body.password = user.password;
        user = await User.findOneAndUpdate({_id: req.params.id}, req.body);
        res.status(201).json({
            success: true,
            message: 'Operation successful',
            data: {
                name: user.name,
                dob: user.dateOfBirth,
                email: user.email,
                createdAt: user.createdAt,
                bannerUrl: user.bannerUrl,
                primaryContact: user.primaryContact,
                nationality: user.nationality
            }
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/users/:id', validate, async (req, res) => {
    if(!req.params.id) {
        res.status(400).send('User id was not provided');
    }

    try {
        const user = await User.findById({_id: req.params.id});

        if(!user) res.status(404).send('User was not found');
        await User.findByIdAndRemove({_id: req.params.id});
        res.json({
            success: true,
            message: 'Operation successful',
            data: {
                name: user.name,
                dob: user.dateOfBirth,
                email: user.email,
                createdAt: user.createdAt,
                bannerUrl: user.bannerUrl,
                primaryContact: user.primaryContact,
                nationality: user.nationality
            }
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
});