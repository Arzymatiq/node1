const http = require("http")
const port = 3000

const userArr = [
    {id:1, name:"Alikhan"},
    {id:2, name:"Nurislam"}
]
const server = http.createServer((req,res) => {
    const {method, url} = req
    res.setHeader('Content-Type', 'application/json');
    //GET ALL USER
    if(method === "GET" && url ==="/users"){
        res.writeHead(200)
        res.end(JSON.stringify(userArr))
    }

    //GET ONE USER
    else if (url.startsWith("/users/") && method =="GET"){
        const id = parseInt(url.split("/")[2])
        const findUser = userArr.find((user) => user.id === id) 

        if(!findUser){
            res.writeHead(404)
            return res.end(JSON.stringify({message:"ERROR"}))
        }

        res.writeHead(200)
        res.end(JSON.stringify(findUser))
    }
    // CREATE NEW UESR
    else if(method === "POST" && url ==="/users/"){
        let body = ''
        req.on("data", chunck=> {
            body += chunck.toString()
        })
        req.on("end", ()=> {
            const newUser = JSON.parse(body)
            newUser.id = userArr.length? userArr[userArr.length-1].id+1:1
            userArr.push(newUser)
            res.writeHead(201)
            res.end(JSON.stringify(newUser))
        })
    }
    else if(method == "PUT" && url.startsWith("/users/")){
        const id = parseInt(url.split("/")[2])
        const index = userArr.findIndex((user) => user.id === id) 
        if(index <= -1){
            res.writeHead(404)
            return res.end(JSON.stringify({message:"ERROR"}))
        }
        let body = ''
        req.on("data", chunck=> {
            body += chunck.toString()
        })
        req.on("end", ()=> {
            const updatedUser = JSON.parse(body)
            userArr[index] = {...userArr[index], ...updatedUser}
            res.writeHead(201)
            res.end(JSON.stringify(updatedUser))
        })
    }
})
server.listen(port, () =>{
    console.log(`sever work on http://localhost:${port} `)
})