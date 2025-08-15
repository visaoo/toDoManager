/**
 * Cria uma nova tarefa.
 * @param {{ title: string, description: string, userId: string }} params 
 * @returns retorna o ID da nova tarefa
 */
async function createTask(params) {
  const { title, description, userId } = params;

  if (!title || !description || !userId) {
    throw new Error('Todos os campos são obrigatórios');
  }

  const result = await database.query('INSERT INTO tarefas (title, description, user_id) VALUES (?, ?, ?)', [title, description, userId]);
  return result[0].insertId;
}

/**
 * Deleta uma tarefa existente.
 * @param {string} id 
 * @returns retorna um booleano indicando se a exclusão foi bem-sucedida
 */
async function deleteTask(id) {

  if (!id) {
    throw new Error('O ID do todo é obrigatório');
  }

  const result = await database.query('DELETE FROM tarefas WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
/**
 * Obtém todas as tarefas de um usuário específico.
 * @param {string} userId 
 * @returns retorna uma lista de tarefas
 */
async function getTasksByUserId(userId) {
  if (!userId) {
    throw new Error('O ID do usuário é obrigatório');
  }

  const result = await database.query('SELECT * FROM tarefas WHERE user_id = ?', [userId]);
  return result;
}

/**
 * Atualiza uma tarefa existente.
 * @param {{ title: string, description: string, status: string }} params 
 * @returns retorna um booleano indicando se a atualização foi bem-sucedida
 */

async function updateTask(params) {
  const { title, description, status } = params;

  const fields = [];
  const values = [];

  if (title) {
    fields.push('title = ?');
    values.push(title);
  }

  if (description) {
    fields.push('description = ?');
    values.push(description);
  }

  if (status) {
    fields.push('status = ?');
    values.push(status);
  }

  if (fields.length === 0) {
    throw new Error('Nenhum campo para atualizar');
  }

  const result = await database.query(`UPDATE tarefas SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
  return result.affectedRows > 0;
}


module.exports = {
  createTask,
  deleteTask,
  getTasksByUserId,
  updateTask
};