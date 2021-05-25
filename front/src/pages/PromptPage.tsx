import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MessagePrompt from "../components/MessagePrompt";
import { Page } from "../styles";
import { socket } from "../utils/config";
import { Message } from "../types"


const playAudio = async (file: any) => {
  try {
    const audioContext = new AudioContext();
    const arr = new Uint8Array(file);
    const audio = await audioContext.decodeAudioData(arr.buffer);
    const source = audioContext.createBufferSource();
    source.buffer = audio;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (err) {
    console.error("Reading audio buffer failed", err);
  }
}

const PromptPage = () => {
  const params = useParams<{ room: string }>();

  const [message, setMessage] = useState<Message>();
  
  useEffect(() => {
    const roomId = params["room"];

    socket.emit("newConnection", roomId);
    
    socket.on("message", setMessage);

    return () => {
      socket.off("message")
    };
  }, [params])

  useEffect(() => {
    if (message?.file) {
      playAudio(message.file)
    }
  }, [message])

  return (<Page>
    <MessagePrompt {...message} />
  </Page>)
}

export default PromptPage;