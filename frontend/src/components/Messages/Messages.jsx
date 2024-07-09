import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  useGetMessagesQuery,
  useAddMessageMutation,
} from '../../api/messagesApi.js';

import { setMessages } from '../../slices/messagesSlice.js';

import HeaderListMessages from './HeaderListMessages.jsx';
import ListMessages from './ListMessages.jsx';
import NewMessageForm from '../Forms/NewMessageForm.jsx';

const Messages = () => {
  const dispatch = useDispatch();

  const { data, error, isLoading, refetch } = useGetMessagesQuery();
  //console.log(data);
  //{ id: '1', body: 'text message', channelId: '1', username: 'admin }

  const [addMessage, { error: addMessageError, isLoading: isAddingMessage }] =
    useAddMessageMutation();

  const addMessageHandler = (messageData) => addMessage(messageData);

  useEffect(() => {
    if (data) {
      dispatch(setMessages(data));
    }
  }, [data, dispatch]);

  const { messages } = useSelector((state) => state.messages);
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const username = useSelector((state) => state.auth.username);

  const currentChannel = channels.find(
    (channel) => channel.id === currentChannelId,
  );

  const currentChannelMessages = messages.filter(
    (message) => message.channelId === currentChannelId,
  );

  const countCurrentChannelMessages = currentChannelMessages.length;

  return (
    <>
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <HeaderListMessages
          nameCurrentChannel={currentChannel?.name ?? ''}
          countCurrentChannelMessages={countCurrentChannelMessages}
        />
      </div>

      <div id="messages-box" className="chat-messages overflow-auto px-5">
        {countCurrentChannelMessages > 0 && (
          <ListMessages currentChannelMessages={currentChannelMessages} />
        )}
      </div>

      <div className="mt-auto px-5 py-3">
        <NewMessageForm
          username={username}
          channelId={currentChannelId}
          addMessageHandler={addMessageHandler}
        />
      </div>
    </>
  );
};

export default Messages;
