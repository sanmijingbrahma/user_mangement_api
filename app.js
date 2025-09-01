require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken");
const pool = require("./db");
const PORT = process.env.PORT || 8000;
const JWT_SECRET= process.env.JWT_SECRET;

const authMiddleware = require("./middlewares/authMiddleware");


app.use(express.json());


app.get("/api/health",(req,res)=>{
    res.status(200).json({status:"ok"});
    
})


app.post("/api/register", async (req,res)=>{

    try{

        const {name,email,password} = req.body;

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password,saltRounds);

        const user = await pool.query("INSERT INTO users(name,email,password)VALUES($1,$2,$3) RETURNING id,name,email",[name,email,hashPassword]);
        res.status(201).json(user.rows[0]);

    }catch(err){
        console.error("Register Error",err);
        res.status(500).json({"message":"Server Error"});

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
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            res.status(400).json({error:"invalid credentials"});
        }
        
        const token = jwt.sign(
            {id:user.id, email:user.email},
            JWT_SECRET,
            {expiresIn:"15m"},
        )

        res.json({token});

    }catch(err){
        res.status(500).json({"message":"Server Error"})

    }
})

app.get("/api/me",authMiddleware,(req,res)=>{

    res.status(200).json({message:"Your are authenticated"});
})


app.put("/api/me",authMiddleware, async (req,res)=>{
    try{

        const {name,email} = req.body;

        const result = await pool.query("UPDATE users SET name=$1 WHERE email=$2 RETURNING name,email",[name,email] );
        const user = result.rows[0];

        res.status(200).json(user);
    }catch(err){
        res.status(500).json({"Error":err.message});
    }
})

app.delete("/api/me",authMiddleware, async (req,res)=>{
    try{

        const {email} = req.body;

        const result = await pool.query("DELETE FROM users WHERE email=$1 RETURNING name,email",[email] );
        const user = result.rows[0];

        res.status(200).json(user);
    }catch(err){
        res.status(500).json({"Error":err.message});
    }
})



app.listen(PORT,()=>{
    console.log(`live at http:/localhost:${PORT}`);
})

