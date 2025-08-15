const { request, response } = require('express'),
    database = require('../models/connect'),
    bcrypt = require('bcrypt');

/**
 * @param {request} req 
 * @param {response} res 
 * @returns {Promise<void>}
 */
async function createUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }


  if (email) {
    const existUser = await database.query('SELECT * from usuarios WHERE email = ?', [email]);
    if (existUser[0].length > 0) {
      return res.status(409).send('Já existe um usuário cadastrado com este email!');
    }
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await database.query('INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)', [name, email, passwordHash]);
    res.status(201).send(`Usuário cadastrado com ID: ${result[0].insertId}`);
  } catch (e) {

    if (e.code === 'ER_DUP_ENTRY') {
      res.status(409).send('Usuário já cadastrado')
      return;
    }

    console.error(e) 

    res.status(500).send('Erro ao cadastrar usuário');
  }
}

async function listUsers(req, res) {
  try {
    const [rows] = await database.query('SELECT * FROM usuarios');
    res.status(200).json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send('Erro ao listar usuários');
  }
}

module.exports = {
  createUser,
  listUsers
};