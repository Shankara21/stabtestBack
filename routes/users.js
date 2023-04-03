var express = require("express");
const UserController = require("../controller/UserController");
var router = express.Router();

/* GET users listing. */
router.get("/", UserController.index);

router.post("/login", UserController.login);
router.post("/register", UserController.register);

module.exports = router;
