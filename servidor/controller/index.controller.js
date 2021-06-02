const utils = require('../utils');


async function index(req, res) {

    let projetos = [];
    await utils.getSql('SELECT * FROM projetos').then((result) => {
        if (result.result && result.result[0]) {
            result.result.forEach((item) => {
                projetos.push({
                    nome: item.nome,
                    linkDownload: item.linkDownload,
                    linguagem: item.linguagem,
                    img: item.img,
                    url_api: item.url_api,
                    id: item.id,
                    href: item.href
                });
            })
        }
    });

    res.render(process.cwd() + "/cliente/pages/index.ejs", retornaDescricaoSite(projetos));

}

async function crud_node_mysql(rq, res){
    res.render(process.cwd() + "/cliente/pages/crud_node_mysql.ejs", retornaDescricaoSite());
}

async function download(req, res) {
    if (!req.body.id) {
        res.send('ID não informado');
        return;
    }
    utils.getSql('SELECT * FROM projetos WHERE id = ?', [req.body.id]).then((result) => {
        if (result.result && result.result[0]) {
            
            let nome = result.result[0].nome;

            res.setHeader('Content-disposition', 'attachment; filename=' + nome);
            res.download(process.cwd() + "/servidor/download/" + nome);
        } else {
            res.send('Nada encontrado!');
        }
    }).catch((error) => {
        res.send('Erro mysql');
    });

}

function retornaDescricaoSite(projetos = []){
    return {
        title: 'Portfólio - index',
        author: 'Rodrigo silva',
        descricao: 'Rodrigo silva, sistema crud em varias linguagens',
        keywords: 'rodrigo silva, crud',
        nome: 'Rodrigo Macedo',
        cargo: 'Desenvolvedor WEB',
        descricaoParagrafo: `Neste pequeno site, esta projetos bem simples mas sempre utilizados em projetos grandes e complexos<br />
        Sistema CRUD (create, read, update e delete), em varias linguagens.`,
        sobreMim: `Meu nome é Rodrigo, tenho ${calcularIdade('27/02/2001')} anos e nasci em Maringá-PR, atualmente minha linguagem preferida é <b>NodeJS</b>
        porém tenho conhecimento em JavaScript e PHP ambos OO.`,
        clientes_felizes: 4,
        projetos_completos: projetos.length,
        projetos_baixados: 0,
        imgOG: 'https://i.ibb.co/yWNxHJR/instagram-profile-image.png',
        dadosFor: projetos
    };
}

function calcularIdade(aniversario) {
    var nascimento = aniversario.split("/");
    var dataNascimento = new Date(parseInt(nascimento[2], 10), parseInt(nascimento[1], 10) - 1, parseInt(nascimento[0], 10));
    var diferenca = Date.now() - dataNascimento.getTime();
    var idade = new Date(diferenca); // miliseconds from epoch
    return Math.abs(idade.getUTCFullYear() - 1970);
}

module.exports = {
    index,
    download,
    crud_node_mysql
}