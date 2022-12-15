import * as admin from "firebase-admin";
// import * as serviceAccount from "./key.json";
///////////
console.log("variables::::", process.env);
////////////
///utilizo las variables de entorno y no uso mas el json
const variablesDeEntorno = process.env;
// var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(variablesDeEntorno as any),
  databaseURL: "https://apx-dwfs-m6-default-rtdb.firebaseio.com",
});
//referencia a la bdreal time

const rtdb = admin.database();
//exporto el firestore para acceder a la bd
const firestore = admin.firestore();
export { firestore, rtdb };
