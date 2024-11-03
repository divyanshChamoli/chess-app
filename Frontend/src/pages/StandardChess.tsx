import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Square } from "react-chessboard/dist/chessboard/types";
import { useSocket } from "../hooks/useSocket";
import {
  GAME_OVER,
  INIT_GAME,
  MOVE,
} from "../utils/messages";
import GameOverPopup from "../components/GameOverPopup";
import Spinner from "../components/Spinner";

interface Result {
  outcome: string;
  method: string;
}

function StandardChess() {
  const socket = useSocket();
  const [color, setColor] = useState<"white" | "black">();
  const [fen, setFen] = useState<string>("start");
  const [result, setResult] = useState<Result | null>(null);
  const [search, setSearch] = useState<boolean | undefined>(undefined)
  const [moveCount, setMoveCount] = useState(0)

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case INIT_GAME:
          setColor(data.payload);
          setSearch(false)
          break;
        case MOVE:
          setMoveCount((cnt)=>cnt+1)
          setFen(data.payload);
          break;
        case GAME_OVER:
          let outcome = "";
          if (data.payload.draw === true) {
            outcome = "Draw";
          } else if (data.payload.winner === color) {
            outcome = "You Won";
          } else {
            outcome = "You Lost";
          }
          setResult({
            outcome: outcome,
            method: data.payload.method,
          });
          console.log(data.payload);
          break;
      }
    };
  }, [socket, color]);

  if (!socket) {
    return <div>Connecting...</div>;
  }

  const onDrop = (sourceSquare: Square, targetSquare: Square) => {
    socket.send(
      JSON.stringify({
        type: MOVE,
        move: {
          from: sourceSquare,
          to: targetSquare,
          // promotion: 'q'
        },
      })
    );
    return true;
  };

  return (
    <div className="h-screen w-screen bg-customGray-100 flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center md:w-3/5 w-full p-1" >
        <div className="md:w-1/2 relative">
          <Chessboard
            id={"BasicBoard"}
            position={fen}
            boardOrientation={color}
            onPieceDrop={onDrop}
            customDarkSquareStyle={{ backgroundColor: "#4B7399" }}
            customLightSquareStyle={{ backgroundColor: "#EAE9D2" }}
            autoPromoteToQueen={true}
          />
          {result && (
            <GameOverPopup method={result.method} outcome={result.outcome} />
          )}
        </div>
        <div className="md:w-1/2 min-h-40 bg-customGray-200 flex justify-center items-center gap-10">
          <div className="flex flex-col justify-evenly items-center w-4/5 h-4/5">
            {/* Conditional rendering for 3 states 
            1) No match is requested search=undefined
            2) Match requested but waiting for opponent to accept search=true
            3) Match accepted search=false */}
            {
              (search === undefined) ?
              <button
                className="text-white text-xl font-bold bg-customBlue-100 hover:bg-customBlue-200 px-16 py-4 rounded-lg"
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                  setSearch(true)
                }}
              >
                Play
              </button>
              :
              (search === true) ?
              <div className="flex justify-center items-center gap-4">
                <Spinner/>
                <p className="text-white ">Searching for opponents...</p>
              </div>
              :
              <div className="flex flex-col justify-center items-center gap-2">
                <p className="text-white text-2xl font-bold">The Game Begins!</p>
                <p className="text-white text-lg font-bold">You are {color}</p>
                {
                  moveCount%2===0 ?
                  <p className="text-white text-lg font-bold">It's white's turn</p> 
                  : <p className="text-white text-lg font-bold">It's black's turn</p>
                }
              </div>

            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default StandardChess;
