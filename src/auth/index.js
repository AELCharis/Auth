
const router = require('express').Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../db/connection');
const users = db.get('users');  //perno tous users apo tin mongodb


const registerSchema = Joi.object().keys({
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().min(3).max(30).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    userClass: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    email: Joi.string().email({ minDomainSegments: 2 })
});


router.get('/register', (req, res) => {
    res.send('Welcome 👽 to the Register !')
});

router.post('/register', (req, res, next) => {
        const result = registerSchema.validate(req.body);
        if(!result.error) {
            users.findOne({ //search gia proprty se object ean iparxi i oxi
                username: req.body.username,
                 }).then(user => {
                    console.log(user)
                if(user !== null) {
                    console.log('Username already exist please choose another... :)')
                    const error = new Error('Username already exist please choose another... :)');
                    next(error);
                } else {
                        bcrypt.hash(req.body.password.trim(), saltRounds)       //perno to password apo to xristi k tou prostheto to salt
                            .then(hashedPassword => {
                                const newUser = {
                                    firstname: req.body.firstname,
                                    lastName: req.body.lastname,
                                    username: req.body.username,
                                    userClass: req.body.userClass,
                                    email: req.body.email,
                                    password: hashedPassword
                                };
                                users.insert(newUser)
                                    .then(addedUser => {
                                        delete addedUser.password;
                                        res.json(newUser)
                                    })
                                    .catch(err => next(error))
                            })
                            .catch(error => next(error));       //ean iparxi kapio error
                }
            })
        } else {
            res.json(result.error);
        }
});

router.get('/login', (req, res) => {
    res.send('Welcome 👽 to the Login !')
});

module.exports = router;
