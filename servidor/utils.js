const mysql = require('mysql');
const request = require('request');

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

function dataAtualFormatada(diasAdd) {
    var data = new Date();

    var dia = data.getDate() + (diasAdd ? diasAdd : 0);

    dia = dia.toString();

    var diaF = (dia.length == 1) ? '0' + dia : dia;
    var mes = (data.getMonth() + 1).toString();
    var mesF = (mes.length == 1) ? '0' + mes : mes;
    var anoF = data.getFullYear();

    //return diaF + "/" + mesF + "/" + anoF;
    return mesF + "/" + diaF + "/" + anoF;
}

function diaSemana() {

    let dia = new Date().getDay();
    let semana = new Array(6);
    semana[0] = 'Domingo';
    semana[1] = 'Segunda-Feira';
    semana[2] = 'Terça-Feira';
    semana[3] = 'Quarta-Feira';
    semana[4] = 'Quinta-Feira';
    semana[5] = 'Sexta-Feira';
    semana[6] = 'Sábado';

    return semana[dia];

}

function horaAtual() {
    function pad(s) {
        return (s < 10) ? '0' + s : s;
    }
    var date = new Date();
    return [date.getHours(), date.getMinutes(), date.getSeconds()].map(pad).join(':');
}

function getDataHora(hora) {

    let horas = hora ? hora : horaAtual();

    console.log(dataAtualFormatada());

    return dataAtualFormatada() + " " + horas;
}

async function retornaDadosEndereco(endereco) {

    let pegaCidade = await requestPromisse(`https://maps.googleapis.com/maps/api/geocode/json?address=${endereco}&key=AIzaSyATJZip86dzRYCvxFeKNYG2DkmRI9Fuzso`);
    let resultadoCidadeJson = JSON.parse(pegaCidade);
    if (!resultadoCidadeJson.results || !resultadoCidadeJson.results[0] || !resultadoCidadeJson.results[0].address_components) {
        return { error: true };
    }

    let formatted_address = resultadoCidadeJson.results[0].formatted_address;
    resultadoCidadeJson = resultadoCidadeJson.results[0].address_components;

    let rua = retornaValor(resultadoCidadeJson, 'route');
    let numero_casa = retornaValor(resultadoCidadeJson, 'street_number');
    let bairro = retornaValor(resultadoCidadeJson, 'political');
    let cidade = retornaValor(resultadoCidadeJson, 'administrative_area_level_2');
    let estado = retornaValor(resultadoCidadeJson, 'administrative_area_level_1');
    let pais = retornaValor(resultadoCidadeJson, 'country');
    let cep = retornaValor(resultadoCidadeJson, 'postal_code');


    return {
        'rua': rua,
        'numero': numero_casa,
        'bairro': bairro,
        'cidade': cidade,
        'estado': estado,
        'pais': pais,
        'cep': cep,
        'endereco_completo': formatted_address
    }

}

function retornaValor(resultadoCidadeJson, compare) {

    return resultadoCidadeJson.filter(p => p.types[0] == compare)[0].long_name ? resultadoCidadeJson.filter(p => p.types[0] == compare)[0].long_name : '';

}

async function calculaDistancia(req, origins, destinations) {


    let mode = "CAR";
    let language = "PT";
    let sensor = "false";
    let key = "AIzaSyATJZip86dzRYCvxFeKNYG2DkmRI9Fuzso";
    origins = removeAcento(origins);
    destinations = removeAcento(destinations);


    let pegaCidade = await requestPromisse(`https://maps.googleapis.com/maps/api/geocode/json?address=${destinations}&key=${key}`);
    let resultadoCidadeJson = JSON.parse(pegaCidade);

    if (!resultadoCidadeJson.results || !resultadoCidadeJson.results[0]) {
        return { error: true, local: 3 };
    }

    resultadoCidadeJson = resultadoCidadeJson.results[0].address_components.filter(p => p.types[0] == "administrative_area_level_2");
    let cidadeEntrega = resultadoCidadeJson[0].long_name;
    let cidadeRestaurante = req.session.restaurante.cidade;
    let entregaCidadesVizinhas = req.session.restaurante.entregaCidadeVizinha == 'S';


    if ((!(cidadeEntrega.toLowerCase() == cidadeRestaurante.toLowerCase())) && !entregaCidadesVizinhas) {
        return { error: true, local: 2 };
    }

    let link = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}|&destinations=${destinations}|&mode=${mode}|&language=${language}|&sensor=false&key=${key}`;
    let result = await requestPromisse(link);

    result = JSON.parse(result);


    if (result.rows[0]) {

        let distanciaMetros = parseInt(result.rows[0].elements[0].distance.value);
        let distanciaKms = parseFloat(distanciaMetros / 1000);


        console.log({ error: false, distancia: distanciaKms });

        return { error: false, distancia: distanciaKms };

    }

    return { error: true, local: 1 };

}

async function geraIdPedido() {
    return new Promise((resolve, reject) => {
        getSql('SELECT COUNT(*)+1 FROM `pedido`').then(result => {
            resolve(result.result[0]['COUNT(*)+1']);
        });
    });
}
async function geraIdPedidoItens() {
    return new Promise((resolve, reject) => {
        getSql('SELECT COUNT(*)+1 FROM `pedido_item`').then(result => {
            resolve(result.result[0]['COUNT(*)+1']);
        });
    });
}

async function requestPromisse(link) {
    return new Promise((resolve, reject) => {
        request(link, (error, response, body) => {
            if (body) {
                resolve(body);
            }
        });
    });
}

function removeAcento(text) {
    text = text.toLowerCase();
    text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
    return text;
}

function retornaSubStatusPedido(statusCode) {
    /*
 
    Campo status da tabela pedidos

    1 = O seu pedido já foi enviado ao restaurante, aguarde ser confirmado
    2 = O restaurante ja confirmou seu pedido, aguarde sair para entrega
    3 = AEEE, seu pedido saiu para entrega :)
    4 = Seu pedidi foi entregue
    5 = Seu pedido foi cancelado
    
    */

    let status = [];

    status[1] = 'O seu pedido já foi enviado ao restaurante, aguarde ser confirmado';
    status[2] = 'O restaurante ja confirmou seu pedido, aguarde sair para entrega';
    status[3] = 'AEEE, seu pedido saiu para entrega :)';
    status[4] = 'Seu pedido foi entregue';
    status[5] = 'Seu pedido foi cancelado';

    if (status[statusCode]) {
        return status[statusCode];
    }

    return "Status indefinido";

}

function retornaStatusPedido(statusCode) {
    /*
 
    Campo status da tabela pedidos

    1 = pedido enviado
    2 = pedido confirmado/preparando pedido
    3 = saiu para entrega
    4 = pedido entregue
    5 = pedido cancelado
    
    */

    let status = [];

    status[1] = 'Pedido enviado';
    status[2] = 'Pedido confirmado';
    status[3] = 'Pedido saiu para entrega';
    status[4] = 'Pedido entregue';
    status[5] = 'Pedido cancelado';

    if (status[statusCode]) {
        return status[statusCode];
    }

    return "Status indefinido";

}

function retornaDataEHoraSQL() {


    let horas = horaAtual();

    let dataS = dataAtualFormatada().split('/');

    return dataS[2] + '-' + dataS[1] + '-' + dataS[0] + " " + horas;
}

function retornaDataSQL(data) {

    let dataS = data.split('/');

    return dataS[2] + '-' + dataS[1] + '-' + dataS[0];
}

module.exports = {
    getSql,
    diaSemana,
    getDataHora,
    horaAtual,
    calculaDistancia,
    removeAcento,
    geraIdPedido,
    retornaStatusPedido,
    retornaSubStatusPedido,
    retornaDadosEndereco,
    dataAtualFormatada,
    retornaDataSQL,
    retornaDataEHoraSQL
}