const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../models/shared/validation-schema');

const User = require('../models/user');

router.post('/auth/register', async (req, res) => {
    const {error} = registerValidation(req.body);

    if(error){
        res.status(400).json({
            success: false,
            message: errordetails[0].message,
            data: null
        })
    }

    try {
        var existingUsername = await User.findOne({email: req.body.email});

        if(existingUsername !== null){
            res.status(400).json({
                success: false,
                message: 'email already taken',
                data: null
            })
        }

        //hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        var response = await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null
        })
    }
});

router.post('/auth/login', async (req, res) => {
    const {error} = loginValidation(req.body);

    if(error){
        res.status(400).json({
            success: false,
            message: errordetails[0].message,
            data: null
        })
    }

    const existingUsername = await User.findOne({email: req.body.email});

    if(existingUsername === null){
        res.status(404).json({
            success: false,
            message: 'email or password is wrong',
            data: null
        })
    }

    const validPass = await bcrypt.compare(req.body.password, existingUsername.password);

    if(!validPass){
        res.status(404).json({
            success: false,
            message: 'email or password is wrong',
            data: null
        })
    }

    const token = jwt.sign({_id: existingUsername.id}, ';ksdjajsfkjdjfad9e7979875flkjdsfja098750$%&&');
    res.header('Authorization', token);
    res.json({
        success: true,
        message: 'Operation successfull',
        data: {
            user: existingUsername.email,
            token
        }
    })
})

module.exports = router;