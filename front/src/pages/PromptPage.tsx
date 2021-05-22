import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MessagePrompt from "../components/MessagePrompt";
import { Page } from "../styles";
import { socket } from "../utils/config";
import { Message } from "../types"

const PromptPage = () => {
  const params = useParams<{ room: string }>();

  const [message, setMessage] = useState<Message>();
  
  useEffect(() => {
    const roomId = params["room"];

    socket.emit("newConnection", roomId);
    
    socket.on("message", setMessage)

    return () => {
      socket.off("message")
    };
  }, [params])

  return (<Page>
    <MessagePrompt {...message} />
  </Page>)
}

export default PromptPage;