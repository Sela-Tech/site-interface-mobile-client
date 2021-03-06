import React, { Component } from 'react';
// import { Font } from 'expo';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import SplashScreen from './src/screens/SplashScreen';
import { RootNavigator } from './src/Navigator';
import ErrorHandler from './src/components/ErrorHandler';
import NavigationService from './src/services/NavigationService';
import store from './store';
import { WHITE } from './src/utils/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
});

export default class App extends Component {
  render() {
    return (
      <Provider store={store.store}>
        <ErrorHandler>
          <View style={styles.container}>
            <RootNavigator
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
          </View>
        </ErrorHandler>
      </Provider>
    );
  }
}
