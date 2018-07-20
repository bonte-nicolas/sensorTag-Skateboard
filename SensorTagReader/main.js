const SensorTag = require('sensortag');

let db = null;

let xAccelerometre = 0.0;
let yAccelerometre = 0.0;
let zAccelerometre = 0.0;
let xGyroscope = 0.0;
let yGyroscope = 0.0;
let zGyroscope = 0.0;

let xAccOld, yAccOld, zAccOld, xGyroOld, yGyroOld, zGyroOld;

SensorTag.discover(tag => {
  console.log('Discovered new SensorTag!');

  /*tag.on('disconnect', () => {
    console.log('Disconnected!');
    process.exit(0);
  });  */

  var MongoClient = require('mongodb').MongoClient;

  var uri = "mongodb+srv://admin:admin@cluster0-hz44e.mongodb.net/test";
  MongoClient.connect(uri, function(err, client) {
    let collection = client.db("IOT").listCollections().toArray(function(err, infos) {
      //console.log(infos[1].options.validator['$jsonSchema']);

      db = client.db("IOT");
      /*db.collection("mouvements").find({}).toArray(function(err, result) {
    console.log(result);
  });*/
/*db.createCollection( "mouvements", {
   validator: { $jsonSchema: {
      bsonType: "object",
      properties: {
         id: {
            bsonType: "int",
         },
         xAccelerometre: {
            bsonType: "number",
         },
         yAccelerometre: {
            bsonType: "number",
         },
         zAccelerometre: {
            bsonType: "number",
         },
         xGyroscope: {
            bsonType: "number",
         },
         yGyroscope: {
            bsonType: "number",
         },
         zGyroscope: {
            bsonType: "number",
         }
      }
   } }
} )

db.createCollection( "references", {
   validator: { $jsonSchema: {
      bsonType: "object",
      properties: {
         id: {
            bsonType: "int",
         },
         ordre: {
            bsonType: "int"
         },
         nom: {
            bsonType: "string",
         },
         xAccelerometre: {
            bsonType: "number",
         },
         yAccelerometre: {
            bsonType: "number",
         },
         zAccelerometre: {
            bsonType: "number",
         },
         xGyroscope: {
            bsonType: "number",
         },
         yGyroscope: {
            bsonType: "number",
         },
         zGyroscope: {
            bsonType: "number",
         }
      }
   } }
} )

db.createCollection( "relation", {
   validator: { $jsonSchema: {
      bsonType: "object",
      properties: {
         idMouvement: {
            bsonType: "int",
         },
         idReference: {
            bsonType: "int"
         }
      }
   } }
} )*/

  })

  tag.connectAndSetUp(() => {
    console.log('Connected!');
    tag.enableAccelerometer(() => {
      tag.setAccelerometerPeriod(100, function(error){if(error) throw error});
      tag.notifyAccelerometer(() => {
        tag.on('accelerometerChange', (x, y, z) => {
          xAccelerometre = parseFloat(x.toFixed(1));
          yAccelerometre = parseFloat(y.toFixed(1));
          zAccelerometre = parseFloat(z.toFixed(1));         
          if(xGyroscope != 0 && yGyroscope != 0 && zGyroscope != 0 && xAccelerometre != 0 && yAccelerometre != 0 && zAccelerometre != 0){
          if(!checkIfIdle(xAccelerometre, zAccelerometre, zAccelerometre, xGyroscope, yGyroscope, zGyroscope)){
              insert(1, 1, xAccelerometre, yAccelerometre, zAccelerometre, xGyroscope, yGyroscope, zGyroscope);
            }          
          }
        });
      });
    });

    tag.enableGyroscope(() => {
      tag.setGyroscopePeriod(100, function(error){if(error) throw error});
      tag.notifyGyroscope(() => {
        tag.on('gyroscopeChange', (x, y, z) => {
          xGyroscope = parseFloat(x.toFixed(1));
          yGyroscope = parseFloat(y.toFixed(1));
          zGyroscope = parseFloat(z.toFixed(1));
          if(xGyroscope != 0 && yGyroscope != 0 && zGyroscope != 0 && xAccelerometre != 0 && yAccelerometre != 0 && zAccelerometre != 0){
            if(!checkIfIdle(xAccelerometre, zAccelerometre, zAccelerometre, xGyroscope, yGyroscope, zGyroscope)){
               insert(1, 1, xAccelerometre, yAccelerometre, zAccelerometre, xGyroscope, yGyroscope, zGyroscope);
            }
            
          }
        });
      });
    });
  });
});
});

function insert(id, ordre, xAcc, yAcc, zAcc, xGyro, yGyro, zGyro){
  db.collection("mouvements").insertOne({id: id, ordre: ordre, xAccelerometre: xAcc, yAccelerometre: yAcc, zAccelerometre: zAcc, xGyroscope: xGyro, yGyroscope: yGyro, zGyroscope: zGyro }, function(err, result) {
              if(err){
                console.log("ERREUR INSERT : "+ JSON.stringify({id: id, ordre: ordre, xAccelerometre: xAcc, yAccelerometre: yAcc, zAccelerometre: zAcc, xGyroscope: xGyro, yGyroscope: yGyro, zGyroscope: zGyro }))
                throw err;
              } 
    console.log("INSERT : "+ JSON.stringify({id: id, ordre: ordre, xAccelerometre: xAcc, yAccelerometre: yAcc, zAccelerometre: zAcc, xGyroscope: xGyro, yGyroscope: yGyro, zGyroscope: zGyro }))

    console.log("objet inseré");
  } )
}

function checkIfIdle(xAcc, yAcc, zAcc, xGyro, yGyro, zGyro){
  let bool = true;
  if(checkChangement(xAccOld, xAcc, 1.5)|| checkChangement(yAccOld, yAcc, 5.5)|| checkChangement(zAccOld, zAcc, 5.5) || checkChangement(xGyroOld, xGyro, 10.0) || checkChangement(yGyroOld, yGyro, 10.0) || checkChangement(zGyroOld, zGyro, 10.0)){
    bool = false;
  }
  if(checkChangement(xAccOld, xAcc, 1.5)){
    console.log("Acceleration x");
  }
  if(checkChangement(yAccOld, yAcc, 5.5)){
    console.log("Acceleration y");
  }
  if(checkChangement(zAccOld, zAcc, 5.5)){
    console.log("Acceleration z");
  }
  if(checkChangement(xGyroOld, xGyro, 10.0)){
    console.log("Gyroscope x");
  }
  if(checkChangement(yGyroOld, yGyro, 10.0)){
    console.log("Gyroscope y");
  }
    if(checkChangement(zGyroOld, zGyro, 10.0)){
      console.log("Gyroscope z");
    }
  xAccOld = xAcc;
  yAccOld = yAcc;
  zAccOld =  zAcc;
  xGyroOld = xGyro;
  yGyroOld = yGyro;
  zGyroOld = zGyro;
  return bool;
}
function checkChangement(ancienneValeur, valeur, marge){
  if(ancienneValeur - marge < valeur < ancienneValeur + marge){
    return false;
  }
  return true;
}
