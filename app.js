const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const Sequelize = require('sequelize')

const server = express();

//Set up 'stache
server.engine('mustache', mustache());
server.set('views', 'templates');
server.set('view engine', 'mustache');

//Set up bodyparser
server.use(bodyparser.urlencoded({ extended: true }));


///////////////// CREATE TODO SCHEMA //////////////////////
const db = new Sequelize('todoDb', 'Erica', '', {
    dialect: 'postgres',
});

const Todo = db.define('todo', {
    name: Sequelize.STRING,
    complete: Sequelize.BOOLEAN
});

//**HARD CODE 2 TODOs
// Todo.sync().then(function () {
//     console.log('model synched!')

//     Todo.create({
//         name: 'Conquer lunch',
//         complete: true,
//     });
//     console.log('one more thing to do!')
// });
///////////////////////////////////////////////////////////


//Set Up Main Page & Populate All Todos
server.get('/', function (req, res) {
    Todo.findAll({order: [['createdAt', 'DESC']]}).then(function (results) {
        
    res.render('list', {
        todos: results,
        });
    });
});

//ADD todo
server.post('/add', function (req, res) {
    Todo.create({
        name: req.body.item,
        complete: false,
    }).then(function () {
        res.redirect('/');
    });
});

//EDIT todo
server.post('/update/:id', function (req, res) {
    const id = req.params.id;

    Todo.update({
        name: req.body.editbox,
    }, {
        where: {
            id: id,
        },
    }).then(function () {
        res.redirect('/');
    });
});

//DELETE todo
server.post('/delete/:id', function (req, res) {
    const id = req.params.id;

    Todo.destroy({
        where: {
            id: id,
        },
    }).then(function () {
        res.redirect('/');
    });
});

//Mark todo COMPLETE
server.post('/complete/:id', function (req, res) {
    const id = req.params.id;

    Todo.update({
        complete: true,
    }, {
        where: {
            id: id,
        },
    }).then(function () {
        res.redirect('/');
    });
});

//HARD MODE: DELETE ALL todos
server.post('/delete', function (req, res) {
    Todo.destroy({ where: { complete: true,}})
        .then(function () {
            res.redirect('/');
        });
    });


//Server
server.listen(3000, function () {
    console.log("Let's do this!")
})