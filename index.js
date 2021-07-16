const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
mongoose.Promise = global.Promise
const series = require('./routes/series')

app.use(bodyParser({ extended: true }))

app.use('/series', series)

mongoose
  .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => console.log('Server starting...'))
  })
  .catch(e => console.log(e))
