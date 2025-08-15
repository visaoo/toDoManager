require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 2000
const Router = require('./routes/routes')

app.use(express.json())

app.use(Router)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})

