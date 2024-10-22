import express from "express"
import {config} from "dotenv"
config()
const app = express()

const PORT = process.env.PORT

app.get("/", (req, res)=>{
    res.send("Chess App")
})

app.listen(PORT, ()=>{
    console.log("App listening on " + PORT)
})


