import React, { Fragment } from 'react';
import Selector from './Selector';

export default function ModeSelect(props) {
  const { handleModeLabel, modeLabel, modeTypes } = props;

  return (
    <Fragment>
      {modeTypes.map((type, idx) => (
        <Selector
          checked={type === modeLabel}
          id={idx}
          key={idx}
          onChange={handleModeLabel(idx)}
          right="12px"
          text={type}
          type="radio"
        />
      ))}
    </Fragment>
  );
}
