const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'medactiveDB',
    password: 'MyNewDB26!!'
})


connection.connect((error) =>{
    if(error){
        console.log('Errore connessione db:', error)
    }else{
        console.log('Connessione al db avvenuta con successo!!')
    }
})
module.exports = connection