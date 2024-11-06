import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function PlayChess() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-customGray-100 flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center md:w-3/5 w-full p-1">
        <div className="md:w-1/2 relative">
          <img src="./chessboard.png" alt="chessboard" />
        </div>
        <div className="md:w-1/2 min-h-40 bg-customGray-200 flex justify-center items-center gap-10">
          <div className="flex flex-col justify-evenly items-center w-4/5 h-4/5 gap-5">
            <Button placeholder="Chess" onClick = {()=>navigate("/chess") } />
            <Button placeholder="Atomic Chess" onClick={() => navigate("/atomic")} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayChess;
