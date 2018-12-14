import React from 'react';
import { View, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height / 14,
    width: height / 14,
    borderRadius: 7,
    marginTop: 20,
    marginLeft: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    elevation: 6,
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 10,
      width: 10,
    },
  },
  icon: {
    height: 24,
    width: 24,
  },
});

export default ({ fn }) => (
  <View style={styles.container}>
    <TouchableOpacity
      onPress={fn}>
      <Image
        style={styles.icon}
        source={require('../../assets/BACK.png')}
      />
    </TouchableOpacity>
  </View>
);
