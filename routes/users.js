const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');

const checkEmailExists = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    next();
};

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user._id;
        console.log('Login Successful');
        res.redirect('/');
    } else {
        console.log('Invalid Credentials')
        res.redirect('/users/login');
    }
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/signup.html'));
});

router.post('/signup', checkEmailExists, async (req, res) => {
    const { fullname, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const user = new User({ fullname, email, password: hash });
    await user.save();
    res.redirect('/users/login');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    console.log('Logout Successful')
    res.redirect('/users/login');
});

router.get('/isLoggedIn', (req, res) => {
    res.json(!!req.session.userId);
});

module.exports = router;
