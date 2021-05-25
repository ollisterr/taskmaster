import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

import MessagePrompt from '../components/MessagePrompt';
import { Button, Page, Textarea } from '../styles';
import { Text, Headline } from '../styles/typography';
import { Message } from '../types';
import { socket } from '../utils/config';
import { getToken, resetToken } from '../utils/storage';

const AdminPage = () => {
  const params = useParams<{ room: string }>();
  const roomId = params['room'];

  const history = useHistory();

  const [message, setMessage] = useState<Message>();
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.emit('newConnection', roomId);
    
    socket.on('message', setMessage);

    socket.on('invalidRoom', () => {
      history.replace(
        '/admin', 
        { error: 'Invalid room ID, please re-check your URL' }
      );
    });

    socket.on('invalidToken', () => {
      resetToken(roomId);
      history.replace(
        '/admin', 
        { error: 'Invalid token for room, please log in again' }
      );
      console.error('Invalid token for room, please log in again');
    });

    return () => {
      socket.off('message');
    };
  }, [params]);

  const handleSendMessage = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const token = getToken(roomId);

    socket.emit('newMessage', { roomId, message: newMessage, token });
    setNewMessage('');
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (<Page>
    <form onSubmit={handleSendMessage}>
      <Headline>Room: {params.room}</Headline>

      <Textarea 
        onKeyDown={handleKeyDown} 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
      />

      <Button>Send</Button>
    </form>

    <Hr/>

    <Text>Current message:</Text>

    <MessagePrompt {...message} />
  </Page>);
};

const Hr = styled.hr`
  margin: 1rem 0 2rem;
`;

export default AdminPage;