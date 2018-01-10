const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const multer = require('multer');
//const upload = multer({dest: 'uploads/'});// store all uploaded files in this place

const Tank = require('../models/tank'); // import model exported from product.js

let BASE_URL = "" // process.env.BASE_URL_PROTO + process.env['C9_HOSTNAME'];

// /products is already set, this jjust adds to the url so /products/products if it was set in here eg '/id' = /products/id
router.get('/', (req, res, next) =>{
    Tank.find() // find all // .limit(5) etc
    .select('name _id')// define which fields to select
    .exec()
    .then(docs => {
        //return more
        const response = {
            count: docs.length,
            tanks: docs.map(doc => {
                return {
                    // returns a new version of doc
                    // manually assign values
                    name: doc.name,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: BASE_URL + '/tanks/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
        // IF YOU NEED AN ERROR RESPONSE (ITS AN EMPTY ARRAY SO NOT REALLY AN ERROR)
        // if(docs.length >= 0){
        //     res.status(200).json(docs);
        // } else {
        //     res.status(404).json({
        //         message: 'No entries found'
        //     })
        // }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
    
});

router.post('/',(req, res, next) =>{
    const tank = new Tank({ // passes data to DB
        _id: new mongoose.Types.ObjectId(), // creates a new unique _id value
        name: req.body.name,
        details: req.body.details
        //price: req.body.price // required values and settings are set oin the schema as below:
        //{type: Number, required: true // make sure this field is required } 
    });
    // method used on models and stores this data in DB
    tank
        .save()
        .then(result => { 
            console.log(result);
            res.status(201).json({
                message: 'Created tank successfully',
                createdTank: {
                    // return new object removing bits
                    name: result.name,
                    _id: result._id,
                    details: result.details,
                    request: {
                        type: 'GET',
                        url: BASE_URL + '/tanks/' + result._id
                    }
                }
            })
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:tankId', (req, res, next) =>{ // :tankId is a varible
    const id = req.params.tankId; // data fetched from database
    Tank.findById(id)
    .select('name details _id')
    .exec()
    .then(doc => {
        //console.log("From database", doc);
        if (doc) {
            // if nott null / isn't there
            res.status(200).json({
                message: "Got tank successfully",
                tank: {
                    // return new object removing bits
                    name: doc.name,
                    _id: doc._id,
                    details: doc.details,
                    request: {
                        type: 'GET',
                        url: BASE_URL + '/tanks/' + doc._id
                    }
                }
                // or
                // product: doc,
                // request: {
                //     type: 'GET',
                //     description: 'Get all products'
                //     url: 'https://' + process.env['C9_HOSTNAME'] + '/products/'
                // }
            })
        }else {
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
    // if(id === 'special'){
    //     res.status(200).json({
    //         message: 'Yoou descovered the special ID',
    //         id: id // the const id value
    //     })
    // }else{
    //     res.status(200).json({
    //         message: 'You past an ID'
    //     })
    // }
});

router.patch('/:tankId', (req, res, next) =>{
    // array to use for POSTMAN
    // [{ "propName": "name", "value": "Harry Potter 6"	}]
    // [{ "propName": "price", "value": "14.10"	}]
    const id = req.params.tankId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    // cant add new props
    // can be rewritten to accept non-existing props, author: "Name"
    Tank.update({
        _id: id, // find the tank to update
    },
    { // change something 
        $set: updateOps // mongodb property, discrbe key value pairs to update, eg name, price. changing id would create new object/product
             // wont change anything that isn't specified
            //name: req.body.newName,
            //price: req.body.newPrice
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Tank updated',
            request: {
                type: 'GET',
                url: BASE_URL + '/tanks/' + id // gets the "const" value from request params
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

router.delete('/:tankId', (req, res, next) =>{
    const id = req.params.tankId;
    Tank.remove({
        _id: id // remove any objects that fulfill this filter
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Deleted tank: ' + id,
            request: {
                type: 'POST',
                url: BASE_URL + '/tanks/' + id, // gets the "const" value from request params
                body: {
                    name: 'String'
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;