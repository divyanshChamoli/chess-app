import { Chess, Square } from "chess.js";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { useSocket } from "../hooks/useSocket";
import { GAME_OVER, INIT_GAME, MOVE } from "../utils/messages";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PlayChess() {
  const socket = useSocket();
  const [game] = useState<Chess>(new Chess());
  const [side, setSide] = useState<"white" | "black">("white");
  const [fen, setFen] = useState<string>("start");

  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case INIT_GAME:
          console.log("Match starts");
          setSide(data.payload);
          break;
        case MOVE:
          console.log("Move made");
          setFen(data.payload);
          break;
        case GAME_OVER:
          console.log("Game end");
          break;
      }
    };
  }, [socket]);

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
        <div className="w-1/2">
          <Chessboard
            id={"BasicBoard"}
            position={fen}
            boardOrientation={side}
            onPieceDrop={onDrop}
            customDarkSquareStyle={{ backgroundColor: "#4B7399" }}
            customLightSquareStyle={{ backgroundColor: "#EAE9D2" }}
          />
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
