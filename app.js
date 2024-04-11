const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const hand = require("handlebars")
const bodyParser = require("body-parser")
const post = require("./models/post")


hand.registerHelper("eq", function(a,b){
    return a === b;
})


app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get("/", function(req, res){
    res.render("cadastro")
})

app.get("/consulta", function(req, res){
    post.findAll().then(function(post){
        res.render("consulta", {post})
    }).catch(function(erro){
        console.log("Erro ao carregar dados do banco: " + erro)
    })
})

app.get("/editar/:id", function(req, res){
    post.findAll({where: {'id': req.params.id}}).then(function(post){
       
        res.render("editar", {post});
    }).catch(function(erro){
        console.log("Erro ao carregar dados do banco: " + erro)
    })
})

app.get("/excluir/:id", function(req, res){
    post.destroy({where: {'id': req.params.id}}).then(function(){
        res.render("consulta")
    }).catch(function(erro){
        console.log("Erro ao excluir ou encontrar os dados do banco: " + erro)
    })
})

app.post("/cadastrar", function(req, res){
    post.create({
        nome: req.body.nome,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        bairro: req.body.bairro,
        cep: req.body.cep,
        estado: req.body.estado
    }).then(function(){
        res.redirect("/")
    }).catch(function(erro){
        res.send("Falha ao cadastrar os dados: " + erro)
    })
})

app.post("/atualizar", function(req, res){
    post.update({
        nome: req.body.nome,
        cidade: req.body.cidade,
        cep: req.body.cep,
        bairro: req.body.bairro,
        endereco: req.body.endereco
    },{
        where: {
            id: req.body.id
        }
    }).then(function(){
        res.redirect("/consulta")
    })
})

app.listen(8081, function(){
    console.log("Servidor ativo!")
})