import React from 'react';
import Text from './Text';

const B = ({ fn, size, children, color }) => (
  <Text onPress={fn} style={{ fontWeight: 'bold', fontSize: size, color }}>
    {children}
  </Text>
);
export default B;
