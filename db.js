require("dotenv").config();
const {Pool} = require("pg");

const pool = new Pool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_USER,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,

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
