import {getAllUser, login_user, _create_user,_delete_user, getUserById} from '../models/user.model.js' 
import jwt from 'jsonwebtoken';
import rabbitMQ from '../RabbitMQ/Consummer.js';
import sns from '../Aws/sns.js'

//Crear Usuario-----------------------------------------------------
const create_user = async (req, res) => {

    let user = {
        nombre : req.body.nombre,
        paterno : req.body.paterno,
        materno : req.body.materno,
        fechaNacimiento : req.body.fechaNacimiento,
        username : req.body.username,
        password : req.body.password,
        gmail: req.body.gmail
    }

    try {
        _create_user(user,async (data)=>{
            let user = data;
            const gmail = req.body.gmail

        if(user){
            const message = {
                Protocol: 'EMAIL', 
                TopicArn: "arn:aws:sns:us-east-2:486245195371:monitoreo",
                Endpoint: gmail
            }

            sns.subscribe(message, (err, data) => {
                if (err) {
                  console.log("Error al enviar el mensaje SNS", err);
                } else {
                  console.log("Mensaje SNS enviado correctamente", data);
                }
            });

            return res.json({
                error:false,
                status:200,
                menssage:"Usuario Creado",
                user
            });   
        }else{
            return res.json({
                error:false,
                status:201,
                menssage:"Usuario no Creado",
                user
            }); 
        }
    })
    } catch (error) {
        return res.json({
            error:true,
            status:500,
            menssage:"Error en el servidor",
            StatusError : error.toString()
        });
    }

};

//Eliminar Usuario--------------------------------------------------
const delete_user = async(req, res) => {

    // console.log(req.params);

    let {IdUsuario} = req.params;

    try {
        _delete_user(IdUsuario, (data => {

            let status = data.status;
            //console.log(status);
               
            return res.json({
                error:false,
                status:200,
                menssage:"Usuario Eliminado",
                    
            }); 
                
        }))
    } catch (error) {
        return res.json({
            error:true,
            status:500,
            menssage:"Error en el servidor",
            StatusError : error.toString()
        });
    }
}

//Llamar a todos los usuarios---------------------------------------
const all_User = async(req,res) => {
   
    getAllUser(async (data)=>{
        let users = data;

        const message = {
            data: {
                users
            }
        }

        const sent = await rabbitMQ.channel.sendToQueue(
            "AllUsersRequest",
            Buffer.from(JSON.stringify(message), { persistent: true })
        )

        if (sent) {
            console.log(
              `Mensaje enviado a la cola 'AllUsersRequest': ${JSON.stringify(
                message
              )}`
            );
          } else {
            console.log(
              `Error al enviar el mensaje a la cola 'AllUsersRequest': ${JSON.stringify(
                message
              )}`
            );
          }

        res.json({
            error:false,
            status: 200,
            message:"Se encontraron " + users.length +" usuarios",
            users,
        });
    })
}

//Loguear Usuario---------------------------------------------------
const login = async(req,res) => {

    let username = req.body.username
    let password = req.body.password
   
    try {
        login_user(username, password, (data)=> {
            let user = data[0];
            //console.log(user);
            if(user){

                jwt.sign({
                    user
                }, "SECRET", {
                    expiresIn: '3h'
                }, (err, token) => {
                    if (err) {
                        res.json({
                            error: true,
                            tipoError: 403,
                            mesage: "Error en el servidor",
                        });
                    } else {
                        return res.json({
                            error:false,
                            status:200,
                            menssage:"Usuario encontrado",
                            user,
                            data:token
                        }); 
                    }
                });

            }else{
                return res.json({
                    error:false,
                    status:201,
                    menssage:"Usuario no encontrado",
                    user:[]
                });  
            }
    
        })
    } catch (error) {
        return res.json({
            error:true,
            status:500,
            menssage:"Error en el servidor",
            StatusError : error.toString()
        });
    }

}

//Obtener Usuario por Id--------------------------------------------
const user_By_IdUser = async(req,res) => {
   
    //console.log(req.params);

    let {IdUsuario} = req.params;

    try {
        getUserById(IdUsuario,async (data) => {
            
            let user = data;

            const message = {
                data: {
                    user
                }
            }

            const sent = await rabbitMQ.channel.sendToQueue(
                "ByUserRequest",
                Buffer.from(JSON.stringify(message), { persistent: true })
            )
          
            if(user){
                return res.json({
                    error:false,
                    status:200,
                    menssage:"Usuario encontrado",
                    user
                }); 
            }else{
                return res.json({
                    error:false,
                    status:201,
                    menssage:"Usuario no encontrado",
                    user:[]
                });  
            } 
                
        })
    } catch (error) {
        return res.json({
            error:true,
            status:500,
            menssage:"Error en el servidor",
            StatusError : error.toString()
        });
    }
}

export const userController = {
    create_user,
    delete_user,
    all_User,
    login,
    user_By_IdUser,
};

