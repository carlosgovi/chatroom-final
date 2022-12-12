"use strict";
exports.__esModule = true;
var db_1 = require("./db");
var express = require("express");
//dejo de utilizar uuid y ahoar utilizamos nanoid
var nanoid_1 = require("nanoid");
//////////////////////
/////////////
var cors = require("cors");
//utilizo cors para supsanar un problema de corsss....¡?¡??¡?¡?
// utilizo nodemon para escuchar los cambios enla api mientras trabajo lo llamo con un escript desde yarn dev
//utilizo uuid para generar un id complejo para q no choqurn los id
//utilizo body parser para manejar el body ((de tal manera de poder recibir los datos q me pasan el el body y poder manipular esos datos ))
var port = 3000;
var app = express();
///con express.json puedo manejsr el body q recivo desde el front
app.use(express.json());
app.use(cors());
// // referencia a  la collection que quiero manipular datos en firestore
// const usersCollection = firestore.collection("users");
//////////////////////////////////////////////////////////////////////
// app.get("/users", function (req, res) {
//   res.json(["todos los usuarios"]);
// });
app.listen(port, function () {
    console.log("\n   ::::::Server corriendo:::::\n   \n   el el puerto http://localhost:".concat(port));
});
//////////////////////////////////ENDPOINDS DE INICIO SIGN/////////////
///ENDPOINT  SINGUP dar de alta en la base de datos. don los datos pasados en el body de la request
var userCollection = db_1.firestore.collection("users");
var roomsCollection = db_1.firestore.collection("rooms");
app.post("/signup", function (req, res) {
    var email = req.body.email;
    var nombre = req.body.nombre;
    console.log("request a signup ");
    console.log(email, nombre);
    userCollection
        ///con el where busco si hay coinsidencias con el email
        .where("email", "==", email)
        .get()
        .then(function (searchResponse) {
        //si el user no esta creado (lo creo en la base de  datos )
        if (searchResponse.empty) {
            userCollection
                .add({ email: email, nombre: nombre })
                .then(function (newUserRef) {
                res.json({ id: newUserRef.id, "new": true });
            });
        } //si el user existe se responde con un error 400 y un pequeño mensaje
        else {
            res.status(400).json({ message: "user already exists" });
        }
    });
});
//ENDPOINT AUTH que autentifica el user con el mail del mismo
app.post("/auth", function (req, res) {
    // const email=req.body.email   optamos por contracciones en las constsantes
    var email = req.body.email;
    console.log("request a auth ");
    console.log(email);
    userCollection
        ///con el where busco si hay coinsidencias con el email
        .where("email", "==", email)
        //get optengo esa lista que contenga las coincidencias
        .get()
        .then(function (searchResponse) {
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
app.post("/rooms", function (req, res) {
    var userId = req.body.userId;
    ///chequeo que exista el userid del body en la db
    userCollection
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        ///si existe
        if (doc.exists) {
            var roomRef_1 = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
            roomRef_1
                .set({
                message: []
            })
                .then(function () {
                var roomLongId = roomRef_1.key;
                var roomId = 1000 + Math.floor(Math.random() * 999);
                roomsCollection
                    .doc(roomId.toString())
                    .set({ rtdbRoomId: roomLongId })
                    .then(function () {
                    res.json({
                        id: roomId.toString()
                    });
                });
            });
        }
        else {
            res.status(401).json({ message: "no existe" });
        }
    });
});
app.get("/rooms/:roomId", function (req, res) {
    ///extraigo de la  request una query que me envian en la URL ejemplo: http://localhost:300/rooms/1732?userid=lsjfañdsjfkdjsñjafljkflj
    var userId = req.query.userId;
    //extraigo el roomid del URL que me mandan como params
    var roomId = req.params.roomId;
    console.log("userId resibido", userId);
    console.log("roomId resibida", roomId);
    ///busco en la bd el userid
    userCollection
        .doc(userId.toString())
        //me  traigo la respuesta y la trato
        .get()
        .then(function (doc) {
        ///si existe el documento en la db
        if (doc.exists) {
            roomsCollection
                .doc(roomId)
                .get()
                .then(function (snap) {
                var data = snap.data();
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
    var rtdbRoomId = req.body.rtdbRoomId;
    var chatRoomRef = db_1.rtdb.ref("/rooms/" + rtdbRoomId);
    console.log("lo q me pasan desde el cliente", req.body);
    chatRoomRef.push(req.body, function (err) {
        console.log(err);
        res.json("todo ok");
    });
});
///manejar las rutas q no estan declaradas
app.use(express.static("dist"));
app.get("*", function (req, res) {
    res.sendFile("../front/index.html");
});
