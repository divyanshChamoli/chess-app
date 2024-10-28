import { Chess, Square } from "chess.js";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { useSocket } from "../hooks/useSocket";
import { GAME_OVER, INIT_GAME, MOVE } from "../utils/messages";
import { useEffect } from "react";

function PlayChess() {
  const socket = useSocket();
  const [game] = useState<Chess>(new Chess());
  const [side, setSide] = useState<"white" | "black">("white")
  const [fen, setFen] = useState<string>("start");

  useEffect(() => {
    if(!socket){
      return
    }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case INIT_GAME:
          console.log("Match starts");
          setSide(data.payload)
          break;
        case MOVE:
          console.log("Move made");
          setFen(data.payload)
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
    socket.send(JSON.stringify({
      type: MOVE,
      move: {
        from : sourceSquare,
        to : targetSquare
      }
    }))
    return true;
  };

  return (
    <div className="h-96 w-96">
      <Chessboard
        id={"BasicBoard"}
        position={fen}
        boardOrientation={side}
        onPieceDrop={onDrop}
        customDarkSquareStyle={{ backgroundColor: "#B00000" }}
      />
      <button className="p-10 bg bg-green-700" onClick={()=>{
          socket.send(
            JSON.stringify({
              type: INIT_GAME,
            })
          );
      }}>
        Play
      </button>
    </div>
  );
}

export default PlayChess;
