const fs = require('fs');
let rawdata = fs.readFileSync('./cinemaATP.json');
let cinemas = JSON.parse(rawdata);

var dir = "./filmes"

try{
    fs.mkdirSync(dir)
    console.log("Diretoria criada com sucesso")
}catch(err){
    console.log("Erro a criar a diretoria - " + err)
}

cinemas.sort(function (a, b) {
    return a.title.localeCompare(b.title);
});


var html = "<!doctype html>\n<html lang=\"en\">\n<head>\n\t<meta charset=\"utf-8\"></meta>\n"
html = html + "\t<title>TPC2 - Filmes</title>\n</head>\n"
html = html + "<body>\n\t<ul>\n"

cinemas.forEach((filme,index) => {
    html = html + "\t\t<li><a href=\"" + dir + "/f" + index + ".html\">"+ filme.title + "</a></li>\n"
    
    escreveFilme(index,filme) 

});

html = html + "\t</ul>\n</body>\n</html>"

fs.writeFileSync("index.html", html)

function escreveFilme(i, filme){
    var sfilmehtml = "<!doctype html>\n<html lang=\"en\">\n<head>\n\t<meta charset=\"utf-8\"></meta>\n\t<title>"
    var efilmehtml = "\n</body>\n</html>"

    sfilmehtml += filme.title + "</title>\n</head>\n<body>\n\t<h1><b>Filme: </b>" + 
                                 filme.title+"</h1>\n\t<h2><b>Ano: </b>"+ 
                                 filme.year + "</h2>\n\t<ul>\n\t\t<b>Cast: </b>\n"

    filme.cast.forEach(x => {
        sfilmehtml += "\t\t<li>" + x + "</li>\n"
    })

    sfilmehtml += "\t</ul>\n\t<ul>\n\t\t<b>Genres: </b>\n"

    filme.genres.map(x => {
        sfilmehtml += "\t\t<li>" + x + "</li>\n"
    })
    
    sfilmehtml += "\t</ul>" + efilmehtml


    fs.writeFileSync(dir + '/f' + i + ".html", sfilmehtml)
                    
}

var http = require('http')
var url = require('url')

http.createServer(function(req, res) {
    console.log("Servidor running...")

    var myUrl = url.parse(req.url, true).pathname
    
    if(myUrl == '/filmes'){
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        var index = fs.readFileSync("./index.html")
        res.write(index)
    
        console.log(req.method + " " + req.url + " " + d)

    }else{
        var d = new Date().toISOString().substring(0,16)
        console.log(req.method + " " + req.url + " " + d)

        var page = fs.readFileSync("./" + req.url)

        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(page)
    }
    

}).listen(54545);