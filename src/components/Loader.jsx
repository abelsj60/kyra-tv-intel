import constants from '../helpers/constants';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  margin-top: 15px;
  margin-left: 15px;
`;
const Image = styled.img`
  height: 24px;
  width: 24px;
`;
const PlainText = styled.p`
  margin: 7px 10px 0px;
`;

export default function Loader() {
  return (
    <Container>
      <Image
        // Should be backround image. Refactor...
        // Also, should be data uri...!
        src="/spinner.gif"
      />
      <PlainText>{constants.loadingText}</PlainText>
    </Container>
  );
}
