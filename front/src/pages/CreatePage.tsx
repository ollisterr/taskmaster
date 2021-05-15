import React, { useState } from "react";
import { useHistory } from "react-router";

import { Button, Headline, Input, Page } from "../styles";
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
        <Headline>Create TaskMaster Chat</Headline>

        <Input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Chat name" />

        <Small>{error}</Small>

        <Button>Create</Button>
      </form>
    </Page>
  )
}

export default CreatePage;