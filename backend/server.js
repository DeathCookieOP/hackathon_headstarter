require("dotenv").config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

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

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});