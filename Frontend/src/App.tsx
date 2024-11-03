import { BrowserRouter, Route, Routes } from "react-router-dom"
import Landing from "./pages/Landing"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import PlayChess from "./pages/PlayChess"
import AtomicChess from "./pages/AtomicChess"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/play" element={<PlayChess/>}/>
        <Route path="/atomic" element={<AtomicChess/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
