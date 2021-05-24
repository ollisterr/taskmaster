import React from "react";
import styled, { keyframes } from "styled-components";
import { useWindupString } from "windups";

import { Small, Text } from "../styles/typography";

interface Props {
  message?: string;
  timestamp?: string;
}

const MessagePrompt = ({ message = "", timestamp = "" }: Props) => {
  const [windup] = useWindupString(message, { pace: (c: string) => [".", "!", "?"].includes(c) ? 400 : 40 });

  return (<Wrapper>
    <Small>{timestamp}</Small>

    <Text>{windup} <Cursor>▋</Cursor></Text>
  </Wrapper>)
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 300px;
  margin: 2rem 0;
  font-size: 2vh;
`;

export const blink = keyframes`
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
`;

const Cursor = styled.span`
  content: "▋";
  animation: ${blink} 700ms step-start infinite;
`;

export default MessagePrompt;