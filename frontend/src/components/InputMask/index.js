import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useField } from '@rocketseat/unform';

import { MaskInput } from './styles';

export default function InputMask({ name, mask, ...rest }) {
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
      <MaskInput
        mask={mask}
        name={fieldName}
        maskChar="_"
        alwaysShowMask={true}
        onChange={e => setSelected(e.target.value)}
        value={selected}
        ref={ref}
        {...rest}
      />
      {error && <span>{error}</span>}
    </>
  );
}

InputMask.propTypes = {
  name: PropTypes.string.isRequired,
  mask: PropTypes.string.isRequired,
};

// 9: 0-9
// a: A-Z, a-z
// *: A-Z, a-z, 0-9

// {
//   mask: '99/99/9999',
//   maskChar: '_',
//   alwaysShowMask: false,
//   formatChars: {
//     '9': '[0-9]',
//     'a': '[A-Za-z]',
//     '*': '[A-Za-z0-9]'
//   },
//   permanents: [2, 5] // permanents is an array of indexes of the non-editable characters in the mask
// }

{
  /* <InputMask
    name="cep"
    mask="99999-999"
    value={customer.cep}
    onChange={e => setPlan({ ...plan, cep: e.target.value })}
  />
  <InputMask
    name="placa"
    mask="aaa-9999"
    value={customer.placa}
    onChange={e => setPlan({ ...plan, placa: e.target.value })}
  /> */
}
