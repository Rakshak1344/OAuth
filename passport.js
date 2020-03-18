//package imports
const passport = require('passport')

//JWT STRATEGY
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

//LOCAL STRATEGY
const LocalStrategy = require('passport-local').Strategy

//GOOGLE PLUS STRATEGY
const GooglePlusTokenStrategy = require('passport-google-plus-token')

//FACEBOOK STRATERGY
const FaceBookTokenStratergy = require('passport-facebook-token')

//local-imports
const { JWT_SECRET, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } = require('./config/index')
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


//GOOGLE PLUS TOKEN STRATERGY
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    // authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    // tokenURL: 'https://accounts.google.com/o/oauth2/v2/token',
}, async function (accessToken, refreshToken, profile, done) {
    // console.log('accessToken', accessToken)
    // console.log('refreshToken', refreshToken)
    // console.log('profile', profile)
    // console.log(profile.emails[0].value)
    // console.log(profile.id)
    try {
        //Check whether this current user exists in our DB by google.id.
        const existingUser = await User.findOne({ "google.id": profile.id })

        //If yes, return existingUser
        if (existingUser) {
            console.log('User already exist in our DB')
            return done(null, existingUser)
        }
        //If No, create a newUser and return it
        console.log('Creating new user in our DB')
        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        })

        await newUser.save()
        done(null, newUser)
    } catch (error) {
        done(error, false, error.message)
    }

}));

//FACEBOOK STRATERGY
passport.use("facebookToken",new FaceBookTokenStratergy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET
}, async (accessToken,refreshToken,profile,done) => {
    try{
        console.log("accessToken",accessToken)
        console.log("refreshToken",refreshToken)
        console.log("profile",profile)
        const existingUser = await User.findOne({"facebook.id": profile.id})
        if(existingUser){
            return done(null,existingUser)
        }
        const newUser = new User({
            method: 'facebook',
            facebook:{
                id: profile.id,
                email : profile.emails[0].value
            }
        })
        await newUser.save()
        done(null, newUser)
    }catch(error){
        done(error,false,error.message)
    }
}))


//LOCAL STRATERGY
passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        //check if email exist
        const user = await User.findOne({ "local.email": email })

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