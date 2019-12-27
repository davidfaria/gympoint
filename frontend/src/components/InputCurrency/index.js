import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useField } from '@rocketseat/unform';

import { CustomInputCurrency } from './styles';

export default function InputCurrency({ name, ...rest }) {
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);

  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.value',
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  return (
    <>
      <CustomInputCurrency
        name={fieldName}
        onChangeEvent={e => setSelected(e.target.value)}
        value={selected}
        decimalSeparator=","
        thousandSeparator="."
        ref={ref}
        {...rest}
      />
      {error && <span>{error}</span>}
    </>
  );
}

InputCurrency.propTypes = {
  name: PropTypes.string.isRequired,
};
