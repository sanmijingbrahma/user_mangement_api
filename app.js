require("dotenv").config();
const express = require("express");

const app = express();


const PORT = process.env.PORT || 8000;


app.use(express.json());


app.get("/api/health",(req,res)=>{
    res.status(200).json({status:"ok"});
    
})


app.listen(PORT,()=>{
    console.log(`live at http:/localhost:${PORT}`);
})

