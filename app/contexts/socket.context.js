import React from "react";
import { Platform } from 'react-native';
import io from "socket.io-client";

console.log('Emulation OS Platform: ', Platform.OS);

export const socketEndpoint = Platform.OS === 'web' ? "http://localhost:3000" : "http://10.60.104.37:3000";

export const socket = io(socketEndpoint, {
    transports: ["websocket"],
});

socket.on("connect", () => {
    console.log("connect: ", socket.id);
});

socket.on("disconnect", () => {
    console.log("disconnected from server"); // undefined
    socket.removeAllListeners();
});

export const SocketContext = React.createContext();