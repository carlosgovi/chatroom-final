
///API////////
documentacion de postman:https://documenter.getpostman.com/view/24276986/2s8YzZPe43
basededatos:firestore
realtimedatabase:firebase
////////FRONT///////////
interprete u o compilador: parcel
 
 
 scrips:
    "dev:back": "nodemon --watch ./src/back/index.ts --exec ts-node ./src/back/dev.ts",
    "dev:front": "parcel serve ./src/front/index.html",
    "build:front": "npx parcel build ./src/front/index.html",
    "build:back": "tsc",
    "build": "yarn install && yarn build:front && yarn build:back",
    "start": "node ./src/back/index.js"

para correr en loscal disponer de el archivo .env 
