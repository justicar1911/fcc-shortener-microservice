require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const urlModel = new Map()
let shortURLIndex = 0;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// Body Parser middleware to parse the form data
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// API /api/shorturl
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  let isValidURL = /^https?:\/\/(w{3}.)?.+/.test(url)
  if (!isValidURL) {
    return res.json({ error: 'invalid url' })
  }

  shortURLIndex++
  urlModel.set(shortURLIndex, url)
  return res.json({
    original_url: url,
    short_url: shortURLIndex
  })
})

app.get('/api/shorturl/:id', (req, res) => {
  const { id } = req.params
  const url = urlModel.get(Number(id))
  res.redirect(url)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
