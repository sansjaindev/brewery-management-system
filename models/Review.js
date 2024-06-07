const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    breweryId: String,
    rating: Number,
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
