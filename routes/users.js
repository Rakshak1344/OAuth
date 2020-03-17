//npm-imports
const router = require('express-promise-router')()
const passport = require('passport')
// const router = express.Router
// var jwt = require('jsonwebtoken');
// const express = require('express')
// const config = require('../config/index')

//local-imports
require('../passport')
const { validateBody, schemas } = require('../helpers/routeHelpers')
const UserController = require('../controllers/users')

// renaming
const validateData = validateBody(schemas.authSchema)
const passportSignIn = passport.authenticate('local', { session: false })
const passportJWT = passport.authenticate('jwt', { session: false })

//Routes

//use email and password
router.route('/signup')
    .post(validateData, UserController.signUp)

//use email and password
router.route('/signin')
    .post(validateData, passportSignIn, UserController.signIn)

//use Authorization Header with Bearer <token>
router.route('/secret')
    .get(passportJWT, UserController.secret)

module.exports = router