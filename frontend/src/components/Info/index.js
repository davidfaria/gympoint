import React from 'react';
import PropTypes from 'prop-types';
import { CustomInfo } from './styles';

export default function Info({ children }) {
  return <CustomInfo>{children}</CustomInfo>;
}

Info.propTypes = {
  children: PropTypes.string,
};
