"use strict";
exports.__esModule = true;
exports.rtdb = exports.firestore = void 0;
var admin = require("firebase-admin");
// import * as serviceAccount from "./key.json";
///////////
////////////
///utilizo las variables de entorno y no uso mas el json
var variablesDeEntorno = process.env;
// var serviceAccount = require("path/to/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(variablesDeEntorno),
    databaseURL: "https://apx-dwfs-m6-default-rtdb.firebaseio.com"
});
//referencia a la bdreal time
var rtdb = admin.database();
exports.rtdb = rtdb;
//exporto el firestore para acceder a la bd
var firestore = admin.firestore();
exports.firestore = firestore;
