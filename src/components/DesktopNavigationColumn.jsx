import React from 'react';
import styled from 'styled-components';
import {
  ListGroup,
  ListGroupItem
} from 'styled-bootstrap-components';

const Column = styled.div`
  display: none;

  @media (min-width: 690px) {
    display: block;
    flex: 1;
    width: 12rem;
  }
`;
const RestyledListGroup = styled(ListGroup)`
  margin-top: ${p => p.top ? p.top : ''};
  margin-bottom: ${p => p.bottom ? p.bottom : ''};
  margin-left: ${p => p.left ? p.left : ''};
  margin-right: ${p => p.right ? p.right : ''};
`;

export default function DesktopNavigationColumn(props) {
  const {
    bottom,
    getLabel,
    label,
    labelData,
    left,
    right,
    setLabel,
    top
  } = props;

  return (
    <Column>
      <RestyledListGroup bottom={bottom} top={top} left={left} right={right}>
        {labelData.map((_, idx) => (
          <ListGroupItem
            active={label === getLabel(idx)}
            key={idx}
            onClick={setLabel(idx)}
            style={{ // Only works when inline
              border: '1px solid rgba(0,0,0,.2)',
              cursor: 'pointer'
            }}
          >{getLabel(idx)}</ListGroupItem>
        ))}
      </RestyledListGroup>
    </Column>
  );
}
