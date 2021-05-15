import React, { useState } from "react";
import { useHistory } from "react-router";
import styled, { css } from "styled-components";

import { Page } from "../styles";
import { Small } from "../styles/typography";

const CreatePage = () => {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  const history = useHistory();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("http://localhost:8001/create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId })
    }).then(response => response.json()).then(({ roomId }) => {
      // navigate to newly created chat
      if (roomId) {
        history.replace(`/admin/${roomId}`)
      }
    }).catch((error) => {
      console.log(error)
      setError(error.message)
    })
  }

  return (
    <Page>
      <form onSubmit={handleSubmit}>
        <H2>Create TaskMaster Chat</H2>

        <Input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Chat name" />

        <Small>{error}</Small>

        <Button type="submit">Create</Button>
      </form>
    </Page>
  )
}

const H2 = styled.h2`
  font-size: 2.4rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const styles = css`
  width: 100%;
  padding: 1rem;
  border-radius: 5px;
  
  font-size: 1.5rem;
  color: white;
  font-family: inherit;
  background-color: transparent;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  ${styles}
  border: solid 2px #fff;

  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  ${styles}
  border: none;
  background-color: #fff;
  color: #333;
  cursor: pointer;
`;

export default CreatePage;