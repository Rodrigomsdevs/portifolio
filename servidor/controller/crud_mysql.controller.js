const models = require('../models/crud_mysql.models');
const utils = require('../utils');
const md5 = require('md5');

async function getUsuarios(req, res) {

    models.getUsuarios().then((result) => {
        res.send(JSON.stringify({ error: false, retorno: result }));
    }).catch((errorR) => {
        res.send(JSON.stringify({ error: true, msg: errorR }));
    });

}


async function createUser(req, res) {

    if (req.body.email && req.body.senha && req.body.usuario) {
        let email = req.body.email;
        let senha = md5(req.body.senha);
        let usuario = req.body.usuario;

        models.createUsuario(usuario, email, senha).then((result) => {
            res.send(JSON.stringify({ error: false, retorno: result }));
        }).catch((errorR) => {
            res.send(JSON.stringify({ error: true, msg: errorR }));
        });

    } else {

        res.send(JSON.stringify({ error: true, msg: 'Sem dados!' }));

    }

}

async function updateUsuario(req, res) {

    if (req.body.email || req.body.senha || req.body.usuario) {

        let email = req.body.email ? req.body.email : "";
        let senha = req.body.senha ? md5(req.body.senha) : "";
        let usuario = req.body.usuario ? req.body.usuario : "";

        models.updateUsuario(email, usuario, senha).then((result) => {
            res.send(JSON.stringify({ error: false, retorno: result }));
        }).catch((errorR) => {
            res.send(JSON.stringify({ error: true, msg: errorR }));
        });

    } else {
        res.send(JSON.stringify({ error: true, msg: 'Sem dados!' }));
    }

}

async function deleteUser(req, res) {
    if (req.body.email || req.body.usuario) {

        let email = req.body.email;
        let usuario = req.body.usuario;

        models.deleteUsuario(email, usuario).then((result) => {
            res.send(JSON.stringify({ error: false, retorno: result }));
        }).catch((errorR) => {
            res.send(JSON.stringify({ error: true, msg: errorR }));
        });
    } else {
        res.send(JSON.stringify({ error: true, msg: 'Sem dados' }));
    }
}

module.exports = {
    getUsuarios,
    createUser,
    updateUsuario,
    deleteUser
}