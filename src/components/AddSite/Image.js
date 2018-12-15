import React from 'react';
import { ImageBackground, View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import BackButton from '../BackButton';
import Button from '../Button';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  secondContainer: {
    alignItems: 'center',
    flex: 1,
  },
  upButton: {
    marginTop: 20,
    marginLeft: 15,
  },
  button: {
    width: width / 1.1,
  },
  belowButton: {
    position: 'absolute',
    bottom: 10,
  },
});

const Image = ({ fn, filterFn, imageSource }) => (
  <ImageBackground style={styles.container} source={imageSource}>
    <View style={styles.upButton}>
      <BackButton fn={fn} />
    </View>
    <View style={styles.secondContainer}>
      <View style={styles.belowButton}>
        <Button text="Delete" fn={filterFn} style={styles.button} />
      </View>
    </View>
  </ImageBackground>
);

Image.defaultProps = {
  fn: null,
  imageSource: '',
  filterFn: () => {},
};
Image.propTypes = {
  fn: PropTypes.func,
  imageSource: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  filterFn: PropTypes.func,
};

export default Image;
