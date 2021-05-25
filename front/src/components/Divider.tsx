import React from 'react';
import styled from 'styled-components';

const Divider: React.FC = ({ children }) => (
  <DividerWrapper>
    <Line />

    <Content>{children}</Content>

    <Line />
  </DividerWrapper>
);

const DividerWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 3rem 0;
`;

const Line = styled.div`
  flex: 1 1 auto;
  height: 1px;
  width: 100%;
  background-color: white;
  margin: 1rem;
`;

const Content = styled.div`
  display: flex;
  font-size: 1.2rem;
`;

export default Divider;