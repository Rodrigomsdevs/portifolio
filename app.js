const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 80;

const rotas = require('./servidor/rotas');

app.use('/', express.static(path.join(__dirname, '/', 'cliente', '/', 'assets')));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(session({ secret: 'rFinanca', resave: true, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));

app.use('/', rotas);


app.get('*', function (req, res) {
    res.send('404');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});