import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { useGetMessagesQuery } from '../../api/messagesApi.js';

import { setMessages } from '../../slices/messagesSlice.js';

import HeaderListMessages from './HeaderListMessages.jsx';
import ListMessages from './ListMessages.jsx';
import NewMessageForm from '../Forms/NewMessageForm.jsx';

const Messages = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const {
    data,
    error: getMessageError,
    isLoading: isGettingMessage,
    refetch,
  } = useGetMessagesQuery();

  const getMessages = (state) => state.messages;
  const { messages } = useSelector(getMessages);

  const getChannels = (state) => state.channels;
  const { channels, currentChannelId } = useSelector(getChannels);

  const getAuth = (state) => state.auth;
  const { username } = useSelector(getAuth);

  useEffect(() => {
    if (data) {
      dispatch(setMessages(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (getMessageError) {
      toast.error(t('errorsToast.messageGettingError'));
    }
  }, [getMessageError, t]);

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
          <ListMessages
            currentChannelMessages={currentChannelMessages}
            isLoading={isGettingMessage}
          />
        )}
      </div>

      <div className="mt-auto px-5 py-3">
        <NewMessageForm
          username={username}
          channelId={currentChannelId}
          refetchListMessages={refetch}
        />
      </div>
    </>
  );
};

export default Messages;
