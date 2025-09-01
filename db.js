require("dotenv").config();
const {Pool} = require("pg");

const pool = new Pool({
    connectionString:process.env.DB_URL,
    ssl:{rejectUnauthorized:false},
})


//test
pool.connect()
.then((client)=>{
        console.log("database is connected!");
        client.release();
    })
.catch((err)=>{

        console.error(`Database not connected : ${err.stack}`);
        client.exit(1);
    })


module.exports = pool;
