import React from 'react';
import styled from 'styled-components';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
} from 'styled-bootstrap-components';

const ButtonContainer = styled.div`
  margin-top: ${p => p.top ? p.top : ''};
  margin-bottom: ${p => p.bottom ? p.bottom : ''};
  margin-left: ${p => p.left ? p.left : ''};
  margin-right: ${p => p.right ? p.right : ''};

  @media (min-width: 690px) {
    display: none;
  }
`;
const RestyledButton = styled(Button)`
  background-color: #007bff;
  color: white;
  width: 100%;

  &:hover {
    background-color: #007bff !important;
  }

  &:focus {
    background-color: #007bff !important;
    color: white !important;
  }
`;
const RestyledDropdown = styled(Dropdown)`
  width: 100%;
`;

export default function MobileNavigationButton(props) {
  const {
    bottom,
    labelData,
    getLabel,
    hideLabels,
    label,
    left,
    right,
    setHiddenStatus,
    setLabel,
    top
  } = props;

  return (
    <ButtonContainer left={left} right={right} top={top} bottom={bottom}>
      <RestyledDropdown>
        <RestyledButton dropdownToggle onClick={() => setHiddenStatus(!hideLabels)} outline>{label}</RestyledButton>
        <DropdownMenu fullWidth hidden={hideLabels}>
          {labelData.map((_, idx) => (
            <DropdownItem
              active={label === getLabel(idx)}
              key={idx}
              onClick={setLabel(idx, 'dropdown')}
            >{getLabel(idx)}</DropdownItem>
          ))}
        </DropdownMenu>
      </RestyledDropdown>
    </ButtonContainer>
  );
}
