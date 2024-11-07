import moveSound from "../assets/Sound/move.mp3";
import illegalmoveSound from "../assets/Sound/illegalmove.mp3";
import captureSound from "../assets/Sound/bomb.mp3"
import checkSound from "../assets/Sound/check.mp3"
import castleSound from "../assets/Sound/castle.mp3"
import gamestartSound from "../assets/Sound/gamestart.mp3"

export const useSounds = () => {
    
  function MoveSound() {
    const audio = new Audio(moveSound)
    audio.play()
  }
  function CaptureSound() {
    const audio = new Audio(captureSound)
    audio.play()
  }
  function CheckSound() {
    const audio = new Audio(checkSound)
    audio.play()
  }
  function CastleSound() {
    const audio = new Audio(castleSound)
    audio.play()
  }
  function GamestartSound() {
    const audio = new Audio(gamestartSound)
    audio.play()
  }
  function IllegalmoveSound() {
    const audio = new Audio(illegalmoveSound)
    audio.play()
  }

  return {
    MoveSound,
    CaptureSound,
    CheckSound,
    CastleSound,
    GamestartSound,
    IllegalmoveSound
  };
};
