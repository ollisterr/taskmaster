import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { Button, Hidden, Input, Page } from '../styles';
import { Headline, Error } from '../styles/typography';
import { API_URL } from '../utils/config';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import Divider from '../components/Divider';

const FrontPage = () => {
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinError, setJoinError] = useState('');

  const history = useHistory();

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    api.post(API_URL + '/join', { roomId: joinRoomId })
      .then(({ roomId }: { roomId: string }) => {
        // navigate to newly created chat
        if (roomId) {
          history.push(`/${roomId}`);
        }
      })
      .catch((error: Error) => {
        setJoinError(error.message);
      });
  };

  const handleChangeJoin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinError('');
    setJoinRoomId(e.target.value);
  };

  return (
    <Page>
      <form onSubmit={joinRoom}>
        <Headline>Join Room</Headline>
        
        <Input 
          value={joinRoomId} 
          onChange={handleChangeJoin} 
          placeholder="Room ID" 
        />

        <Error>{joinError} <Hidden>Placeholder</Hidden></Error>
        
        <Button>Join</Button>
      </form>

      <Divider>OR <Link to="/admin">Manage rooms</Link></Divider>
    </Page>
  );
};

export default FrontPage;