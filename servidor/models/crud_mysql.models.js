const mysql = require('mysql');

async function getUsuarios(where = "", sqlp = []) {

    return new Promise((resolve, reject) => {
        utils.getSql('SELECT * FROM usuarios' + where, sqlp).then((result) => {
            resolve(result.result);
        }).catch((error) => {
            reject('Erro -> crud_mysql -> getUsuarios');
        });
    });

}

async function createUsuario(usuario, email, senha) {
    return new Promise((resolve, reject) => {

        getUsuarios(` WHERE email = ? or usuario = ?`, [email, usuario]).then((result) => {
            if (result.length > 0) {
                reject('Usuario já cadastrado');
                return;
            }
            getSql('INSERT INTO `usuarios` (`id`, `usuario`, `email`, `senha`) VALUES (?,?,?,?)', [, usuario, email, senha]).then((result) => {
                resolve('Usuario cadastrado!');
                return;
            }).catch((error) => {
                reject('Erro -> crud_mysql -> createUsuario -> insert');
            });

        }).catch((error) => {
            reject('Erro -> crud_mysql -> createUsuario -> getUsuarios');
        });

    });
}

async function updateUsuario(email, usuario, senha) {

    return new Promise((resolve, reject) => {

        let sql = "UPDATE usuarios SET ";
        let campos = "";
        let camposValue = [];

        if (email) {
            campos += "email = ?,";
            camposValue.push(email);
        }

        if (usuario) {
            campos += "usuario = ?";
            camposValue.push(usuario);
        }

        if (senha) {
            campos += "senha = ?";
            camposValue.push(senha);
        }

        if (campos[campos.length - 1] == ',') {
            campos = campos.substr(0, campos.length - 1);
        }

        getSql(sql + campos, camposValue).then((result) => {
            resolve('Atualizado com sucesso!');
        }).catch((error) => {
            reject('Erro -> crud_mysql -> updateUsuario');
        });

    });

}

async function deleteUsuario(email, usuario){

    return new Promise((resolve, reject) => {

        let where = "";
        let whereArray = [];

        if(email){
            where += "email = ?";
            whereArray.push(email);
        }

        if(usuario){
            where += (email ? ", " : "") + "usuario = ?";
            whereArray.push(usuario);
        }

        getSql('DELETE FROM usuarios WHERE ' + where, whereArray).then((result) => {
            resolve('Deletado com sucesso!')
        }).catch((error) => {
            reject('Erro -> crud_mysql -> deleteUsuario');
        });

    });

}


async function getSql(query, queryVar = []) {
    return new Promise((resolve, reject) => {

        var con = mysql.createConnection({
            host: "localhost",
            user: "rodrigo",
            password: "rodrigo",
            database: "rodrigo"
        });

        con.query('CREATE TABLE IF NOT EXISTS `usuarios` (`id` int(11) NOT NULL AUTO_INCREMENT,`usuario` text NOT NULL, `email` text NOT NULL,`senha` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8');

        var teste = con.query(query, queryVar, function (err, result) {
            if (err) {
                console.log(teste.sql);
                return reject(err);
            }
            console.log("MYSQL: " + teste.sql);
            con.end();
            resolve({ 'inserted': result.insertId, 'result': result });
        });
    });
}

module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    deleteUsuario
}