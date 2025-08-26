require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

const pool = require("./db");

const PORT = process.env.PORT || 8000;


app.use(express.json());


app.get("/api/health",(req,res)=>{
    res.status(200).json({status:"ok"});
    
})


app.post("/api/register", async (req,res)=>{

    try{

        const {name,email,password} = req.body;

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password,saltRounds);

        const user = await pool.query("INSERT INTO users(name,email,password_hash)VALUES($1,$2,$3) RETURNING id,name,email",[name,email,hashPassword]);
        res.json(user.rows[0]);


    }catch(err){
        console.error(err.message);
        res.status(500).json({"message":"Server Error"})

    }


})


app.listen(PORT,()=>{
    console.log(`live at http:/localhost:${PORT}`);
})

