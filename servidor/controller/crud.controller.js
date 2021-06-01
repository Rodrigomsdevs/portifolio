const models = require('../models/crud.models');
const utils = require('../utils');
const md5 = require('md5');

async function createUser(req, res) {

    if (req.body.email && req.body.senha && req.body.usuario) {
        let email = req.body.email;
        let senha = md5(req.body.senha);
        let usuario = req.body.usuario;
        let sql = "INSERT INTO `usuarios` (`id`, `usuario`, `email`, `senha`) VALUES (?,?,?,?)";

        utils.getSql('SELECT * FROM usuarios WHERE email = ? OR usuario = ?', [email, usuario]).then((result) => {
            if (result.result && result.result[0]) {
                res.send(JSON.stringify(error => true, msg => 'Usuario ja cadastrado!'));
                return;
            } else {
                utils.getSql(sql, [, usuario, email, senha]).then((result) => {

                    res.send(JSON.stringify(error => false, msg => 'Usuario cadastrado!'));
                    return;
                }).catch((error) => {
                    res.send(JSON.stringify(error => true, msg => 'Erro mysql'));
                });
            }
        }).catch((error) => {
            res.send(JSON.stringify(error => true, msg => 'Erro mysql get'));
        });



    } else {

        res.send(JSON.stringify(error => true, msg => 'Sem dados!'));

    }

}

async function updateUsuario(req, res){

    if(req.body.email || req.body.senha || req.body.usuario){

        let sql = "";
        let sqlP = [];

        if(req.body.email){
            sql += 'UPDATE usuarios SET email = ?';
            sqlP.push(req.body.email);
        }

        if(req.body.senha){
            sql += (sql ? ', ' : 'UPDATE usuarios SET ') + 'senha = ?';
            sqlP.push(req.body.senha);
        }
        if(req.body.usuario){
            sql += (sql ? ', ' : 'UPDATE usuarios SET ')  + 'usuario = ?';
            sqlP.push(req.body.usuario);
        }

        console.log([
            sql, sqlP
        ]);

        utils.getSql(sql, sqlP).then((result) => {
            res.send(JSON.stringify(error => true, msg => 'Atualizado com sucesso'));
        }).catch((error) => {
            res.send(JSON.stringify(error => true, msg => 'Erro update'));
        });

        utils.getSql();

    }else{
        res.send(JSON.stringify(error => true, msg => 'Sem dados!'));
    }

}

async function deleteUser(req, res){
    if(req.body.email || req.body.usuario){

        let email = req.body.email;
        let usuario = req.body.usuario;

        utils.getSql('SELECT * FROM usuarios WHERE email = ? OR usuario = ?', [email, usuario]).then((result) => {
            if(result.result && result.result[0]){

                utils.getSql('DELETE FROM usuarios WHERE email = ? OR usuario = ?', [email, senha]).then((result) => {
                    res.send(JSON.stringify(error => false, msg => 'Deletado com sucesso'));
                }).catch((error) => {
                    res.send(JSON.stringify(error => true, msg => 'Erro mysql delete2'));
                });

            }else{
                res.send(JSON.stringify(error => true, msg => 'Não encontrado!'));  
            }
        }).catch((error) => {
            res.send(JSON.stringify(error => true, msg => 'Erro mysql delete'));
        });
    }else{
        res.send(JSON.stringify(error => true, msg => 'Sem dados'));  
    }
}

module.exports = {
    createUser,
    updateUsuario,
    deleteUser
}