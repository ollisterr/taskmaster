import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

import MessagePrompt from '../components/MessagePrompt';
import { Page } from '../styles';
import { socket } from '../utils/config';
import { Message } from '../types';


const playAudio = async (file: ArrayBuffer) => {
  try {
    const audioContext = new AudioContext();

    // make sure that audiobuffer is not detached
    if (file.byteLength > 0) {
      const arr = new Uint8Array(file);
      const audio = await audioContext.decodeAudioData(arr.buffer);
      const source = audioContext.createBufferSource();
      source.buffer = audio;
      source.connect(audioContext.destination);
      source.start(0);
    }
  } catch (err) {
    console.error('Reading audio buffer failed', err);
  }
};

const PromptPage = () => {
  const params = useParams<{ room: string }>();

  const [message, setMessage] = useState<Message>();
  const [mute, toggleMute] = useState<boolean>(true);
  
  useEffect(() => {
    const roomId = params['room'];

    socket.emit('newConnection', roomId);
    
    socket.on('message', setMessage);

    socket.on('invalidRoom', () => {
      setMessage({ 
        message: 'You seem to be lost. Re-check your URL...', 
        timestamp: new Date().toISOString() 
      });
    });

    return () => {
      socket.off('message');
    };
  }, [params]);

  useEffect(() => {
    if (!mute && message?.file) {
      playAudio(message.file);
    }
  }, [message, mute]);

  return (<Page>
    <MessagePrompt {...message} />

    <MuteButton onClick={() => toggleMute(x => !x)}>
      <FontAwesomeIcon icon={mute ? faVolumeMute : faVolumeUp} />
    </MuteButton>
  </Page>);
};

const MuteButton = styled.button`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;

  bottom: 1.5rem;
  right: 1.5rem;
  width: 50px;
  height: 50px;
  border: solid 0.25rem lightgrey;
  border-radius: 999px;
  background: none;
  color: lightgrey;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: lightgrey;
    color: black;
  }

  &:focus {
    box-shadow: 0 0 0 0.25rem red;
    outline: none;
  }
`;

export default PromptPage;