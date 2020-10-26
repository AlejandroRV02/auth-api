const { Router } = require('express');
const router = Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/user');


//Import the validation
const {registerValidation, loginValidation} = require('../validation');


router.post('/register', async (req, res) => {

    //Validate data for user
    const {error} = registerValidation(req.body);

    if (error){
        return res.status(400).send(error.details[0].message);
    }

    //Checking if the user is already in the db
    const existingEmail = await User.findOne({email: req.body.email});
    if(existingEmail){
        return res.status(400).send('Email already exists')
    }


    //Hash the password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {

        const savedUser = await user.save();
        res.send(savedUser);

    } catch (err) {
        res.status(400).send(err);
    }


})



router.post('/login', async (req, res) => {

    //Validate data for user
    const {error} = loginValidation(req.body);

    if (error){
        return res.status(400).send(error.details[0].message);
    }

    //Checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).send('Email doesnt exists')
    }


    //Cheking is password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword){
        return res.status(400).send('Invalid password');
    }

    
    //Create the token
    const token = jwt.sign({
        _id: user._id
    }, process.env.TOKEN_SECRET);

    res.header('auth-token', token).send(token);




});


module.exports = router;