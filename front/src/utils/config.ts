import { io } from "socket.io-client";

const PORT = process.env.NODE_ENV === "production" ? 4000 : 8000;

export const SOCKET_URL = `${window.location.origin.match('localhost') ? 'http://localhost' : window.location.origin}:${PORT}`;

export const API_URL = `${window.location.origin.match('localhost') ? 'http://localhost' : window.location.origin}:${PORT + 1}`;

export const socket = io(SOCKET_URL);
