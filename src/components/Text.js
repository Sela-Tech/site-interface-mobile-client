import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'proximaNova',
  },
});

const TextN = ({ onPress, style, children }) => (
  <Text onPress={onPress} style={[styles.text, style]}>
    {children}
  </Text>
);

TextN.defaultProps = {
  onPress: null,
  style: {},
  children: '',
};

TextN.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.object]),
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};
export default TextN;
