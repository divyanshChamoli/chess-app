import { useState } from "react";
import {Chess, Square} from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Landing() {
  const [game, setGame] = useState(new Chess());

  function makeAMove(move: string | {
    from: string;
    to: string;
    promotion?: string;
    }) {
    const gameCopy = { ...game } as Chess;
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    game.move
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    setTimeout(makeRandomMove, 200);
    return true;
  }

  return <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
}