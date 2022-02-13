const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user')

exports.signup = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (user) {
                return res.status(409).json({
                    message: 'Adresse email has already been taken.'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json({
                            error: error
                        })
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: "User created sucessfully."
                                });
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch(err => {
            console.log('find one user', err)
            res.status(500).json({
                error: err
            });
        });

}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Email or password incorrect.' });
            } else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(404).json({ message: 'Email or password incorrect.' });
                    }
                    if (result) {
                        console.log('result user ', user)
                        const token = jwt.sign({
                                email: user.email,
                                userId: user._id
                            },
                            process.env.JWT_KEY, {
                                expiresIn: "1h"
                            },
                        );
                        return res.status(200).json({
                            message: 'Auth successful.',
                            token: token
                        })
                    }
                    return res.status(404).json({ message: 'Email or password incorrect.' });
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
}

exports.show = (req, res, next) => {
    User.findOne({ email: req.params.id }).exec()
        .then(result => {
            console.log('Get User result: ', result)
            if (result) {
                res.status(200).json(result)
            } else {
                User.findById(req.params.id).exec()
                    .then(result => {
                        console.log('Get User result: ', result)
                        if (result) {
                            res.status(200).json(result)
                        } else {
                            res.status(404).json({
                                message: 'User not found'
                            });
                        }
                    }).catch(err => {
                        console.log('Get User error: ', err)
                        res.status(500).json({
                            error: err
                        })
                    });
            }
        }).catch(err => {
            console.log('Get User error: ', err)
            res.status(500).json({
                error: err
            })
        });
}

exports.destroy = (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(200).send({ message: "User deleted successfully." })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
}