const jwt = require('jsonwebtoken')
// require('dotenv').config() // so importei pra testar

function checkTokenValidity(token, id) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
		return decoded.userId == id
	} catch (error) {
		return false
	}
}

module.exports = checkTokenValidity