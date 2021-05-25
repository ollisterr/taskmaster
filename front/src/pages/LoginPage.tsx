import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Divider from '../components/Divider';
import { Button, Hidden, Input, Page, Spacer } from '../styles';
import { Headline, Error } from '../styles/typography';
import api from '../utils/api';
import { API_URL } from '../utils/config';
import { setToken } from '../utils/storage';

const LoginPage = () => {
  const history = useHistory();
  const location = useLocation<{ error?: string }>();
  
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [joinError, setJoinError] = useState('');
  
  const [createRoomId, setCreateRoomId] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createError, setCreateError] = useState('');

  const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    api.post(
      API_URL + '/login', 
      { roomId: joinRoomId, password: joinPassword }
    ).then(({ roomId, token }: { roomId: string, token: string }) => {
      // navigate to newly created chat
      if (roomId && token) {
        setToken(roomId, token);
        history.push(`/admin/${roomId}`);
      }
    }).catch((error: Error) => {
      setJoinError(error.message);
    });
  };

  const handleCreateRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    api.post(
      API_URL + '/create', 
      { roomId: createRoomId, password: createPassword }
    ).then(({ roomId, token }: { roomId: string, token: string }) => {
      // navigate to newly created chat
      if (roomId && token) {
        setToken(roomId, token);
        history.push(`/admin/${roomId}`);
      }
    }).catch((error: Error) => {
      setCreateError(error.message);
    });
  };
  
  const changeJoin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateError('');
    setJoinRoomId(e.target.value);
  };
  
  const changeJoinPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateError('');
    setJoinPassword(e.target.value);
  };

  const changeCreate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateError('');
    setCreateRoomId(e.target.value);
  };
  
  const changeCreatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateError('');
    setCreatePassword(e.target.value);
  };
  
  return <Page>
    {location?.state?.error && <Error>{location.state.error}</Error>}

    <Spacer />

    <form onSubmit={handleJoinRoom}>
      <Headline>Manage Existing Room</Headline>
        
      <Input 
        value={joinRoomId} 
        onChange={changeJoin} 
        placeholder="Room ID" 
      />
      
      <Input 
        type="password"
        value={joinPassword} 
        onChange={changeJoinPassword} 
        placeholder="Room Password"
      />

      <Error>{joinError} <Hidden>k</Hidden></Error>
        
      <Button>Join</Button>
    </form>
    
    <Divider>OR</Divider>

    <form onSubmit={handleCreateRoom}>
      <Headline>Create Room</Headline>
        
      <Input 
        value={createRoomId} 
        onChange={changeCreate} 
        placeholder="Room Name" 
        minLength={4}
      />
      
      <Input 
        type="password"
        value={createPassword} 
        onChange={changeCreatePassword} 
        placeholder="Room Password" 
        minLength={4}
      />

      <Error>{createError} <Hidden>k</Hidden></Error>
        
      <Button>Create</Button>
    </form>
  </Page>;
};

export default LoginPage;