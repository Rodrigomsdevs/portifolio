const router = require("express").Router();

const index = require("./servidor/controller/index.controller");
const crud_nomde_mysql = require('./servidor/controller/crud_mysql.controller');

router.get('/node/mysql/usuario', crud_nomde_mysql.getUsuarios);
router.post('/node/mysql/usuario', crud_nomde_mysql.createUser);
router.put('/node/mysql/usuario', crud_nomde_mysql.updateUsuario);
router.delete('/node/mysql/usuario', crud_nomde_mysql.deleteUser);


router.get('/', index.index);

module.exports = router;