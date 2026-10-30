import { io } from 'socket.io-client';

// The back serves this client, so the API and socket share its origin
export const API_URL = '/api';

// WebSocket only: the back drops sockets without an Origin header, and
// browsers leave it off same-origin polling requests
export const socket = io({ transports: ['websocket'] });
