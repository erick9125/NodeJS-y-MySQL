const express = require('express');
const router = express.Router();

const passport = require('passport');
const {isLoggedIn, isNotLoggdIn} = require('../lib/auth');

router.get('/signup', isNotLoggdIn, (req, res) => {
    res.render('auth/signup')
});

//ruta para registrar usuario
router.post('/signup', isNotLoggdIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/login', isNotLoggdIn, (req, res) => {
    res.render('auth/login');
});

//ruta para iniciar sesion
router.post('/login', isNotLoggdIn, (req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }) (req, res, next);
});


router.get('/profile', isLoggedIn , (req, res) => {
   res.render('profile')
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/login');
 });


module.exports = router;