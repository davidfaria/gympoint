import React from 'react';
import PropTypes from 'prop-types';
import { CustomButtonLikeLink } from './styles';

import colors from '~/styles/colors';

export default function ButtonLikeLink({ children, color, ...rest }) {
  return (
    <CustomButtonLikeLink color={color} {...rest}>
      <span>{children}</span>
    </CustomButtonLikeLink>
  );
}

CustomButtonLikeLink.defaultProps = {
  color: colors.primary,
};

CustomButtonLikeLink.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  color: PropTypes.string,
};
