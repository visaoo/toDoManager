const { request, response } = require('express'),
    database = require('../models/connect'),
    bcrypt = require('bcrypt'),
    { hashPassword } = require('../utils/passwordHash');

/**
 * @param {request} req 
 * @param {response} res 
 * @returns {Promise<void>}
 */
async function createUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }


    const existUser = await database.query('SELECT * from usuarios WHERE email = ?', [email]);
    if (existUser[0].length > 0) {
      return res.status(409).json({ message: 'Já existe um usuário cadastrado com este email!' });
    }


  try {
    const passwordHash = await hashPassword(password)

    const result = await database.query('INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)', [name, email, passwordHash]);
    res.status(201).json({ message: `Usuário cadastrado com ID: ${result[0].insertId}` });
  } catch (e) {

    if (e.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: 'Usuário já cadastrado' });
      return;
    }

    console.error(e);

    res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
}

async function updateUser(req, res) {
  const { name, email, password } = req.body;
  const userId = req.user

  if (!userId) {
    return res.status(401).json({ message: 'Usuário não autenticado'});
  }

  const fields = [];
  const values = [];

  if (name) {
    fields.push('name = ?');
    values.push(name);
  }

  if (email) {
    fields.push('email = ?');
    values.push(email);
  }

  if (password) {
    fields.push('password = ?');
    const hashedPwd = await hashPassword(password)
    values.push(hashedPwd);
  }

  if (fields.length > 0) {
    const sql = `UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`;
    try {
      const result = await database.query(sql, [...values, userId]);
      if (result[0].affectedRows === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}


async function deleteUser(req, res) {
  const userId = req.user;

  if (!userId) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  try {
    const result = await database.query('DELETE FROM usuarios WHERE id = ?', [userId]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function listUsers(req, res) {
  try {
    const [rows] = await database.query('SELECT * FROM usuarios');
    res.status(200).json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: 'Erro ao listar usuários' });
  }
}

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  listUsers
};