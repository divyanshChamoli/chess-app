import { CronJob } from "cron";

 const backendUrl = 'wss://chess-app-api.onrender.com/'; 
 export const job = new CronJob('*/14 * * * *', function () {  
    const ws = new WebSocket(backendUrl)
    ws.onopen = () =>{
        console.log("connected")
    }
});

    