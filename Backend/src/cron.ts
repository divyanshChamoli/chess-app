import { CronJob } from "cron";

 const backendUrl = 'wss://chess-app-api.onrender.com/'; 
 export const job = new CronJob('*/14 * * * *', function () {  
    fetch(backendUrl)
        .then((res)=>{
            if (!res.ok) {
                throw new Error(`Response status: ${res.status}`);
            }
            return res.text()
        }) 
        .catch((err)=>{
            console.log(err)
        })
});

    