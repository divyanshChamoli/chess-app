import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Square } from "react-chessboard/dist/chessboard/types";
import { useSocket } from "../hooks/useSocket";
import { GAME_OVER, INIT_GAME, MOVE } from "../utils/messages";
import GameOverPopup from "../components/GameOverPopup";
import GameStatus from "../components/GameStatus";

function StandardChess() {
  const socket = useSocket();
  const [color, setColor] = useState<"white" | "black">();
  const [fen, setFen] = useState<string>("start");
  const [result, setResult] = useState<{
    outcome: string;
    method: string;
  } | null>(null);
  const [search, setSearch] = useState<boolean | undefined>(undefined);
  const [moveCount, setMoveCount] = useState(0);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case INIT_GAME:
          setColor(data.payload);
          setSearch(false);
          break;
        case MOVE:
          setMoveCount((cnt) => cnt + 1);
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

  const startGame = () => {
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
    setSearch(true);
  };

  return (
    <div className="h-screen w-screen bg-customGray-100 flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center md:w-5/6 w-full p-1">
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
        <GameStatus
          color={color}
          startGame={startGame}
          moveCount={moveCount}
          search={search}
        />
      </div>
    </div>
  );
}

export default StandardChess;
