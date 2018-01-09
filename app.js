const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const tanksRoutes = require('./api/routes/tanks');

mongoose.connect(
    'mongodb://aQuA1rumTr6k3r:1^hW3392i!nsThSZ8nvM92e&e@aquarium-tracker-shard-00-00-ioz4b.mongodb.net:27017,aquarium-tracker-shard-00-01-ioz4b.mongodb.net:27017,aquarium-tracker-shard-00-02-ioz4b.mongodb.net:27017/test?ssl=true&replicaSet=aquarium-tracker-shard-0&authSource=admin',
    { useMongoClient: true }
);
mongoose.Promise = global.Promise; // uses Node js default promise, remvoes depreaction warning

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); // parse only requests at /uplaods
// parse URL encoded data eg page?name=value
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

// Add headers before any data requests

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') // * access all or and ip or HTTP address. Can only sdtop other webpages but not tools like postman
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method == 'OPTIONS') {
        // euqal to http request
        res.header('Access-Control-Allow-Methids', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// sets up middleware, all requets have to go through this
app.use('/products', productRoutes); //forward to products.js
app.use('/orders', ordersRoutes); //forward to orders.js
app.use('/tanks', tanksRoutes); //forward to tanks.js

// capture all requets past '/' as beloq the above app.use() all other requests have failed as there is no route

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404; // assign error
    // forward request as error
    next(error)
})

// accepts all errors accross the app
// eg if database errors then it will skip the abouve first and have its only error 
app.use((error, req, res, next) => {
    res.status(error.status || 500); // 500 for all other errors
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;

/* 
Api
    /products
        GET
        POST
    /products/{id}
        GET
        PATCH
        DELETE
    /orders
        GET
        POST
    /orders/{id}
        GET
        DELETE
*/

/*********************
 * 
 * Aquarium API
 * 
 *********************/

/* 
Api
    /users
        GET
        POST
    /users/:id
        GET
        POST
        PATCH
        DELETE
    /tanks
        GET
        POST
    /tanks/:id
        GET
        POST
        PATCH
        DELETE
    /tanks/:id/:contentId
        GET
        POST
        PATCH
        DELETE
*/