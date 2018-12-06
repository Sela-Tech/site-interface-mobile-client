import React from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Text from './Text';

const { height, width } = Dimensions.get('window');
const styles = {
  buttonStyle: {
    justifyContent: 'center',
    width: width / 1.3,
    borderRadius: 5,
    alignItems: 'center',
  },
};

const Button = ({ text, color, textColor, fn, textSize, medium, style }) => (
  <TouchableOpacity
    onPress={fn}
    style={[
      styles.buttonStyle,
      { height: medium ? height / 11 : height / 14, backgroundColor: color },
      style,
    ]}
  >
    <Text style={{ color: textColor, fontSize: textSize }}>{text}</Text>
  </TouchableOpacity>
);

Button.defaultProps = {
  fn: null,
  color: '',
  textSize: null,
  textColor: '',
  style: {},
  medium: null,
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  fn: PropTypes.func,
  color: PropTypes.string,
  textSize: PropTypes.number,
  textColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  style: PropTypes.objectOf(PropTypes.object),
  medium: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default Button;
