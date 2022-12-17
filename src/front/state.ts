const API_BASE_URL = process.env.API_BASE_URL; //url del server
import { rtdb } from "./rtdb";
// //utilizo lodash par atratar el objeto que se recibe de la rtdb y pasar el mismo a un array
import map from "lodash/map";
// import map from "lodash/map";
const state = {
  //donde guardo los datos en el state
  data: {
    rtdbRoomId: "",
    userId: "",
    email: "",
    fullName: "",
    roomId: "",
    messages: [],
  },

  // escuchador listeners
  listeners: [],
  //Declaro in init metodo q inicializa y se engancha a chatrooms/ general de la RTDB
  init() {
    if (window.localStorage.getItem("state")) {
      const local: any = window.localStorage.getItem("state");
      const localParseado = JSON.parse(local);
      console.log("localStorage:::::::", localParseado);
      this.setState(localParseado);
      /////////////////////////////////////////////////////////

      this.listenRoom();
    }
  },
  listenRoom() {
    // //guarfo en state anterior
    const currentState = this.getState();
    // //referencia para la rtdb
    const chatrooomsRef = rtdb.ref("/rooms/" + currentState.rtdbRoomId);
    chatrooomsRef.on("value", (snapshot) => {
      const messagesFromServer = snapshot.val();
      console.log("snapshot  que retorna firebase rtdb::", messagesFromServer);
      ////con lodash hago un map de messageList
      const messagesList = map(messagesFromServer);
      console.log("messsagesList::::::", messagesList);
      currentState.messages = messagesList;
      this.setState(currentState);
      console.log("desde el state::", this.getState());
    });
  },

  ///  tomo los datos
  getState() {
    return this.data;
  },
  ///metodo para setear el nombre
  setNombre(newNombre: string) {
    const currentState = this.getState();
    currentState.fullName = newNombre;
    this.setState(currentState);
  },
  ///pushmessaje esta pensado para q se el mensaje nuevo le llegue al backend
  pushMessaje(NewMessage: string) {
    const currentState = state.getState();
    fetch(API_BASE_URL + "/messages", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        from: currentState.fullName,
        message: NewMessage,
        rtdbRoomId: currentState.rtdbRoomId,
      }),
    }).then(() => this.listenRoom());
  },

  ///seteo el email y el nombre completo en el state
  setEmailAndFullname(email: string, fullName: string) {
    const currentState = this.getState();
    currentState.fullName = fullName;
    currentState.email = email;
    this.setState(currentState);
  },
  ///signIn methodo para chequear que el user este en la db de firestore
  singIn() {
    const currentState = this.getState();
    if (currentState.email) {
      return fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: currentState.email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          currentState.userId = data.id;
          this.setState(currentState);
          console.log("respuesta del fetch", data);
          console.log("lo que tiene el state", state.getState());
        });
    } else {
      console.error("No hay email en el state");
    }
  },
  askNewRoom() {
    const currentState = this.getState();
    if (currentState.userId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: currentState.userId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          currentState.roomId = data.id;
          this.setState(currentState);
          console.log(state.getState());
          this.accesToRoom(currentState.roomId);
        });
    } else {
      console.error("no se recibio el userId");
    }
  },
  accesToRoom(roomId) {
    const currentState = this.getState();
    const userId = currentState.userId;
    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId, {
      ///al ser un fetch con el methodo get no nesecita q le pase los prametros del methos ni tampoco los headers ni tampoco va a enviar  el body
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("ID DE EL ROOM DESDE LA API", data);
        currentState.rtdbRoomId = data.rtdbRoomId;
        this.setState(currentState);
        this.listenRoom();
      });
  },
  /// seteo los datos pisando los anteriores
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
  },
  ///manejador del state
  subscribe(callbacks: (any) => { any }) {
    this.listeners.push(callbacks);
  },
};

export { state };
