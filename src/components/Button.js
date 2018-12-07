import React from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Text from './Text';
import Spinner from './Spinner';
import { YELLOW, WHITE } from '../utils/constants';

const { height, width } = Dimensions.get('window');
const styles = {
  buttonStyle: {
    justifyContent: 'center',
    width: width / 1.3,
    borderRadius: 5,
    alignItems: 'center',
  },
};

const Button = ({ text, color, textColor, fn, textSize, medium, style, loading }) => (
  <TouchableOpacity
    onPress={fn}
    style={[
      styles.buttonStyle,
      {
        height: medium ? height / 11 : height / 14,
        backgroundColor: color,
      },
      style,
    ]}
  >
    {loading ? (
      <Spinner color={WHITE} size="small" />
    ) : (
      <Text style={{ color: textColor, fontSize: textSize }}>{text}</Text>
    )}
  </TouchableOpacity>
);

Button.defaultProps = {
  fn: () => {},
  color: YELLOW,
  textSize: null,
  textColor: null,
  style: null,
  loading: false,
  medium: null,
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  fn: PropTypes.func,
  loading: PropTypes.bool,
  color: PropTypes.string,
  textSize: PropTypes.number,
  textColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  style: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  medium: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default Button;
