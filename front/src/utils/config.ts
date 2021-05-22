import { io } from "socket.io-client";

export const API_URL = `${window.location.origin.match('localhost') ? 'http://localhost:8001' : `${window.location.origin}:8001`}`;

export const SOCKET_URL = `${window.location.origin.match('localhost') ? 'http://localhost:8000' : `${window.location.origin}:8000`}`;

export const socket = io(SOCKET_URL);
