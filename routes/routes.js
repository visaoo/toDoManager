const { Router } = require("express"),
  router = Router(),
  userController = require("../controllers/userController"),
  authController = require('../controllers/authController');

router.get("/usuarios", userController.listUsers);
router.post("/usuarios", userController.createUser);
router.post("/login", authController.Authenticate);

// router.post('/usuarios', async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).send('Todos os campos são obrigatórios');
//   }

//   if (email) {
//     const existUser = await database.query('SELECT * from usuarios WHERE email = ?', [email]);
//     if (existUser[0].length > 0) {
//       return res.status(409).send('Já existe um usuário cadastrado com este email!');
//     }
//   }

//   try {
//     const passwordHash = await bcrypt.hash(password, 10);

//     const result = await database.query('INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)', [name, email, passwordHash]);
//     res.status(201).send(`Usuário cadastrado com ID: ${result[0].insertId}`);
//   } catch (e) {

//     if (e.code === 'ER_DUP_ENTRY') {
//       res.status(409).send('Usuário já cadastrado')
//       return;
//     }

//     res.status(500).send('Erro ao cadastrar usuário');
//   }
// });


module.exports = router;
