const express = require('express');
const verify = require('../models/shared/verify-token');
const {isFileImage} = require('../models/shared/validation-schema');

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
            message: 'Organization search was successful',
            data: organizaiton
        })
    } catch (error) {
        res.status(500).send('There was a problem fetching data');
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

router.put('/organizations/update-logo/:id', verify, async (req, res) => {
    if(req.files === null){
        res.status(400).json({
            success: false,
            message: 'No image was uploaded',
            data: null
        })
    }

    if(req.params.id === undefined){
        res.status(400).json({
            success: false,
            message: 'Id for organization was not provided',
            data: null
        })
    }

    const file = req.files.file;
    const {isImage, name} = isFileImage(file);

    if(!isImage){
        res.status(400).json({
            success: false,
            message: 'Uploaded file must be an image with a png or jpeg extension',
            data: null
        })
    }

    const filePath = `${__dirname}/uploads/${name}`;
    file.mv(filePath, err => {
        console.log(err);
        return res.status(500).send(err);
    })

    try {
        const selectedOrgainizer = await Organizer.findById({_id: req.params.id});

        if(!selectedOrgainizer) {
            res.status(404).json({
                success: false,
                message: 'The organization does not exist',
                data: null
            })
        }

        selectedOrgainizer.logoUrl = filePath;
        await Organizer.findOneAndUpdate({_id: req.params.id}, selectedOrgainizer);
        res.json({
            success: true,
            message: 'Image update was successful',
            data: {
                fileName: name,
                filePath: filePath
            }
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
});

router.post('/organizations/update-banner/:id', verify, async (req, res) => {
    if(req.files === null){
        res.status(400).json({
            success: false,
            message: 'No image was uploaded',
            data: null
        })
    }

    if(req.params.id === undefined){
        res.status(400).json({
            success: false,
            message: 'Id for organization was not provided',
            data: null
        })
    }

    const file = req.files.file;
    const {isImage, name} = isFileImage(file);

    if(!isImage){
        res.status(400).json({
            success: false,
            message: 'Uploaded file must be an image with a png or jpeg extension',
            data: null
        })
    }

    const filePath = `${__dirname}/uploads/${name}`;
    file.mv(filePath, err => {
        console.log(err);
        return res.status(500).send(err);
    })

    try {
        const selectedOrgainizer = await Organizer.findById({_id: req.params.id});

        if(!selectedOrgainizer) {
            res.status(404).json({
                success: false,
                message: 'The organization does not exist',
                data: null
            })
        }

        selectedOrgainizer.bannerUrl = filePath;
        await Organizer.findOneAndUpdate({_id: req.params.id}, selectedOrgainizer);
        res.json({
            success: true,
            message: 'Banner update was successful',
            data: {
                fileName: name,
                filePath: filePath
            }
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
});

router.put('/organizations/update-employees/:id', verify, async (req, res) => {
    if (!req.params.id) res.status(400).send('Organization Id was not provided');
    const employeesIds = req.body;

    if (employeesIds.length <= 0) res.status(400).send('List of employees were not provided');

    try {
        const selectedOrganization = Organizer.findById({ _id: req.params.id });

        if (!selectedOrganization) res.status(404).send('Selected organization does not exist');

        selectedOrganization.employees = [...selectedOrganization.employees, employeesIds];
        const response = await Organizer.findByIdAndUpdate({ _id: req.params.id }, selectedOrganization);

        res.json({
            success: true,
            message: 'Employees updated successfully',
            data: response
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('There was a problem adding employess');
    }
});

module.exports = router;