// method to check the ID before the query



 function checkId(id){
    if(!Number.isInteger(Number(id)) || Number(id) <= 0){
        const errorId = new Error ('Id ricevuto è sbagliato');
        errorId.code = 'INVALID_ID'
        return  errorId;
    }
     return
 }

 export default checkId