import { io } from "socket.io-client";

const socket = io(process.env.NODE_ENV === "development" ? "http://localhost:8000" : "");

export default socket;