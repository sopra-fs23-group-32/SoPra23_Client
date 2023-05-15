import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";

const Socket = new SockJS(getDomain() + "/socket");
const stompClient = Stomp.over(Socket)

const connect = (header) => {
    stompClient.connect({...header}, onConnected, err => console.log(err));
}

const onConnected = frame => {
    console.log("Socket connected!");
    console.log(frame);
    stompClient.subscribe("/instance/games", (message) => {
        console.log(message);
        if(message.body) {
            console.log("header", message.headers);
            console.log("body", message.body);
        }
    })
}

export const joinGame = () => {
    // stompClient.subscribe("/instance/games", (message) => {
    //     console.log(message);
    //     if(message.body) {
    //         console.log("header", message.headers);
    //         console.log("body", message.body);
    //     }
    // })
}

export const createSocketGame = (gameID, userName) => {
    stompClient.send("app/create", {gameID: gameID, username: userName}, "")
}

export default connect;
