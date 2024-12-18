import WebSocket from "ws";
import { CAPTURE, GAME_OVER, GAME_OVER_METHOD, MOVE } from "./messages";
import { Atomic } from "chessops/variant";
import { makeFen } from "chessops/fen";

//When 2 player join, UserManager will start the Game
export default class AtomicChessGame {
  player1: WebSocket;
  player2: WebSocket;
  game: Atomic;
  moveCount: number;

  public constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.game = Atomic.default();
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
    } else if (this.game.isVariantEnd()) {
      method = GAME_OVER_METHOD.DETONATION;
    }
    return method;
  }

  public makeMove(
    socket: WebSocket,
    move: {
      from: number;
      to: number;
    }
  ) {
    //check if players turn
    if (
      (this.moveCount % 2 === 0 && socket === this.player2) ||
      (this.moveCount % 2 === 1 && socket === this.player1)
    ) {
      return;
    }

    let moveType;
    
    //check if capture
    if (this.game.board.occupied.has(move.to)) {
      moveType = CAPTURE
    }
    
    //validate move
    try {
      //promote to a queen always
      if (this.game.isLegal(move)) {
        this.game.play(move);
      } else {
        return;
      }
    } catch (e) {
      console.log(e);
      return;
    }

    //check if checkmate
    if (this.game.isVariantEnd() || this.game.isEnd() ) {
      const winner = this.moveCount % 2 === 0 ? "white" : "black";
      const method = this.GameOverMethod();
      let draw = false;
      if (
        method === GAME_OVER_METHOD.STALEMATE ||
        method === GAME_OVER_METHOD.INSUFFICIENT_MATERIAL ||
        method === GAME_OVER_METHOD.THREE_FOLD_REPETITION
      ) {
        draw = true;
      }

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
        payload: {
          fen: makeFen(this.game.toSetup()),
          move: move,
          "moveType": moveType
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: MOVE,
        payload: {
          fen: makeFen(this.game.toSetup()),
          move: move,
          "moveType": moveType
        },
      })
    );

    this.moveCount++;
  }
}
