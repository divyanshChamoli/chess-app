import WebSocket from "ws";
import { ADDITIONAL, BOMBED_SQUARES, INIT_GAME, MOVE, ATOMIC, STANDARD} from "./messages";
import AtomicChessGame from "./AtomicChessGame";
import { StandardChessGame } from "./StandardChessGame";

export class GameManager {
  // pendingUsers: {variant: WebSocket}[]
  pendingUsers: Record<string, WebSocket>[]
  games: (AtomicChessGame | StandardChessGame)[];
  users: WebSocket[];

  constructor() {
    this.pendingUsers = []; 
    this.games = [];
    this.users = [];
  }

  addUser(user: WebSocket) {
    this.users.push(user);
    this.handleMessage(user);
  }

  removeUser(user: WebSocket) {
    this.users = this.users.filter((u) => u !== user);
    //remove user from the game
  }

  startGame(player1: WebSocket, player2: WebSocket, variant: string) {
    if(variant === ATOMIC){
      const game = new AtomicChessGame(player1, player2);
      this.games.push(game);
    }
    if(variant === STANDARD){
      const game = new StandardChessGame(player1, player2) 
      this.games.push(game);
    }
    
    player1.send(JSON.stringify({
        type: INIT_GAME,
        payload: "white"
    }))
    player2.send(JSON.stringify({
        type: INIT_GAME,
        payload: "black"
    }))
  }

  handleMessage(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      switch (message.type) {
        case INIT_GAME:
          const variant = message.variant as string
          const pendingUser = this.pendingUsers.find(user => user.hasOwnProperty(variant))
          const pendingUserIndex = this.pendingUsers.findIndex(user => user.hasOwnProperty(variant))
          if(pendingUser){
            this.startGame(pendingUser[variant], socket, variant)
            this.pendingUsers.splice(pendingUserIndex,1)
          }
          else{
            this.pendingUsers.push({[variant] : socket})
          }
          break
        case MOVE:
          //find the game and send that move
          let game = this.games.find(
            (game) => game.player1 === socket || game.player2 === socket
          );
          game && game.makeMove(socket, message.move)
          break
        case ADDITIONAL: 
          //find the game and send those styles to other player
          let mygame = this.games.find(
            (game) => game.player1 === socket || game.player2 === socket
          );      
          mygame?.player1.send(
            JSON.stringify({
              type: ADDITIONAL,
              payload: {
                reciever: BOMBED_SQUARES,
                bombedSquares: message.payload.bombedSquares
              },
            })
          );      
          mygame?.player2.send(
            JSON.stringify({
              type: ADDITIONAL,
              payload: {
                reciever: BOMBED_SQUARES,
                bombedSquares: message.payload.bombedSquares
              },
            })
          );      
          break;
        }
      });
  }
}
