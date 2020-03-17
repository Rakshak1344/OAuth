//package imports
const passport = require('passport')

//JWT STRATEGY
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
//LOCAL STRATEGY
const LocalStrategy = require('passport-local').Strategy


//local-imports
const { JWT_SECRET } = require('./config/index')
const User = require('./models/user')

// Json Web Token STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: JWT_SECRET,
    // issuer: 'gauth'
}, async (payload, done) => {
    console.log("STARTED")
    try {
        //Find the user specified in token
        const user = await User.findById(payload.sub)
        console.log(payload.sub)

        //If user dosent exist, handle it
        if (!user) {
            return done(null, false)
        }

        //Otherwise, return the user
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}));



//LOCAL STRATERGY
passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        //check if email exist
        const user = await User.findOne({ email })

        //If not, handle it
        if (!user) {
            return done(null, false)
        }

        //check if password is correct
        const isMatch = await user.isValidPassword(password)

        //If not, handle it
        if (!isMatch) {
            done(null, false)
        }

        //Otherwise, return the user
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))