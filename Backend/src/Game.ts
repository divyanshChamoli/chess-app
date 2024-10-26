import { Chess, Move } from "chess.js"
import WebSocket from "ws";

//When 2 player join, UserManager will start the Game
export class Game{
    player1 : WebSocket;
    player2: WebSocket;
    moves: null | Move[];
    initialTime: Date;
    game: Chess

    public constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1
        this.player2 = player2
        this.moves = null 
        this.initialTime = new Date()
        this.game =  new Chess()
    }

    public makeMove(socket: WebSocket, move: string){
        
    }

}