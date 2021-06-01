const router = require("express").Router();

const index = require("./controller/index.controller");
const crud = require("./controller/crud_mysql.controller");


router.post('/api/user', crud.createUser);
router.put('/api/user', crud.updateUsuario);
router.get('/api/user', crud.createUser);
router.delete('/api/user', crud.deleteUser);

router.get('/', index.index);

module.exports = router;