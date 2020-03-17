const User = require('../models/user')
const JWT = require('jsonwebtoken')

const { JWT_SECRET } = require('../config/index')

signToken = user => {
    return JWT.sign({
        iss: 'gauth',
        sub: user._id,
        iat: new Date().getTime(), //current date
        exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, JWT_SECRET)
}


module.exports = {
    signUp: async (req, res, next) => {
        //Email & password
        console.log(req.value.body)
        // console.log('UserController.signUp')

        const { email, password } = req.value.body        // const email = req.value.body.email        // const password = req.value.body.password
        //check if there is a user with the same email
        const foundUser = await User.findOne({ email })
        if (foundUser) {
            return res.status(403).json({ error: "Email is already in use" })
        }
        const newUser = new User({ email, password })
        await newUser.save();
        //Respond with token
        const token = signToken(newUser)
        // res.json({ user: "created" })
        res.status(200).json({ token })
    },
    signIn: async (req, res, next) => {
        //Generate token
        // console.log(req.user)
        const token = signToken(req.user)
        res.status(200).json({token})
        console.log('UserController.signIn')
        console.log('Successful')

    },
    secret: async (req, res, next) => {
        console.log('It works')
        console.log('UserController.secret')
        res.json({ secret: "resource" })
    },

   

}