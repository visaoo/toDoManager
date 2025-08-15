require('dotenv').config();

const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

pool.getConnection()
  .then(connection => {
    console.log('MySQL conectado.');
    connection.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao MySQL:', err);
  });

module.exports = pool;
