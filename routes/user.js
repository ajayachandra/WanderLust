const express = require("express");
const router = express.Router();

const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

//SignUp Form
router.get("/signup",userController.renderSignupForm);

//Signup Submission
router.post("/signup",wrapAsync(userController.signup));

//Login Form
router.get("/login",userController.renderLoginForm);

//Login Submission
router.post("/login",saveRedirectUrl, passport.authenticate("local",
    {failureRedirect: '/login', failureFlash: true}),userController.login);

//Logout
router.get("/logout",userController.logout);

module.exports = router;
