import { createSlice } from '@reduxjs/toolkit';

import { deleteChannel } from './channelsSlice.js';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => ({
      ...state,
      messages: action.payload,
    }),
    addMessage: (state, action) => ({
      ...state,
      messages: [...state.messages, action.payload],
    }),
  },

  extraReducers: (builder) => {
    builder.addCase(deleteChannel, (state, action) => ({
      ...state,
      messages: state.messages.filter(
        (message) => message.channelId !== action.payload.id,
      ),
    }));
  },
});

export const { setMessages, addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
