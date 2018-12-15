import React, { Fragment } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Camera } from 'expo';
import { Ionicons } from '@expo/vector-icons'; // eslint-disable-line

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bottomBar: {
    paddingBottom: 5,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 0.12,
    flexDirection: 'row',
  },
});

const renderTopBar = () => <View style={styles.topBar} />;

const renderBottomBar = (openCamera, fn) => (
  <View style={styles.bottomBar}>
    <View style={{ flex: 0.4 }}>
      <TouchableOpacity onPress={fn} style={{ alignSelf: 'center' }}>
        <Fragment>
          <Ionicons name="ios-radio-button-on" size={70} color={!openCamera ? 'white' : 'red'} />
        </Fragment>
      </TouchableOpacity>
    </View>
  </View>
);

const openCamera = ({ cameraRef, type, flash, autoFocus, openCamera, fn }) => (
  <Fragment>
    <Camera
      ref={cameraRef}
      type={type}
      flashMode={flash}
      autoFocus={autoFocus}
      style={styles.camera}
    >
      {renderTopBar()}
      {renderBottomBar(openCamera, fn)}
    </Camera>
  </Fragment>
);

openCamera.defaultProps = {
  // cameraRef: {},
  type: '',
  flash: '',
  autoFocus: '',
  openCamera: false,
  fn: () => {},
};

openCamera.propTypes = {
  type: PropTypes.string,
  flash: PropTypes.string,
  autoFocus: PropTypes.string,
  openCamera: PropTypes.bool,
  fn: PropTypes.func,
};

export default openCamera;
