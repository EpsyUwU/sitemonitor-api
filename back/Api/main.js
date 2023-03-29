import express from 'express';
import user from './routers/user.routes.js';
import TyH from './routers/TyH.routes.js';
import { createConnection } from 'mysql';
import {conexion}  from "./database/MySQL.database.js";
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import rabbitMQ from './RabbitMQ/Consummer.js';
const app = express()

app.use(cors());
const port = 3000


app.use(express.json({limit: '50mb'}));
app.use('/api/monitors/user', user);
app.use('/api/monitors/TyH', TyH);
await rabbitMQ.connect(); 

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 100 
});

app.use(limiter);

console.log("Variable Coneccion: " ,conexion);
const connection = createConnection(conexion);
connection.connect(function(error) {
    if (error) { 
        console.error("Error en la conexion a la base de datos: ",error);
        return;
    }
    console.log("Conexion exitosa con la base de datos");
    
});

app.listen(port, () => {
    console.log("Servidor corriendo en el puerto " + port)
});
