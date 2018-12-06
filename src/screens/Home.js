import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Text from '../components/Text';
import B from '../components/BoldText';
import Button from '../components/Button';
import Input from '../components/Input';
import { YELLOW, WHITE } from '../utils/constants';
import ExtStyle from '../utils/styles';
import { isAndroid } from '../utils/helpers';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  begContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: isAndroid ? '25%' : '15%',
  },
  otherContainer: {
    flex: 2,
    alignItems: 'center',
    margin: 15,
  },
  button: {
    width: width / 2.2,
  },
  inputStyle: {
    borderColor: '#696f74',
    height: height / 14,
  },
});

export default class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.begContainer}>
          <Image source={require('../../assets/icon.png')} />
        </View>
        <View style={styles.otherContainer}>
          <View style={ExtStyle.align}>
            <B size={20}> Welcome. </B>
            <Text style={{ fontWeight: '400', fontSize: 18 }}>
              {' '}
              Enter your name to start
            </Text>
          </View>
          <View style={{ alignItems: 'center', margin: 10 }}>
            <View>
              <Input
                text="Your full name"
                placeHolderColor="#696F74"
                style={styles.inputStyle}
              />
            </View>
            <View style={{ marginTop: '5%' }}>
              <Button
                text="Start"
                color={YELLOW}
                textColor={WHITE}
                style={styles.button}
                fn={() => this.props.navigation.navigate('CreateHome')}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
