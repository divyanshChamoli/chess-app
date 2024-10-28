import { useEffect, useState } from "react";

export function useSocket(){
    const [socket, setSocket] = useState<WebSocket | null>(null)

    const WS_URL = "ws://localhost:3000"    
    useEffect(()=>{
        const ws = new WebSocket(WS_URL)
        ws.onopen = () =>{
            console.log("connected")
            setSocket(ws)
        }

    },[])
    
    return socket
}