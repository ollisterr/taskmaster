import React, { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

import { Button, Headline, Input, Page } from "../styles";
import { Small } from "../styles/typography";
import { API_URL } from "../utils/config";
import api from "../utils/api"

const FrontPage = () => {
  const [joinRoomId, setJoinRoomId] = useState("");
  const [createRoomId, setCreateRoomId] = useState("");
  
  const [joinError, setJoinError] = useState("");
  const [createError, setCreateError] = useState("");

  const history = useHistory();

  
  
  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    api.post(API_URL + "/join", { roomId: joinRoomId })
      .then(({ roomId }: { roomId: string }) => {
        // navigate to newly created chat
        if (roomId) {
          history.push(`/${roomId}`)
        }
      })
      .catch((error: Error) => {
        setJoinError(error.message)
      })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    api.post(API_URL + "/create", { roomId: createRoomId }).then(({ roomId }: { roomId: string }) => {
      // navigate to newly created chat
      if (roomId) {
        history.push(`/admin/${roomId}`)
      }
    }).catch((error: Error) => {
      setCreateError(error.message)
    })
  }

  const handleChangeJoin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinError("");
    setJoinRoomId(e.target.value);
  }
  
  const handleChangeCreate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateError("");
    setCreateRoomId(e.target.value);
  }

  return (
    <Page>
      <form onSubmit={joinRoom}>
        <Headline>Join Room</Headline>
        
        <Input value={joinRoomId} onChange={handleChangeJoin} placeholder="Room ID" />

        <Error>{joinError} <Hidden>Placeholder</Hidden></Error>
        
        <Button>Join</Button>
      </form>

      <DividerWrapper>
        <Line />

        <Small>OR</Small>

        <Line />
      </DividerWrapper>

      <form onSubmit={handleSubmit}>
        <Headline>Create TaskMaster Room</Headline>

        <Input value={createRoomId} onChange={handleChangeCreate} placeholder="Chat name" />

        <Error>{createError} <Hidden>Placeholder</Hidden></Error>

        <Button>Create</Button>
      </form>
    </Page>
  )
}


const DividerWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 3rem 0;
  `;

const Error = styled(Small)`
  color: red;
  font-size: 1rem;
`;

const Hidden = styled.span`
  font-size: inherit;
  visibility: hidden;
`;

const Line = styled.div`
  flex: 1 1 auto;
  height: 1px;
  width: 100%;
  background-color: white;
  margin: 1rem;
`;

export default FrontPage;