import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';
import Button from './Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Image = ({ style, imageSource }) => (
  <ImageBackground style={(styles.container, style)} source={imageSource}
  >
    <View>
      <Button text="Delete" />
    </View>
  </ImageBackground>
);

export default Image;
