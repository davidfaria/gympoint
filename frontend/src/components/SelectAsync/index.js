import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';

import { debounce } from 'lodash';

import { useField } from '@rocketseat/unform';

// import { Container } from './styles';

export default function ReactSelectAsync({
  name,
  options,
  multiple,
  asyncFunc,
  ...rest
}) {
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);

  function parseSelectValue(selectRef) {
    const selectValue = selectRef.props.value;
    if (!multiple) {
      return selectValue ? selectValue.id : '';
    }

    return selectValue ? selectValue.map(option => option.id) : [];
  }

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.value.id',
      parseValue: parseSelectValue,
      clearValue: selectRef => {
        selectRef.select.clearValue();
      },
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  const loadValues = value => asyncFunc(value);

  const debouncedLoadOptions = debounce(loadValues, 500, {
    leading: true,
  });

  function getDefaultValue() {
    if (!defaultValue) return null;

    if (!multiple) {
      return options.find(option => option.id === defaultValue);
    }

    return options.filter(option => defaultValue.includes(option.id));
  }

  return (
    <>
      <AsyncSelect
        name={fieldName}
        aria-label={fieldName}
        loadOptions={inputValue => debouncedLoadOptions(inputValue)}
        options={options}
        isMulti={multiple}
        defaultValue={getDefaultValue()}
        getOptionValue={option => option.id}
        getOptionLabel={option => option.name}
        noOptionsMessage={() => 'Nenhum registro localizado'}
        loadingMessage={() => 'Carregando...'}
        placeholder="Selecione..."
        ref={ref}
        {...rest}
      />

      {error && <span>{error}</span>}
    </>
  );
}

ReactSelectAsync.propTypes = {
  name: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  asyncFunc: PropTypes.func.isRequired,
};

ReactSelectAsync.defaultProps = {
  multiple: false,
};
