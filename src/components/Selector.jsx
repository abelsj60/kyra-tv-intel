import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  margin-top ${p => p.top && p.top};
  margin-right: ${p => p.right && p.right};
`;
const Input = styled.input`
  margin-right: 5px;
`;
const Label = styled.label`
  font-size: ${p => !p.smallText ? '1.1rem' : '.9rem'};
  margin-left: 5px;
`;

export default function Selector(props) {
  const { checked, id, onChange, right, smallText, text, top, type } = props;

  return (
    <Container right={right} top={top}>
      <Input autoComplete="off" checked={checked} id={id} type={type} onChange={onChange} />
      <Label htmlFor={id} smallText={smallText}>{text}</Label>
    </Container>
  );
}
