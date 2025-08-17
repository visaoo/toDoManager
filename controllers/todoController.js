const database = require('../models/connect'),
	{ request, response } = require('express')

/**
 * Cria uma nova tarefa.
 * @param {request} req
 * @param {response} res
 */
async function createTask(req, res) {
	const { title, description } = req.body
	const userId = req.user

	if (!title || !description) {
		return res.status(400).json({ message: 'Todos os campos são obrigatórios' })
	}

	if (!userId) {
		return res.status(401).json({ message: 'Usuário não autenticado' })
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
	const { id } = req.body
	const userId = req.user

	if (!id) {
		return res.status(400).json({ message: 'O ID da tarefa é obrigatório' })
	}
	if (!userId) {
		return res.status(401).json({ message: 'Usuário não autenticado' })
	}

	try {
	const taskOwner = await getTaskOwner(id, userId)

	if (taskOwner.length === 0) {
		return res.status(404).json({ message: 'Tarefa não encontrada' })
	}	

	if (taskOwner[0].usuario_id != userId) {
		return res.status(403).json({ message: 'Acesso negado' })
	}

	const result = await database.query('DELETE FROM tarefas WHERE id = ?', [id])
	return res.status(200).json({ message: 'Tarefa deletada com sucesso' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Erro interno do servidor'})
	}
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
 */
async function updateTask(req, res) {
	const { id, title, description, concluido } = req.body
	const user = req.user

	if (!id) return res.status(400).json({ message: 'O ID da tarefa é obrigatório' })

	if (!user) {
		// teoricamente, isso nunca deve acontecer pq o auth middleware garante que o usuário esteja autenticado
		return res.status(401).json({ message: 'Usuário não autenticado' })
	}

	const taskOwner = await getTaskOwner(id, user)

	if (taskOwner.length === 0) {
		return res.status(404).json({ message: 'Tarefa não encontrada' })
	}

	if (taskOwner[0].usuario_id != user) {
		return res.status(403).json({ message: 'Acesso negado' })
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

	if (concluido !== undefined) {
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

/**
 * Obtém o dono de uma tarefa.
 * @param {number} taskId
 * @param {number} userId
 * @returns {Promise<object>}
 */
async function getTaskOwner(taskId, userId) {
	if (!taskId) {
		throw new Error('O ID da tarefa é obrigatório')
	}
	if (!userId) {
		throw new Error('O ID do usuário é obrigatório')
	}

	const [taskOwner] = await database.query('SELECT usuario_id FROM tarefas WHERE id = ?', [taskId])

	return taskOwner
}

module.exports = {
	createTask,
	deleteTask,
	getTasksByUserId,
	updateTask,
}
