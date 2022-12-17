import { Router } from "@vaadin/router";
import { state } from "../state";
export class Home extends HTMLElement {
  connectedCallback() {
    this.render();
    const form = document.querySelector(".form");
    form?.addEventListener("submit", (e: any) => {
      e.preventDefault();
      const email = e.target.email.value;
      const fullName = e.target.fullname.value;
      const inputroomid = e.target.inputroomid.value;
      const selectroom = e.target.selectroom.value;
      console.log("Usuario inicio con nombre:::" + fullName + ":::");
      console.log("Usuario inicio con email :::" + email + ":::");
      state.setEmailAndFullname(email, fullName);
      console.log("desde el state::", state.getState());
      //si el select es nuevoroom creamos el nuevo room
      if (selectroom == "nuevoroom") {
        console.log("inicio nuevoroom");

        state.singIn()?.then(() => {
          state.askNewRoom();
        });
        Router.go("/chat");
      }
      ///si el select es roomexistente entramos al existente
      if (selectroom == "roomexistente") {
        console.log("inicio roomexistenete");

        state.getState().roomId = inputroomid;

        state.singIn()?.then(() => {
          state.accesToRoom(inputroomid);
        });

        Router.go("/chat");
      }
    });
    /////////////VER INPUT ROOM//////////
    const selectroom: any = form?.querySelector(".selectroom");
    const inputroomid: any = form?.querySelector(".inputroomid");
    const labelroomid: any = form?.querySelector(".labelroomid");

    selectroom.addEventListener("change", function () {
      if (selectroom.value == "roomexistente") {
        verInputRoom();
      } else {
        inputroomid.style.display = "none";
        labelroomid.style.display = "none";
      }
    });

    function verInputRoom() {
      console.log("cambio el select");
      inputroomid.style.display = "inline";
      labelroomid.style.display = "inline";
    }
  }
  render() {
    this.innerHTML = `
    <div class="footer">

    </div>
    <div class="conteiner">
    <form class="form">


 
    <div>
    <label class="label">Tu email</label>
    </div>
    <input class="input" type="email" name="email" /> 

    <div>
    <label class="label">Tu nombre</label>
    </div>
    <input class="input" type="text" name="fullname" />
    <div>
    <label class="label" for="cars">Room</label>
    </div>
    <div>
    <select class="selectroom input" name="selectroom" id="selectroom">
     <option value="nuevoroom">Nuevo Room</option>
     <option value="roomexistente">Room existente</option>
     
    </select>
    
    </div>

    <div>
    <label class="labelroomid label">Room Id</label>
    </div>
    <div>
    <input  class="inputroomid input" type="text" name="inputroomid" /> 
    </div>


    <div>
    <button class="buttom" type="submin" >Comenzar</button>
   </div>
    
    
    </form>
    </div>`;

    const style = document.createElement("style");

    style.innerHTML = `
    *{box-sizing: border-box;}
    html, body {
        background: #e5e5e5;
        font-family: 'Lato', sans-serif;
        margin: 0px auto;
    }
    .footer{
        height:60px ;
        width: 100%;
        background: rgba(82,179,217,0.9);
        margin-bottom: 40px;
        }
    .conteiner{
        
        display: flex;
        justify-content: center;
        align-items: center;
    }   
        .form{
            width: 312px;
           
        }
        .label{
            font-size: 24px;
        }
        .input{
            height:55px ;
            width: 100%;
            border: 2px solid #000000;
            border-radius: 4px;
            margin-bottom: 40px;
            font-size:24px;
        }
        .selectroom{
            font-size:24px
        }
        .buttom{
            background: #9CBBE9;
            border-radius: 4px;
            height:55px ;
            width: 100%;
            margin-top:30px;
            font-size:24px;
            border:none

        }
    .inputroomid {
        display:none;
    }
    .labelroomid{
        display:none;
    }`;
    this.appendChild(style);
  }
}
customElements.define("home-page", Home);
