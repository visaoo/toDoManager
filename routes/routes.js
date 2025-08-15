const { Router } = require("express"),
  router = Router(),
  userController = require("../controllers/userController"),
  authController = require('../controllers/authController');

router.get("/usuarios", userController.listUsers);
router.post("/usuarios", userController.createUser);
router.post("/login", authController.authenticateUser);

module.exports = router;
