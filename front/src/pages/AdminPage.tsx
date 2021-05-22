import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import MessagePrompt from "../components/MessagePrompt";
import { Button, Headline, Page, Textarea } from "../styles";
import { Text } from "../styles/typography";
import { Message } from "../types";
import { socket } from "../utils/config";

const AdminPage = () => {
  const params = useParams<{ room: string }>();
  const roomId = params["room"];

  const [message, setMessage] = useState<Message>();
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.emit("newConnection", roomId);
    
    socket.on("message", setMessage)

    return () => {
      socket.off("message")
    };
  }, [params])

  const handleSendMessage = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    socket.emit("newMessage", { roomId, message: newMessage })
    setNewMessage("");
  }

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (<Page>
    <form onSubmit={handleSendMessage}>
      <Headline>Room: {params.room}</Headline>

      <Textarea onKeyDown={handleKeyDown} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />

      <Button>Send</Button>
    </form>

    <Hr/>

    <Text>Current message:</Text>

    <MessagePrompt {...message} />
  </Page>)
}

const Hr = styled.hr`
  margin: 1rem 0 2rem;
`;

export default AdminPage;