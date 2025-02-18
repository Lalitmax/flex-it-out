import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL);

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket,
    isConnected: false,
  },
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setConnected } = socketSlice.actions;
export default socketSlice.reducer;