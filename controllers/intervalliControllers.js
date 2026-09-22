// logica relativa ai dati deli intervalli dei goals

//tradurre tutto in inglese

const connection = require('../config/db');

connection.query(' SELECT * FROM intervalli', (err, result) =>{
    if(err){
        res.status(500).json({message: 'Errore nella query per i dati sugli intervalli dei goals', err})
        return;
    }else {
        res.status(200).json({
            message: 'Connessione avvenuta con successo'
            
        })
    }
});


module.exports = connection;