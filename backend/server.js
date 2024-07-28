require("dotenv").config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// mysql connection
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.DB_NAME
});

//connect to db
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Hadith API configuration
const api_key = "$2y$10$xXGD647HQu8sUMJtZgSedwaXtVPU9Mshgs1ukuxoLtTPOTa9fj";
const base_url = "https://www.hadithapi.com/api/hadiths/";

const books_to_include = [
  "sahih-bukhari", "sahih-muslim", "al-tirmidhi", 
  "abu-dawood", "ibn-e-majah", "sunan-nasai", "musnad-ahmad"
];

app.get('/api/random-hadith', async (req, res) => {
  try {
    const random_book = books_to_include[Math.floor(Math.random() * books_to_include.length)];
    
    const params = new URLSearchParams({
      apiKey: api_key,
      book: random_book,
      paginate: 1
    });

    console.log('Requesting hadith with params:', params.toString());

    const response = await axios.get(`${base_url}?${params.toString()}`);

    console.log('API response status:', response.status);
    console.log('API response data:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.hadiths && response.data.hadiths.data && response.data.hadiths.data.length > 0) {
      const hadith = response.data.hadiths.data[0];
      res.json({
        bookName: hadith.book?.bookName || 'Unknown Book',
        chapterNumber: hadith.chapter?.chapterNumber || 'N/A',
        chapterTitle: hadith.chapter?.chapterTitle || 'No Title',
        hadithNumber: hadith.hadithNumber || 'N/A',
        englishNarrator: hadith.englishNarrator || 'Unknown Narrator',
        hadithEnglish: hadith.hadithEnglish || 'No text available'
      });
    } else {
      console.log('No hadith found in the response');
      res.status(404).json({ error: 'No hadith found' });
    }
  } catch (error) {
    console.error('Error fetching hadith:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to fetch hadith' });
  }
});


// New route to handle email submissions
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  const query = 'INSERT INTO subscribers (email) VALUES (?)';
  
  connection.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error saving email:', error);
      res.status(500).json({ error: 'Failed to save email' });
      return;
    }
    res.json({ message: 'Email saved successfully' });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});