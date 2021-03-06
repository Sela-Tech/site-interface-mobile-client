import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import Home from './screens/Home';
import Sites from './screens/Sites';
import AddSite from './screens/AddSite';
import AuthLoadingScreen from './screens/AuthLoading';

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

export const RootNavigator = createAppContainer(HomeSwitchNavigator);
