import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { fen, makeSquare, Move, parseSquare } from "chessops";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";
import { Atomic } from "chessops/variant";
import { makeFen } from "chessops/fen";
import { useSocket } from "../hooks/useSocket";
import {
  INIT_GAME,
  MOVE,
  GAME_OVER,
  BOMBED_SQUARES,
  ADDITIONAL,
  CAPTURE,
  ATOMIC,
} from "../utils/messages";
import GameOverPopup from "../components/GameOverPopup";
import GameStatus from "../components/GameStatus";
import { getAdjacentSquares, isOpponentsTurn } from "../utils/chessFunctions";
import { bombedSquareStyle } from "../utils/inlineStyles";
import { useSounds } from "../hooks/useSounds";

function AtomicChess() {
  const socket = useSocket();
  const [game] = useState(Atomic.default());
  const [gamefen, setGamefen] = useState(fen.INITIAL_FEN);
  const [color, setColor] = useState<"white" | "black">();
  const [result, setResult] = useState<{
    outcome: string;
    method: string;
  } | null>(null);
  const [search, setSearch] = useState<boolean | undefined>(undefined);
  const [moveCount, setMoveCount] = useState(0);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [bombedSquares, setBombedSquares] = useState<string[]>([]);
  const { MoveSound, CaptureSound, GamestartSound, IllegalmoveSound } =
    useSounds();

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
          GamestartSound();
          break;
        case MOVE:
          const move = data.payload.move;
          const fen = data.payload.fen;
          // already validated move comes from backend
          if (data.payload.moveType === CAPTURE) {
            CaptureSound();
          } else {
            MoveSound();
          }

          game.play(move);
          setMoveCount((cnt) => cnt + 1);
          setGamefen(fen);
          break;
        case ADDITIONAL:
          setBombedSquares(data.payload.bombedSquares);
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

  const onDrop = (sourceSquare: Square, targetSquare: Square, piece: Piece) => {
    const move: Move = {
      from: parseSquare(sourceSquare),
      to: parseSquare(targetSquare),
    };
    if (isOpponentsTurn(moveCount, color)) {
      return false;
    }
    setBombedSquares([]);
    if (game.isLegal(move)) {
      //set fen so that user sees fast UI updates, verify moves again on backend
      //NOTE: Dont do game.play(move) here as it breaks things, do this only when backend broadcasts message to both players

      //If move has resulted in a capture
      // console.log("W",game.castles.path.black)
      // console.log("B",game.castles.path.white)

      if (game.board.occupied.has(move.to)) {
        //castle temp logic
        if (
          (sourceSquare === "e1" && targetSquare === "h1" && piece === "wK") ||
          (sourceSquare === "e1" && targetSquare === "a1" && piece === "wK") ||
          (sourceSquare === "e8" && targetSquare === "h8" && piece === "bK") ||
          (sourceSquare === "e8" && targetSquare === "a8" && piece === "bK")
        ) {
          //Do nothing
        } else {
          const adjSquares = getAdjacentSquares(targetSquare);
          setBombedSquares((prevSquares) => [
            ...prevSquares,
            ...adjSquares,
            targetSquare,
          ]);
          CaptureSound();
          //Send to other player
          socket.send(
            JSON.stringify({
              type: ADDITIONAL,
              payload: {
                reciever: BOMBED_SQUARES,
                bombedSquares: [...adjSquares, targetSquare], //Not sending bombedSquares directly as state doesnt update
              },
            })
          );
        }
      }
      setGamefen(makeFen(game.toSetup()));
      // const newAudio = new Audio(moveSound)
      // newAudio.play()
      MoveSound();
      socket.send(
        JSON.stringify({
          type: MOVE,
          move: move,
        })
      );
      setValidMoves([]);
      return true;
    } else {
      IllegalmoveSound();
      return false;
    }
  };

  const pieceClick = (piece: Piece, square: Square) => {
    //If not players turn => dont show them opponents valid moves
    if (isOpponentsTurn(moveCount, color)) {
      return;
      piece; //npm run build requires using it
    }
    // if (
    //   (moveCount % 2 === 0 && color === "black") ||
    //   (moveCount % 2 === 1 && color === "white")
    // ) {
    //   return;
    //   piece; //npm run build requires using it
    // }
    setValidMoves([]);
    setBombedSquares([]);
    const pieceValidMoves = game.dests(parseSquare(square));
    for (let move of pieceValidMoves) {
      setValidMoves((currMoves) => [...currMoves, makeSquare(move)]);
    }
  };

  const getValidMoveStyles = () => {
    const styles: any = {};
    if (bombedSquares.length !== 0) {
      bombedSquares.forEach((square) => {
        styles[square] = bombedSquareStyle;
      });
    } else {
      validMoves.forEach((square) => {
        styles[square] = {
          outline: `3px solid #06FF00`,
          outlineOffset: "-3px",
        };
      });
    }
    return styles;
  };

  const startGame = () => {
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
        variant: ATOMIC,
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
            position={gamefen}
            onPieceDrop={onDrop}
            onPieceClick={pieceClick}
            customDarkSquareStyle={{ backgroundColor: "#4B7399" }}
            customLightSquareStyle={{ backgroundColor: "#EAE9D2" }}
            customSquareStyles={getValidMoveStyles()}
            autoPromoteToQueen={true}
            boardOrientation={color}
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

export default AtomicChess;
