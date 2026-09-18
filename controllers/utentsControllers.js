// logica relativa ai dati utenti

const connection = require('../config/db');

connection.query(' SELECT * FROM utents', (err, result) =>{
    if(err){
        res.status(500).json({message: 'Errore nella query per i dati utenti', err})
        return;
    }else {
        res.status(200).json({
            message: 'Connessione avvenuta con successo'
            
        })
    }
});


module.exports = connection