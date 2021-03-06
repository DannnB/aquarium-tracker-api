const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.users_create_user = (req, res, next) => {
    User.find({ email: req.body.email}) // find if the email exists lready before creating the user
        // find() can also see if a Username exists
        .exec()
        .then(user => {
            if ( user.length >= 1 ) { // "user" will return empty array. length >= 1 means it has a user so we only create a user on "0"
                // we know we have a user
                return res.status(409).json({
                    // 409 = conflict with resource or 422 = we understand but can't process it
                    message: 'Email already exists. Please try another one or click "Retrieve Account".'
                });
            } else {
                // if email dons't exist then create the user
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                // 10, stops passwords form being looked up in dictionary tables by using salting
                    if (err){
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                        .save() // save new user to DB
                        .then(result => {
                            console.log(result);
                            res.status(201).json({ // 201 as new resource
                                message: 'User created'
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                               error: err 
                            });
                        });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
};

exports.users_login_user = (req, res, next) => {
    User.find({
        // could use findOne() to not get an array
        email: req.body.email
    })
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth failed' // return a 401 so a user cant keep testing emails to see what ones exisits and dont' THis can stop brute force attackes
            });
        }
        bcrypt.compare(req.body.password, user[0].password,  (err, result) => {
            if(err){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if(result){
                const token = jwt.sign({ // the payload to pas to client - not the password even if hashed
                        email: user[0].email, // the user we got from the server
                        id: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Auth failed'
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.users_delete_user = (req, res, next) => {
    // TODO: add message if no user exists
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};