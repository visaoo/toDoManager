const { request, response } = require('express'),
	database = require('../models/connect'),
	bcrypt = require('bcrypt'),
	jwt = require('jsonwebtoken'),
	checkTokenValidity = require('../utils/checkTokenValidity');

/**
 * @param {request} req
 * @param {response} res
 */
async function authenticateUser(req, res) {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(400).send({ message: 'Email e senha são obrigatórios' })
	}

	try {
		const [userDatabase] = await database.query('SELECT * FROM usuarios WHERE email = ?', [email])

		if (!userDatabase || userDatabase.length === 0) {
			return res.status(401).send({ message: '[DB] Email ou senha inválidos' })
		}

		const { password: userPwd, id: userId } = userDatabase[0]

		const compareBcrypt = await bcrypt.compare(password, userPwd)

		if (!compareBcrypt) {
			return res.status(401).send({ message: 'Senha inválida' })
		}

		const token = req.headers['authorization']?.split(' ')[1] // caso exista um token no corpo da requisição

		if (token) {
			const isValid = checkTokenValidity(token, userId)

			if (isValid) {
				console.log('Token válido, usuário autorizado')
				return res.status(201).send({ message: 'Usuario autorizado', token, email })
			}
		}	

		const jwtTemp = jwt.sign({ userId }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		})

		res.status(200).send({ email, token: jwtTemp, message: 'Login realizado com sucesso' })
	} catch (error) {
		console.error('Erro ao realizar login:', error)
		res.status(500).send({ message: 'Erro interno do servidor' })
	}
}

module.exports = { authenticateUser }
