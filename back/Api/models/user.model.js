import { createConnection } from 'mysql';
import {conexion}  from "../database/MySQL.database.js";

//Crear Usuario-----------------------------------------------------
export const _create_user = (user,callback) =>{

    let sql = 'call sp_usuarios_crear( "'+user.nombre+'", "'
                                +user.paterno+'","'
                                +user.materno+'","'
                                +user.fechaNacimiento+'","'
                                +user.username+'","'
                                +user.password+'","'
                                +user.gmail+'")';

    let connection = createConnection(conexion);

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

//Eliminar Usuario--------------------------------------------------
export const _delete_user = (IdUsuario,callback) =>{

    let sql = 'call sp_usuarios_eliminar('+IdUsuario+')';
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

//Llamar a todos los usuarios---------------------------------------
export const getAllUser = (callback) =>{

    let sql = 'call sp_usuarios_listar()';
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

//Loguear Usuario---------------------------------------------------
export const login_user = (username, password,callback) =>{

    let sql = 'call sp_usuarios_loguear("'+username+'", "'+password+'")';
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

//Listar Usuario por Id--------------------------------------------
export const getUserById = (IdUsuario,callback) =>{

    let sql = 'call sp_usuarios_id('+IdUsuario+')';
    // console.log(sql);
    let connection = createConnection(conexion);
    
    connection.query(sql,(err,data) => {
        if(err){
            throw err;
        };
        if(data.length>0){
            connection.end();
            return callback(data[0][0])
        };
        connection.end();
        return callback(null);

    });
}