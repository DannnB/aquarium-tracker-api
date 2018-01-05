const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const multer = require('multer');
//const upload = multer({dest: 'uploads/'});// store all uploaded files in this place

const tanksRoutes = require('./api/routes/tanks');
// express.use('/tanks', tanksRoutes);

const Tank = require('../models/tank'); // import model exported from product.js

let BASE_URL = process.env.BASE_URL_PROTO + process.env['C9_HOSTNAME'];

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
                    // mannually assign values
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

module.exports = router;