import { Chess, Move } from "chess.js"
import WebSocket from "ws";
import { GAME_OVER, MOVE } from "./messages";

//When 2 player join, UserManager will start the Game
export class Game{
    player1 : WebSocket;
    player2: WebSocket;
    initialTime: Date;
    game: Chess;
    moveCount: number

    public constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1
        this.player2 = player2
        this.initialTime = new Date()
        this.game =  new Chess()
        this.moveCount = 0
    }

    public makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }){
        //check if players turn
        if( (this.moveCount%2===0 && socket === this.player2) || (this.moveCount%2===1 && socket === this.player1) ){
            return
        }
        
        //validate move
        try{
            this.game.move(move)      
        }
        catch(e){
            console.log(e)
        }
        
        //check if checkmate
        if(this.game.isGameOver()){
            const winner = this.moveCount%2 === 0 ? "white won" : "black won"
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: winner
            }))
        }

        //let both players know the move is made
        this.player1.send(JSON.stringify({
            type: MOVE,
            payload: move
        }))        
        this.player2.send(JSON.stringify({
            type: MOVE,
            payload: move
        }))  

        this.moveCount++
    }

}