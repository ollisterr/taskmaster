import styled, { css } from 'styled-components';

export const Page = styled.main`
  display: flex;
  flex-direction: column;
  width: 700px;
  max-width: 100vw;
  padding: 1rem;
`;

export const Spacer = styled.div<{ horizontal?: boolean }>`
  ${p => p.horizontal && 'width: 2rem;'}
  ${p => !p.horizontal && 'height: 2rem;'}
`;

export const Hidden = styled.span`
  font-size: inherit;
  visibility: hidden;
`;

const styles = css`
  width: 100%;
  padding: 1rem;
  border-radius: 5px;
  
  font-size: 1.5rem;
  color: white;
  font-family: inherit;
  background-color: transparent;
  transition: all 0.2s;

  &:focus {
    box-shadow: 0 0 0 0.25rem red;
    outline: none;
  }
`;

export const Input = styled.input`
  ${styles}
  border: solid 2px #fff;
  margin-bottom: 0.5rem;
`;

export const Textarea = styled.textarea`
  ${styles}
  border: solid 2px #fff;
  margin-bottom: 1rem;
  resize: none;
`;

export const Button = styled.button`
  ${styles}
  border: none;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: lightgrey;
  }
`;