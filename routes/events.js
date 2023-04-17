var express = require("express");
const eventController = require("../controller/eventController");
var router = express.Router();

router.get("/", eventController.index);
router.get("/:id", eventController.show);

module.exports = router;
