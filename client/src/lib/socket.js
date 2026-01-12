import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://flex-it-out-3tml.vercel.app';

// include credentials so cookies are sent with socket requests
export const socket = io(URL, {
  withCredentials: true,
  transports: ['websocket', 'polling']
});
