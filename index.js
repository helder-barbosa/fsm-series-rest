const express = require('express')
const app = express()
const port = 3000

const series = [
  { name: 'La Casa de Papel' },
  { name: 'Breaking Bad' },
  { name: 'Ozark' }
]

app.get('/series', (req, res) => res.send(series))

app.listen(port, () => console.log('Server starting...'))