const router = require("express").Router();

const index = require("./controller/index.controller");
const crud_nomde_mysql = require('./controller/crud_mysql.controller');

router.get('/node/mysql/usuario', crud_nomde_mysql.getUsuarios);
router.post('/node/mysql/usuario', crud_nomde_mysql.createUser);
router.put('/node/mysql/usuario', crud_nomde_mysql.updateUsuario);
router.delete('/node/mysql/usuario', crud_nomde_mysql.deleteUser);

router.get('/', index.index);
router.get('/crud/node/mysql', index.crud_node_mysql);
router.get('/download', index.download)

module.exports = router;