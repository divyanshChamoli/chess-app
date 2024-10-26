import WebSocket from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./messages";

export class GameManager {
  pendingUser: WebSocket | null;
  games: Game[];
  users: WebSocket[];

  constructor() {
    this.pendingUser = null;
    this.games = [];
    this.users = [];
  }

  addUser(user: WebSocket) {
    this.users.push(user);
    this.handleMessage(user);
  }

  removeUser(user: WebSocket) {
    this.users = this.users.filter((u) => u !== user);
  }

  startGame(player1: WebSocket, player2: WebSocket) {
    const game = new Game(player1, player2);
    this.games.push(game);
    
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
          if (this.pendingUser === null) {
            this.pendingUser = socket;
          } else {
            this.startGame(this.pendingUser, socket);
            this.pendingUser = null
          }
        case MOVE:
          //find the game and send that move
          const game = this.games.find(
            (game) => game.player1 === socket || game.player2 === socket
          );
          game && game.makeMove(socket, message.move)
      }
    });
  }
}