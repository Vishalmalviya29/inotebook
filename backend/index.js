// we are hitting the requests to the server in index.js

const connect_to_mongo = require('./db');
const express = require('express')
var cors = require('cors')




connect_to_mongo();

const app = express()
const port = 5000

app.use(express.json());  // middleware
app.use(cors())

// available routes(endpoints)
app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))



app.get('/', (req, res) => {
  res.send('Hello Vishal!!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})