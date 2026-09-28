// logica relativa ai dati utenti

import { query } from '../config/db';


const getAllUtents = (res,req) =>{
    query(' SELECT * FROM utents', (err, result) =>{
    if(err){
        res.status(500).json({message: 'Errore nella query per i dati utenti', err})
        return;
    }else {
        res.status(200).json({
            message: 'Connessione avvenuta con successo',
            data: result = {
                name: string ,
                surname: string,
                email: string,
            }
            
        })
    }
});

console.log(getAllUtents())


}

export default { getAllUtents}