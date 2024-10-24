import { Chess, Move, Square } from "chess.js";
import { useState } from "react";
import { Chessboard } from "react-chessboard";

function PlayChess() {
  const [game] = useState<Chess>(new Chess());
  const [fen, setFen] = useState<string>('start');

  // const makeAMove = (move: {
  //   from: string;
  //   to: string;
  //   promotion?: string;
  // }) => {
    
  //   const currGame = game;
  //   const result = currGame.move(move);
  //   // setGame(currGame);  
  //   return result;
  // };

  // const onDrop = (sourceSquare: Square, targetSquare: Square) => {
  //   const move = makeAMove({
  //     from: sourceSquare,
  //     to: targetSquare,
  //   });
  //   if (move === null) {
  //     return false;
  //   }
  //   setFen(game.fen())
  //   return true;
  // };

  const onDrop=(sourceSquare: Square, targetSquare: Square)=>{
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    })
    if(move === null){
      return false
    }
    setFen(game.fen())
    return true
  }

  return (
    <div className="h-96 w-96">
      <Chessboard
        id={"BasicBoard"}
        position={fen}
        onPieceDrop={onDrop}
        customDarkSquareStyle={{ backgroundColor: "#B00000" }}
      />
    </div>
  );
}

export default PlayChess;
