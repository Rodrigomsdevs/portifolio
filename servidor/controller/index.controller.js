async function index(req, res) {

    res.render(process.cwd() + "/cliente/pages/index.ejs", {
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
        projetos_completos: 0,
        projetos_baixados: 0,
        imgOG: 'https://i.ibb.co/yWNxHJR/instagram-profile-image.png'
    });

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
}