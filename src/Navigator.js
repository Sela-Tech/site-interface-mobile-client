import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import Home from './screens/Home';
import Sites from './screens/Sites';
import AddSite from './screens/AddSite';
import Credentials from './screens/Credentials';
import AuthLoadingScreen from './screens/AuthLoading';
import CredLoadingScreen from './screens/CredLoading';

export const AppRootNavigator = createStackNavigator({
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

export const CredNavigator = createStackNavigator({
  Home: {
    screen: Credentials,
    navigationOptions: {
      header: null,
    },
  },
});

export const HomeSwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    AppHome: AppRootNavigator,
    AuthHome: AppNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export const MainSwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: CredLoadingScreen,
    App: HomeSwitchNavigator,
    Auth: CredNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export const RootNavigator = createAppContainer(MainSwitchNavigator);
