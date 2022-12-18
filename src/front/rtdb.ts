import firebase from "firebase";
///utilizo las variables de entorno y no uso mas el json
const variablesDeEntorno: any = process.env;
const firebaseConfig: any = {
  apikey: variablesDeEntorno.API_KEY,
  databaseURL: variablesDeEntorno.DATABASE_URL,
  authDomain: variablesDeEntorno.AUTH_DOMAIN,
  projectId: variablesDeEntorno.PROJECT_ID,
};

//app initializeApp recibe los datos de la cuenta
const app = firebase.initializeApp(firebaseConfig);
// apiKey: "0NB9wAenWVHXRdM6okEkzR4MH7FUSNHro8DdUEua",
// databaseURL: "https://apx-dwfs-m6-default-rtdb.firebaseio.com",
// authDomain: "apx-dwfs-m6.firebaseapp.com",

///referencia a la base de datos realtime
const rtdb = firebase.database();

export { rtdb };
///referencia a un dato en particular
// const chatroomRef = database.ref("/chatrooms");
// const chatroomRef = database.ref("/chatrooms/1234");
// ///// con on escuchamos los cambios de la bd
// chatroomRef.on("value", (snapshot) => {
//   const valor = snapshot.val();
//   console.log(snapshot, valor);
// });

// const API_BASE_URL = "http://localhost:3000";
// function conectarAlChatroom() {
//   fetch(API_BASE_URL + "/chatroom", {
//     method: "post",
//   })
//     .then((res) => {
//       return res.json();
//     })
//     .then((data) => {
//       console.log(data);
//       //referencia a la trdb con il id q me paso en la respuesta del backend
//       const chatroomRef = database.ref("/chatrooms/" + data.id);
//       ///// con on escuchamos los cambios de la bd
//       chatroomRef.on("value", (snapshot) => {
//         const valor = snapshot.val();
//         console.log(snapshot, valor);
//       });
//     });
// }

// (function () {
//   const button: any = document.querySelector(".conectar");
//   button.addEventListener("click", () => {
//     conectarAlChatroom();
//   });
// })();
