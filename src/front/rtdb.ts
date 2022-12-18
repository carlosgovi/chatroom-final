import firebase from "firebase";
///utilizo las variables de entorno y no uso mas el json
const variablesDeEntorno: any = process.env;
const firebaseConfig: any = {
  apiKey: "AIzaSyCKwgeOSD4aRlGS0k9MUgsTF3AkITSnW6I",
  authDomain: "apx-dwfs-m6.firebaseapp.com",
  databaseURL: "https://apx-dwfs-m6-default-rtdb.firebaseio.com",
  projectId: "apx-dwfs-m6",
  storageBucket: "apx-dwfs-m6.appspot.com",
  messagingSenderId: "36468954221",
  appId: "1:36468954221:web:4373e6b59465706d0c9b64",
  measurementId: "G-L4DD8FFYQF",
  // apikey: variablesDeEntorno.API_KEY,
  // databaseURL: variablesDeEntorno.DATABASE_URL,
  // authDomain: variablesDeEntorno.AUTH_DOMAIN,
  // projectId: variablesDeEntorno.PROJECT_ID,
  // messagingSenderId: "36468954221",
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
