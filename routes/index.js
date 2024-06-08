const express = require('express');
const router = express.Router();
const axios = require('axios');
const Review = require('../models/Review');
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

router.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/search.html'));
})

router.get('/api/search', async (req, res) => {
    const { city, name, type } = req.query;
    let url;
    if (city !== "" && name === "" && type === "") {
        url = `https://api.openbrewerydb.org/breweries?by_city=${city}`;
    }

    else if (city === "" && name !== "" && type === "") {
        url = `https://api.openbrewerydb.org/breweries?by_name=${name}`;
    }

    else if (city === "" && name === "" && type !== "") {
        url = `https://api.openbrewerydb.org/breweries?by_type=${type}`;
    }

    else if (city !== "" && name === "" && type !== "") {
        url = `https://api.openbrewerydb.org/breweries?by_city=${city}&by_type=${type}`;
    }

    else if (city === "" && name !== "" && type === "") {
        url = `https://api.openbrewerydb.org/breweries?by_city=${city}&by_name=${type}`;
    }

    else if (city === "" && name !== "" && type !== "") {
        url = `https://api.openbrewerydb.org/breweries?by_name=${name}by_type=${type}`;
    }

    else if (city !== "" && name !== "" && type !== "") {
        url = `https://api.openbrewerydb.org/breweries?by_city=${city}&by_name=${name}&by_type=${type}`;
    }

    const response = await axios.get(url);
    breweries = response.data;
    res.json(breweries);
});

router.get('/brewery/:id', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public/html/brewery.html'));
    } catch (error) {
        console.error("Error fetching brewery details:", error);
        res.status(500).send("Error fetching brewery details");
    }
});

router.get('/api/brewery/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ breweryId: id }).populate('user', 'fullname');
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send("Error fetching reviews");
    }
});

router.post('/brewery/:id/review', async (req, res) => {
    const { id } = req.params;
    const { rating, description } = req.body;
    try {
        const review = new Review({ breweryId: id, rating, description, user: req.session.userId });
        await review.save();
        res.redirect(`/brewery/${id}`);
    } catch (error) {
        console.error("Error saving review:", error);
        res.status(500).send("Error saving review");
    }
});

router.get('/api/brewery/:id/average-rating', async (req, res) => {
    const { id } = req.params;
    try {
        const reviews = await Review.find({ breweryId: id });
        if (reviews.length === 0) {
            return res.json({ average: 'No ratings yet' });
        }
        
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        const average = total / reviews.length;

        res.json({ average: average.toFixed(2) });
    } catch (err) {
        console.error("Error fetching average rating:", err);
        res.status(500).send("Error fetching average rating");
    }
});

module.exports = router;
