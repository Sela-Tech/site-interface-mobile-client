import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Text from './Text';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    height: height / 5,
    width: width / 2.3,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 15,
    borderStyle: 'dotted',
    borderWidth: 1,
    // alignItems: 'center',
    borderColor: '#F2994A',
  },
  imageBack: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  text: {
    position: 'absolute',
    bottom: 30,
    left: 30,
  },
});

const Box = ({ empty, siteName, imageSource, fn, text }) => (
  <TouchableOpacity style={styles.container} onPress={empty ? console.log('') : fn}>
    {empty ? (
      <View>
        <ImageBackground style={styles.imageBack} source={imageSource}>
          <View style={styles.text}>
            <Text style={{ fontSize: 20 }}>{siteName}</Text>
          </View>
        </ImageBackground>
      </View>
    ) : (
        <View style={(styles.empty, { alignItems: 'center', borderColor: '#F2994A' })}>
          <View style={{ justifyContent: 'center' }}>
            <Image source={require('../../assets/plus.png')} style={{ tintColor: '#696f74' }} />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text> {text ? text : 'Add New Site'} </Text>
          </View>
        </View>
      )}
  </TouchableOpacity>
);

Box.defaultProps = {
  empty: null,
  siteName: '',
  imageSource: '',
  fn: null,
};

Box.propTypes = {
  empty: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  siteName: PropTypes.string,
  imageSource: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  fn: PropTypes.func,
};

export default Box;
