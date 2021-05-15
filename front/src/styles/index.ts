import styled, { css } from "styled-components";

export const Page = styled.main`
  width: 500px;
  max-width: 100%;
`;


export const Headline = styled.h2`
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

export const Input = styled.input`
  ${styles}
  border: solid 2px #fff;

  &:focus {
    outline: none;
  }
`;

export const Textarea = styled.textarea`
  ${styles}
  border: solid 2px #fff;
  resize: none;

  &:focus {
    outline: none;
  }
`;

export const Button = styled.button`
  ${styles}
  border: none;
  background-color: #fff;
  color: #333;
  cursor: pointer;
`;