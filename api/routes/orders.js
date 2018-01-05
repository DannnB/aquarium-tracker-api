const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product'); // used to check if the product exits for the order

router.get('/', (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name') // points to another module with data
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => { // map to get induvidual "doc"
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    type: 'GET',
                    url: 'https://' + process.env['C9_HOSTNAME'] + '/orders/' + doc._id // gets the "const" value from request params
                };
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
        //if product id dosn't exist then 404
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: 'https://' + process.env['C9_HOSTNAME'] + '/orders/' + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:orderId', (req, res, next) =>{
    Order.findById(req.params.orderId)
        .select('_id product quantity')
        .populate('product')
        .exec()
        .then(order =>{
            if (!order){ // if its null
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'https://' + process.env['C9_HOSTNAME'] + '/orders/'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:orderId', (req, res, next) =>{
    Order.remove({
        _id: req.params.orderId
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'https://' + process.env['C9_HOSTNAME'] + '/orders/',
                body: {
                    productId: 'ID',
                    quantity: "Number"
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;