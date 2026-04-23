const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

app.get('/scan', (req, res) => {
  console.log('Returning saved scan result');
  const data = fs.readFileSync('sample-result.json', 'utf8');
  res.json(JSON.parse(data));
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
