const mysql = require('mysql2');
require ('dotenv').config()


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
})


connection.connect((error) =>{
    if(error){
        console.log('Errore connessione db:', error)
    }else{
        console.log('Connessione al db avvenuta con successo!!')
    }
})
module.exports = connection