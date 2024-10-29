import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate()
  
  return (
    <div className="h-screen w-screen bg-customGray-100 flex justify-center items-center">
      <div className="flex justify-center w-5/6 h-5/6">
        <div className="w-1/2">
          <img
            src="/chessboard.png"
            alt="chessboard"
            className="object-contain h-full w-full"
          />
        </div>
        <div className="w-1/2 flex justify-center items-center gap-10">
          <div className="flex flex-col justify-evenly items-center w-4/5 h-4/5">
            <h2 className="text-5xl font-bold text-white text-center ">
              Play Chess Online on the #1 Site!
            </h2>
            <button className="text-white text-2xl font-bold bg-customBlue-100 hover:bg-customBlue-200 px-24 py-8 rounded-lg flex justify-center items-center gap-3"
            onClick={()=>navigate("/play")}>
              <Crown /> Play Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
