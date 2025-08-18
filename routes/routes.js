const { Router } = require('express'),
	router = Router(),
	userController = require('../controllers/userController'),
	authController = require('../controllers/authController'),
	todoController = require('../controllers/todoController'),
	authMiddleware = require('../utils/AuthMiddleware')

router.post('/login', authController.authenticateUser)
router.get('/usuarios', userController.listUsers)
router.post('/usuarios', userController.createUser)
router.put('/usuarios', authMiddleware, userController.updateUser) // tamo aqui
router.delete('/usuarios', authMiddleware, userController.deleteUser)

// Rotas das tarefas
router.post('/tarefas', authMiddleware, todoController.createTask)
router.get('/tarefas', authMiddleware, todoController.getTasksByUserId)
router.put('/tarefas', authMiddleware, todoController.updateTask)
router.delete('/tarefas', authMiddleware, todoController.deleteTask)

module.exports = router
