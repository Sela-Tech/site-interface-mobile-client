import React from 'react';
import PropTypes from 'prop-types';
import Text from './Text';

const B = ({ fn, size, children, color }) => (
  <Text onPress={fn} style={{ fontWeight: 'bold', fontSize: size, color }}>
    {children}
  </Text>
);

B.defaultProps = {
  size: null,
  color: null,
  fn: null,
};

B.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  children: PropTypes.string.isRequired,
  fn: PropTypes.func,
};

export default B;
