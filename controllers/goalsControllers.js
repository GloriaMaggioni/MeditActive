// logica relativa ai dati dei goals
const connection = require('../config/db')


connection.query(' SELECT * FROM goals', (err, result) =>{
    if(err){
        res.status(500).json({message: 'Errore nella query per i dati sui goals', err})
        return;
    }else {
        res.status(200).json({
            message: 'Connessione avvenuta con successo'
            
        })
    }
});


module.exports = connection;