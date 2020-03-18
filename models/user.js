const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema

//Create a Schema
const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    local: {
        email: {
            type: String,
            lowercase: true,
        },
        password: {
            type: String,
        },
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    }
})

userSchema.pre('save', async function (next) {
    try {
        if(this.method !== 'local'){
            next()
        }
        //Generate a salt
        const salt = await bcrypt.genSalt(10)
        //Generate passwordHash
        const passwordHash = await bcrypt.hash(this.local.password, salt)
        // console.log("salt:", salt)
        // console.log("normal password:", this.password)
        // console.log("hashed password:", passwordHash)

        // Re-assign hashed version over original, plain text password
        this.local.password = passwordHash
        next()
    } catch (error) {
        next(error)
    }
})

// validate password
userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password)
    } catch (error) {
        throw new Error(error)
    }
}
//Create a model
const User = mongoose.model('user', userSchema)

//Export the model

module.exports = User