import { createConnection } from "mysql";
import {conexion}  from "../database/MySQL.database.js";

export const _insertNewDateHyT = (TyH,callback) =>{

    let sql = 'call sp_nuevoRegistro_TyH( "'+TyH.humedad+'","'
                                            +TyH.temperatura+'")';

    let connection = createConnection(conexion);
    console.log(sql)
    connection.query(sql,(err,data) => {
        if(err){
            throw err;
        };
        if(data.length>0){
            connection.end();
            return callback(data[0][0]);
        };
        connection.end();
        return callback(null);

    });

}

export const getall_RegsitroTyH = (callback) =>{

    let sql = 'call sp_tyh_registros()';
    let connection = createConnection(conexion);
    
    connection.query(sql,(err,data) => {
        if(err){
            throw err;
        };
        if(data.length>0){
            connection.end();
            return callback(data[0])
        };
        connection.end();
        return callback(null);

    });

}

const TyHModel = {
    _insertNewDateHyT,
    getall_RegsitroTyH
};

export default TyHModel;