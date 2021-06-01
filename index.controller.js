async function index(req, res){

    res.render(process.cwd() + "/cliente/pages/index.ejs", {
        title: 'Portifolio',
        author: 'Rodrigo silva',
        descricao: 'DEscriçlao',
        keywords: 'AAAAAAA'
    });

}

module.exports = {
    index,
}