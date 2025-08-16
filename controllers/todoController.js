const database = require('../models/connect'),
	{ request, response } = require('express')

/**
 * Cria uma nova tarefa.
 * @param {request} req
 * @param {response} res
 */
async function createTask(req, res) {
	const { title, description, userId } = req.body

	if (!title || !description || !userId) {
		return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
	}

	const result = await database.query(
		'INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES (?, ?, ?)',
		[title, description, userId]
	)
	return res.status(201).json({ id: result[0].insertId, message: 'Tarefa criada com sucesso' })
}

/**
 * Deleta uma tarefa existente.
 * @param {request} req
 * @param {response} res
 */
async function deleteTask(req, res) {
	const { id } = req.body;
  const userId = req.user;

  if (!id) {
		return res.status(400).json({ error: 'O ID da tarefa é obrigatório' })
	}
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const [taskOwner] = await database.query('SELECT usuario_id FROM tarefas WHERE id = ?', [id]);

  if (!taskOwner || taskOwner[0].usuario_id != userId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

	// const result = await database.query('DELETE FROM tarefas WHERE id = ?', [id])
	return res.status(200).json({ message: 'Tarefa deletada com sucesso' })
}

/**
 * Obtém todas as tarefas de um usuário específico.
 * @param {request} req
 * @param {response} res
 */
async function getTasksByUserId(req, res) {
	const userId = req.user
	const [result] = await database.query('SELECT * FROM tarefas WHERE usuario_id = ?', [userId])
  
	return res.status(200).json(result)
}

/**
 * Atualiza uma tarefa existente.
 * @param {request} req
 * @param {response} res
 * @returns 
 */

async function updateTask(req, res) {
	const { id, title, description, concluido } = req.body
  const user = req.user

  if (!user) { // teoricamente, isso nunca deve acontecer
    return res.status(401).json({ error: 'Usuário não autenticado' })
  }

  const [taskOwner] = await database.query('SELECT usuario_id FROM tarefas WHERE id = ?', [id])

	if (!taskOwner || taskOwner[0].usuario_id != user) {
		return res.status(403).json({ error: 'Acesso negado' })
	}

	const fields = []
	const values = []

	if (title) {
		fields.push('titulo = ?')
		values.push(title)
	}

	if (description) {
		fields.push('descricao = ?')
		values.push(description)
	}

	if (concluido) {
		fields.push('concluido = ?')
		values.push(concluido)
	}

	if (fields.length === 0) {
		return res.status(400).json({ message: 'Nenhum campo para atualizar' })
	}

	const [result] = await database.query(`UPDATE tarefas SET ${fields.join(', ')} WHERE id = ?`, [
		...values,
		id,
	])
	return res.status(200).json({ message: 'Tarefa atualizada com sucesso' })
}

async function getTaskOwner(id, userId) {
  if (!id) {
    throw new Error('O ID da tarefa é obrigatório');
  }
  if (!userId) {
    throw new Error('O ID do usuário é obrigatório');
  }
  
  const taskOwner = await database.query('SELECT usuario_id FROM tarefas WHERE id = ?', [id])

  return taskOwner
}

module.exports = {
	createTask,
	deleteTask,
	getTasksByUserId,
	updateTask,
}
