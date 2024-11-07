import { WebSocketServer } from "ws"
import { GameManager } from "./GameManager"
import { job } from "./cron";

job.start();
const PORT = 3000 
const wss = new WebSocketServer({port: PORT})

const gameManager = new GameManager()
wss.on('connection',(socket)=>{
    socket.on('error',e => console.log(e))
    gameManager.addUser(socket)

    socket.on('close',()=>{
        gameManager.removeUser(socket)
    })

})