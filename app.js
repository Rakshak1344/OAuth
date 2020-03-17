const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/APIAuthentication-DB", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const app = express()

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())

//Routes
app.use('/users', require('./routes/users'))

//start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(chalk.white.bgGreen('Server started at ') + chalk.greenBright.bgWhite(` ${port} `))
})



