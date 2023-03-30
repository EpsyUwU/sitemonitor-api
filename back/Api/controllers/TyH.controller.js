import _insertNewDateHyT from "../models/TyH.model.js"
import rabbitMQ from '../RabbitMQ/Consummer.js';
import sns from '../Aws/sns.js'




const nuevoRegistroTyH = async(req, res) => {
    console.log(req.body);
  
    let TyH = {
      temperatura: req.body.data.temperatura,
      humedad: req.body.data.humedad,
    };
    
    try {
      _insertNewDateHyT._insertNewDateHyT(TyH, async (data) => {
        let TyH = data;

        let temperatura = parseInt(req.body.data.temperatura)
        if(temperatura > 45){
          let params = {
            Message: `${req.body.email} \n\n el site se esta quemandooooo, temperatura: ${temperatura}`,
            Subject: req.body.Subject,
            TopicArn: 'arn:aws:sns:us-east-2:486245195371:monitoreo'
          }

          sns.publish(params, (err,data) => {
            if (err) console.log(err, err.stack);
            else console.log(data);
          });
        }
      
  
        if (TyH) {
          res.json({
            error: false,
            status: 200,
            menssage: "Nuevo dato insertado",
            TyH,
          });
  
        const message = {
            data: {
                temperatura: req.body.data.temperatura,
                humedad: req.body.data.humedad
            }
        };
  
          const sent = await rabbitMQ.channel.sendToQueue(
            "newTyHRequest",
            Buffer.from(JSON.stringify(message), { persistent: true })
          );
  
          if (sent) {
            console.log(
              `Mensaje enviado a la cola 'newTyHRequest': ${JSON.stringify(
                message
              )}`
            );
          } else {
            console.log(
              `Error al enviar el mensaje a la cola 'newTyHRequest': ${JSON.stringify(
                message
              )}`
            );
          }
        } else {
          res.json({
            error: false,
            status: 201,
            menssage: "Nuevo dato insertado",
            TyH,
          });
        }
      });
    } catch (error) {
      res.json({
        error: true,
        status: 500,
        menssage: "Error en el servidor",
        StatusError: error.toString(),
      });
    }
  };
  

const all_RegsitroTyH = async(req,res) => {
   
    _insertNewDateHyT.getall_RegsitroTyH(async (data)=>{
        
        let TyH = data

        const message = {
          data: {
            TyH
          }
        }

        const sent = await rabbitMQ.channel.sendToQueue(
          "AllTyHRequest",
          Buffer.from(JSON.stringify(message), { persistent: true })
        )

        if (sent) {
          console.log(
            `Mensaje enviado a la cola 'AllTyHRequest': ${JSON.stringify(
              message
            )}`
          );
        } else {
          console.log(
            `Error al enviar el mensaje a la cola 'AllTyHRequest': ${JSON.stringify(
              message
            )}`
          );
        }


        res.json({
            error:false,
            status: 200,
            message:" Se encontraron " + TyH.length + " datos de temperatura y humedad" ,
            TyH,
        });
    })
}

const TyH = {
    nuevoRegistroTyH,
    all_RegsitroTyH
} 

export default TyH ;