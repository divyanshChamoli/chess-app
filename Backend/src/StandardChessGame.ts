import { Chess } from "chess.js";
import WebSocket from "ws";
import { GAME_OVER, GAME_OVER_METHOD, MOVE } from "./messages";

//When 2 player join, UserManager will start the Game
export class StandardChessGame {
  player1: WebSocket;
  player2: WebSocket;
  initialTime: Date;
  game: Chess;
  moveCount: number;

  public constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.initialTime = new Date();
    this.game = new Chess();
    this.moveCount = 0;
  }

  private GameOverMethod() {
    let method = "";
    if (this.game.isCheckmate()) {
      method = GAME_OVER_METHOD.CHECKMATE;
    } else if (this.game.isStalemate()) {
      method = GAME_OVER_METHOD.STALEMATE;
    } else if (this.game.isInsufficientMaterial()) {
      method = GAME_OVER_METHOD.INSUFFICIENT_MATERIAL;
    } else if (this.game.isThreefoldRepetition()) {
      method = GAME_OVER_METHOD.THREE_FOLD_REPETITION;
    }
    return method;
  }

  public makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    //check if players turn
    if (
      (this.moveCount % 2 === 0 && socket === this.player2) ||
      (this.moveCount % 2 === 1 && socket === this.player1)
    ) {
      return;
    }

    //validate move
    try {
      //promote to a queen always
      this.game.move({ ...move, promotion: "q" });
    } catch (e) {
      return;
    }

    //check if checkmate
    if (this.game.isGameOver()) {
      const winner = this.moveCount % 2 === 0 ? "white" : "black";
      const method = this.GameOverMethod();
      const draw = this.game.isDraw();

      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            draw: draw,
            winner: winner,
            method: method,
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            draw: draw,
            winner: winner,
            method: method,
          },
        })
      );
    }

    //let both players know the move is made
    this.player1.send(
      JSON.stringify({
        type: MOVE,
        payload: this.game.fen(),
      })
    );
    this.player2.send(
      JSON.stringify({
        type: MOVE,
        payload: this.game.fen(),
      })
    );

    this.moveCount++;
  }
}
