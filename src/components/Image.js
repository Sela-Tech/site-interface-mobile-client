import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';
import BackButton from './BackButton';
import Button from './Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  secondContainer: {
    alignItems: 'center',
    flex: 1
  },
  upButton: {
    marginTop: 20,
    marginLeft: 15,
  },
  belowButton: {
    position: 'absolute',
    bottom: 10,
  },
});

const Image = ({ fn, imageSource, filterFn }) => (
  <ImageBackground style={styles.container}
    source={imageSource}
  >
    <View style={styles.upButton}>
      <BackButton
        fn={fn}
      />
    </View>
    <View style={styles.secondContainer}>
      <View style={styles.belowButton}>
        <Button
          text="Delete"
          fn={filterFn}
        />
      </View>
    </View>
  </ImageBackground>
);

export default Image;
