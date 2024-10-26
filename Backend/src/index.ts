import express from "express"
import {config} from "dotenv"
import WebSocket, { WebSocketServer } from "ws"
import { GameManager } from "./GameManager"

config()
const app = express()
const PORT = process.env.PORT || 3000

const httpServer = app.listen(PORT, ()=>{
    console.log("App listening on " + PORT)
})

const wss = new WebSocketServer({server: httpServer})

const gameManager = new GameManager()
wss.on('connection',(socket)=>{
    socket.on('error',e => console.log(e))
    gameManager.addUser(socket)

    socket.on('close',()=>{
        gameManager.removeUser(socket)
    })

})