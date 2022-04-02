var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static.js')

// Chavetas permitem importar parcialmente os modulos
var {parse} = require('querystring')


var galunoServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido

    if (static.recursoEstatico(req)) {
        static.sirvoRecursoEstatico(req, res)
    } else {
        switch(req.method){
            case "GET": 
                // GET /alunos --------------------------------------------------------------------
                if((req.url == "/") || (req.url == "/alunos")){
                    axios.get("http://localhost:3000/alunos")
                        .then(response => {
                            var alunos = response.data

                            // Add code to render page with the student's list
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagAlunos(alunos, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de alunos...")
                            res.end()
                        })
                }
                // GET /alunos/:id --------------------------------------------------------------------
                else if(/\/alunos\/(A|PG)[0-9]+$/.test(req.url)){
                    var idAluno = req.url.split("/")[2]
                    axios.get("http://localhost:3000/alunos/?Id=" + idAluno)
                        .then( response => {
                            let a = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagAluno(a, d))
                            res.end()
                            
                            // Add code to render page with the student record
                        })
                }
                // GET /alunos/registo --------------------------------------------------------------------
                else if(req.url == "/alunos/registo"){
                    // Add code to render page with the student form
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(geraFormAluno(d))
                    res.end()
                }
                // GET /w3.css ------------------------------------------------------------------------
                else if(req.url == "/public/w3.css"){
                    fs.readFile("w3.css", function(erro, dados){
                        if(!erro){
                            res.writeHead(200, {'Content-Type': 'text/css;charset=utf-8'})
                            res.write(dados)
                            res.end()
                        }
                    })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                break
            case "POST":
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                // Replace this code with a POST request to the API server
                res.write('<p>Recebi um POST dum aluno</p>')
                res.write('<p><a href="/">Voltar</a></p>')
                res.end()
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }
    }
})

galunoServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')