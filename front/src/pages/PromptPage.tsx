import React, { useEffect, useState } from "react";

import MessagePrompt from "../components/MessagePrompt";
import { Page } from "../styles";
import socket from "../utils/socket";
import { Message } from "../types"
import { useParams } from "react-router-dom";

const PromptPage = () => {
  const params = useParams<{ room: string }>();

  const [message, setMessage] = useState<Message>();
  
  useEffect(() => {
    const roomId = params["room"];

    socket.emit("newConnection", roomId);
    
    socket.on("message", (message) => {
      setMessage(message)
    })

    return () => {
      socket.off("message")
    };
  }, [params])

  return (<Page>
    <MessagePrompt {...message} />
  </Page>)
}

export default PromptPage;