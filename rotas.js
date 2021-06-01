const router = require("express").Router();

const index = require("./controller/index.controller");

router.get('/', index.index);

module.exports = router;