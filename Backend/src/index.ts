// import express from "express"
import {config} from "dotenv"
import { WebSocketServer } from "ws"
import { GameManager } from "./GameManager"
// import {createServer} from "http"

config()
// const app = express()
const PORT = 3000 

// const httpServer = app.listen(PORT, ()=>{
//     console.log("App listening on " + PORT)
// })

// const httpServer = createServer({});

const wss = new WebSocketServer({port: PORT})

const gameManager = new GameManager()
wss.on('connection',(socket)=>{
    socket.on('error',e => console.log(e))
    gameManager.addUser(socket)

    socket.on('close',()=>{
        gameManager.removeUser(socket)
    })

})