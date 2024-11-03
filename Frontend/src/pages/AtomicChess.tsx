import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Move, parseSquare,  } from "chessops";
import { Square } from "react-chessboard/dist/chessboard/types";
import { Atomic } from "chessops/variant";
import { makeFen } from "chessops/fen";

function AtomicChess() {
  const [game] = useState(Atomic.default());
  const [gamefen, setGamefen] = useState(makeFen(game.toSetup()));  

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move: Move = {
        from: parseSquare(sourceSquare),
        to: parseSquare(targetSquare),
    };
    
    if(game.isLegal(move)){
        game.play(move)
        setGamefen(makeFen(game.toSetup()))
        return true
    }
    else{
        console.log("Invalid Move")
        return false
    }
    
  }

  return (
    <div className="h-screen w-screen bg-customGray-100 flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center md:w-3/5 w-full p-1">
        <div className="md:w-1/2 relative">
          <Chessboard
            id={"BasicBoard"}
            position={gamefen}
            onPieceDrop={onDrop}
            customDarkSquareStyle={{ backgroundColor: "#4B7399" }}
            customLightSquareStyle={{ backgroundColor: "#EAE9D2" }}
            autoPromoteToQueen={true}
          />
        </div>
      </div>
    </div>
  );
}

export default AtomicChess;
