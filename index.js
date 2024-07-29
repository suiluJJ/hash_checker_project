const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.use(cors());

// headeres for the fetch request
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-apikey': process.env.API_KEY
  }
};

app.get('/checkhash/:md5', async (req, res) => {
  const md5 = req.params.md5;
  console.log(md5);

  try {
    const response = await fetch('https://www.virustotal.com/api/v3/files/'+md5, options);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));