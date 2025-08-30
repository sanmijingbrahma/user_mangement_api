require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken");

const pool = require("./db");

const PORT = process.env.PORT || 8000;
const JWT_SECRET= process.env.JWT_SECRET;


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


app.post("/api/login", async (req,res)=>{

    try{
        const {email,password} = req.body;
        
        const result = await pool.query("SELECT * FROM users where email=$1",[email]);
        const user = result.rows[0];
        if(!user){
            res.status(400).josn({error:"invalid credentials"})
        }
        const match = await bcrypt.compare(password,user.hashPassword);
        if(!match){
            res.status(400).json({error:"invalid credentials"});
        }
        
        const token = jwt.sign(
            {id:user.id,email:user.email},
            JWT_SECRET,
            {expiresIn:"15m"},
        )

        res.json({token});

    }catch(err){
        console.error(err.message);
        res.status(500).json({"message":"Server Error"})

    }
})



app.listen(PORT,()=>{
    console.log(`live at http:/localhost:${PORT}`);
})

