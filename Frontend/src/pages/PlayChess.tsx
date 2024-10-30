import { Chess, Square } from "chess.js";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { useSocket } from "../hooks/useSocket";
import { GAME_OVER, GAME_OVER_METHOD, INIT_GAME, MOVE } from "../utils/messages";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameOverPopup from "../components/GameOverPopup";

interface Result{
  outcome: string,
  method: string
}

function PlayChess() {
  const socket = useSocket();
  // const [game] = useState<Chess>(new Chess());
  const [color, setColor] = useState<"white" | "black">("white");
  const [fen, setFen] = useState<string>("start");
  const [result, setResult] = useState<Result | null>(null)

  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case INIT_GAME:
          setColor(data.payload);
          break;
        case MOVE:
          setFen(data.payload);
          break;  
        case GAME_OVER:
          let outcome=""
          if(data.payload.draw === true){
            outcome = "Draw"
          }
          else if(data.payload.winner === color){
            outcome = "You Won"
          }
          else{
            outcome = "You Lost"
          }
          setResult({
            outcome: outcome,
            method: data.payload.method
          })
          console.log(data.payload)
          break;
      }
    };
  }, [socket,color]);

  if (!socket) {
    return <div>Connecting...</div>;
  }

  const onDrop = (sourceSquare: Square, targetSquare: Square) => {
    // console.log("Drop: src/target", sourceSquare, targetSquare)
    // const move = game.move({
    //   from: sourceSquare,
    //   to: targetSquare,
    //   promotion: "q",
    // });
    // if (move === null) {
    //   return false;
    // }
    // setFen(game.fen());
    socket.send(
      JSON.stringify({
        type: MOVE,
        move: {
          from: sourceSquare,
          to: targetSquare,
        },
      })
    );
    return true;
  };

  return (
    <div className="h-screen w-screen bg-customGray-100 flex justify-center items-center">
      <div className="flex justify-center w-3/5">
        <div className="w-1/2 relative">
          <Chessboard
            id={"BasicBoard"}
            position={fen}
            boardOrientation={color}
            onPieceDrop={onDrop}
            customDarkSquareStyle={{ backgroundColor: "#4B7399" }}
            customLightSquareStyle={{ backgroundColor: "#EAE9D2" }}
            // onPieceClick={}
          />
          {result && <GameOverPopup method={result.method} outcome={result.outcome} />} 
        </div>
        <div className="w-1/2 bg-customGray-200 flex justify-center items-center gap-10">
          <div className="flex flex-col justify-evenly items-center w-4/5 h-4/5">
            <button
              className="text-white text-xl font-bold bg-customBlue-100 hover:bg-customBlue-200 px-16 py-4 rounded-lg"
              onClick={() => {
                socket.send(
                  JSON.stringify({
                    type: INIT_GAME,
                  })
                );
              }}
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
    // <div className="h-96 w-96">
    //   <Chessboard
    //     id={"BasicBoard"}
    //     position={fen}
    //     boardOrientation={side}
    //     onPieceDrop={onDrop}
    //     customDarkSquareStyle={{ backgroundColor: "#4B7399" }}
    //     customLightSquareStyle={{ backgroundColor: "#EAE9D2" }}
    //   />
    //   <button className="p-10 bg bg-green-700" onClick={()=>{
    //       socket.send(
    //         JSON.stringify({
    //           type: INIT_GAME,
    //         })
    //       );
    //   }}>
    //     Play
    //   </button>
    // </div>
  );
}

export default PlayChess;
