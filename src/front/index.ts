import { state } from "./state";
import { Router } from "@vaadin/router";
import "./router";
import "./pages/inicio";
import "./pages/chat";
(function () {
  state.init();
  // if (window.localStorage.getItem("state")) {
  //   Router.go("/chat");
  // }
  console.log("state:::::::::", state.getState());
})();
