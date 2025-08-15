const { request, response } = require('express'),
	database = require('../models/connect'),
	bcrypt = require('bcrypt'),
	jwt = require('jsonwebtoken')

/**
 * @param {request} req
 * @param {response} res
 */
async function Authenticate(req, res) {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(400).send('Email e senha são obrigatórios')
	}

	const [user] = await database.query('SELECT * FROM usuarios WHERE email = ?', [email])

	const { email: userEmail, password: userPwd } = user[0]

	const compareBcrypt = await bcrypt.compare(password, userPwd)

	if (email === userEmail && compareBcrypt) {
		const jwtTemp = jwt.sign({ email }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		})

		const xr = jwt.verify(jwtTemp, process.env.JWT_SECRET)
		console.log(xr)
	}
}

module.exports = { Authenticate }
