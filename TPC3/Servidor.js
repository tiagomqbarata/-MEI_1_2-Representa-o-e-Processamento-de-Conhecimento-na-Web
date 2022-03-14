var http = require('http')
var url = require('url')
const axios = require('axios')

function generateTableHead(listHead){
    body = "<body><table><tr>"
    listHead.forEach(element => {
        body+= "<th>" + element + "</th>"
    });
    body += "</tr>"

    return body
}



function generateTable(jsonData, campos){
    html = ""
    jsonData.forEach(elemento =>{
        html+="<tr>"
        campos.forEach(campo =>{
            html += "<td>"+ elemento[campo] +"</td>"
        })
        html+="</tr>"
    })

    return html
}


async function getRequest(pagin){
    return await axios.get("http://localhost:3000" + pagin)
        .then(function(resp){
            jsonData = resp.data
            html = generateTableHead(Object.keys(jsonData[0]))
            html += generateTable(jsonData, Object.keys(jsonData[0]))
            html += "</table></body>"

            return html          
        })
        .catch(function(error){
            console.log(error)
        })
}

function generateMainPage(){
    return `<body>
    <ul>
        <li>Lista de Alunos <a href=\"http://localhost:4000/alunos\"> Lista de alunos </a></li>
        <li>Lista de Cursos <a href=\"http://localhost:4000/cursos\"> Lista de alunos </a></li>
        <li>Lista de Instrumentos <a href=\"http://localhost:4000/instrumentos\"> Lista de alunos </a></li>
    </ul>
</body>`
}

http.createServer(async (req, res) => {
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)
    var myUrl = url.parse(req.url, true).pathname
    if(myUrl == '/'){
        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
        content = generateMainPage()
        res.write(content)
        res.end()
    }else if(myUrl == "/alunos" || myUrl == "/cursos" || myUrl == "/instrumentos"){
        res.writeHead(200, { 'Content-Type' : 'text/html;charset=utf-8' })
        content = await getRequest(myUrl)
        res.write(content)
        res.end()
    }else{
        res.writeHead(404, {'Content-Type':'text/html;charset=utf-8'})
        res.end()
    }
    
    
}).listen(4000);