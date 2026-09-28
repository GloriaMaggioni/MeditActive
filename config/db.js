import { createPool } from 'mysql2';
import dotenv from 'dotenv'
dotenv.config()


const pool = createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD

}).promise()

async function getUtents(){
    const result = await pool.query('SELECT * FROM utents')
   return result

}

const utents = await getUtents()
console.log(utents)



export default pool