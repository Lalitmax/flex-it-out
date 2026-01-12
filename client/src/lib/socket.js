import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://flex-it-out-3tml.vercel.app';

export const socket = io(URL);
