const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const jwtSecret = 'abc123abc123abc123'
const bodyParser = require('body-parser')
mongoose.Promise = global.Promise
const series = require('./routes/series')
const User = require('./models/user')

app.use(bodyParser.json())

app.use('/series', series)

app.post('/auth', async (req, res) => {
  const user = req.body
  const userDB = await User.findOne({ username: user.username })
  if (userDB) {
    if (userDB.password === user.password) {
      const payload = {
        id: userDB.id,
        username: userDB.username,
        roles: userDB.roles
      }
      jwt.sign(payload, jwtSecret, (err, token) => {
        res.send({
          success: true,
          token: token
        })
      })

    } else {
      res.send({ success: false, message: 'wrong credentials' })
    }
  } else {
    res.send({ success: false, message: 'wrong credentials' })
  }

})

const createInitialUsers = async () => {
  const total = await User.countDocuments({})
  if (total === 0) {
    const user = new User({
      username: 'jack',
      password: '12345',
      roles: ['restrito', 'admin']
    })
    await user.save()

    const user2 = new User({
      username: 'restrito',
      password: '12345',
      roles: ['restrito']
    })
    await user2.save()
  }
}

mongoose
  .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    createInitialUsers()
    app.listen(port, () => console.log('Server starting...'))
  })
  .catch(e => console.log(e))
