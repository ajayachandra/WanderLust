const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const reviewController = require("../controllers/review.js");

const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");

//Post review route
router.post("/:id/reviews",isLoggedIn,validateReview,
    wrapAsync(reviewController.createReview));

//Delete review route
router.delete("/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.deleteReview));

module.exports = router;