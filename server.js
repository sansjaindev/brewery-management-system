const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();


mongoose.connect('mongodb://localhost:27017/brewerydb', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'FBAD487044899EE7F0583E2497FE5F442AB68C88BC99FA5BB3E4F1E3471EDBAC',
    resave: false,
    saveUninitialized: true,
}));


const User = require('./models/User');
const Review = require('./models/Review');

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
