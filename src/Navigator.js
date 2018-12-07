import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import Home from './screens/Home';
import Sites from './screens/Sites';
import AddSite from './screens/AddSite';
import AuthLoadingScreen from './screens/AuthLoading';

export const AppRootNavigator = createStackNavigator({

  Home: {
    screen: Home,
    navigationOptions: {
      header: null,
    },
  },
  Sites: {
    screen: Sites,
  },
  AddSite: {
    screen: AddSite,
  },
});

export const AppNavigator = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null,
    },
  },
});

export const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppRootNavigator,
    Auth: AppNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);
export const RootNavigator = createAppContainer(SwitchNavigator);
