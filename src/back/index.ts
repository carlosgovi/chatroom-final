import { firestore, rtdb } from "./db";
import * as express from "express";
//dejo de utilizar uuid y ahoar utilizamos nanoid
import { nanoid } from "nanoid";
//////////////////////
console.log("variables::::", process.env);
/////////////
import * as cors from "cors";

//utilizo cors para supsanar un problema de corsss....¡?¡??¡?¡?

// utilizo nodemon para escuchar los cambios enla api mientras trabajo lo llamo con un escript desde yarn dev

//utilizo uuid para generar un id complejo para q no choqurn los id

//utilizo body parser para manejar el body ((de tal manera de poder recibir los datos q me pasan el el body y poder manipular esos datos ))
const port = 3000;
const app = express();
///con express.json puedo manejsr el body q recivo desde el front
app.use(express.json());
app.use(cors());
// // referencia a  la collection que quiero manipular datos en firestore
// const usersCollection = firestore.collection("users");

//////////////////////////////////////////////////////////////////////
// app.get("/users", function (req, res) {
//   res.json(["todos los usuarios"]);
// });
app.listen(port, () => {
  console.log(`
   ::::::Server corriendo:::::
   
   el el puerto http://localhost:${port}`);
});
//////////////////////////////////ENDPOINDS DE INICIO SIGN/////////////
///ENDPOINT  SINGUP dar de alta en la base de datos. don los datos pasados en el body de la request
const userCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");
app.post("/signup", (req, res) => {
  const email = req.body.email;
  const nombre = req.body.nombre;
  console.log("request a signup ");
  console.log(email, nombre);

  userCollection
    ///con el where busco si hay coinsidencias con el email
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      //si el user no esta creado (lo creo en la base de  datos )
      if (searchResponse.empty) {
        userCollection
          .add({ email: email, nombre: nombre })
          .then((newUserRef) => {
            res.json({ id: newUserRef.id, new: true });
          });
      } //si el user existe se responde con un error 400 y un pequeño mensaje
      else {
        res.status(400).json({ message: "user already exists" });
      }
    });
});
//ENDPOINT AUTH que autentifica el user con el mail del mismo
app.post("/auth", (req, res) => {
  // const email=req.body.email   optamos por contracciones en las constsantes
  const { email } = req.body;
  console.log("request a auth ");
  console.log(email);
  userCollection
    ///con el where busco si hay coinsidencias con el email
    .where("email", "==", email)
    //get optengo esa lista que contenga las coincidencias
    .get()
    .then((searchResponse) => {
      //si el user no esta creado devuelvo un not found
      //empty analiza si esta la respursta con un booleano
      if (searchResponse.empty) {
        res.status(404).json({ message: "not found" });
      } //si el user existe se responde con el id del primer user encontrado
      else {
        res.json({ id: searchResponse.docs[0].id });
      }
    });
});
/////////////////////ENDPOINTS PARA LOS ROOMS//////////
//crea room y devuelve un id simplificado
app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  ///chequeo que exista el userid del body en la db
  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      ///si existe
      if (doc.exists) {
        const roomRef = rtdb.ref("rooms/" + nanoid());
        roomRef
          .set({
            message: [],
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);
            roomsCollection
              .doc(roomId.toString())
              .set({ rtdbRoomId: roomLongId })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                });
              });
          });
      } else {
        res.status(401).json({ message: "no existe" });
      }
    });
});

app.get("/rooms/:roomId", (req, res) => {
  ///extraigo de la  request una query que me envian en la URL ejemplo: http://localhost:300/rooms/1732?userid=lsjfañdsjfkdjsñjafljkflj
  const { userId } = req.query;
  //extraigo el roomid del URL que me mandan como params
  const { roomId } = req.params;
  console.log("userId resibido", userId);
  console.log("roomId resibida", roomId);

  ///busco en la bd el userid
  userCollection

    .doc(userId.toString())
    //me  traigo la respuesta y la trato
    .get()
    .then((doc) => {
      ///si existe el documento en la db
      if (doc.exists) {
        roomsCollection
          .doc(roomId)
          .get()
          .then((snap) => {
            const data = snap.data();

            res.json(data);
          });
      }
      ///si no existe en la db
      else {
        res.status(401).json({ message: "no existe" });
      }
    });
});
app.post("/messages", function (req, res) {
  const rtdbRoomId = req.body.rtdbRoomId;
  const chatRoomRef = rtdb.ref("/rooms/" + rtdbRoomId);
  console.log("lo q me pasan desde el cliente", req.body);

  chatRoomRef.push(req.body, function (err) {
    console.log(err);

    res.json("todo ok");
  });
});
///manejar las rutas q no estan declaradas
app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile("../front/index.html");
});
