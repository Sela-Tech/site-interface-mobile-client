import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './screens/Home';

export const RootStackNavigator = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null,
    },
  },
});

export const RootNavigator = createAppContainer(RootStackNavigator);
