const mysql =  require('mysql');
const {database} = require('./keys');

const pool = mysql.createPool(database);
pool.getConnection((err, connection) => {
    if(err) {
        if(err.code ==='PROTOCOL_CONNECTION_LOST') {
            console.error('LA CONEXION A LA BASE DE DATOS FUE CERRADA');
        }
        if( err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
    }
})