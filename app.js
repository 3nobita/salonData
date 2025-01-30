// app.js
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const formRoute = require('./routes/formRoute'); 
const app = express();
const PORT = 3000;
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '679505a1-23b4-800f-abef-ff9f4ca2d2fb',
  database: 'userdb',
  port: 3306,
});
app.use((req, res, next) => {
  req.db = db;
  next();
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use('/', formRoute);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
