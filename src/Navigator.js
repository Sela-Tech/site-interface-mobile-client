import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './screens/Home';
import Sites from './screens/Sites';

export const RootStackNavigator = createStackNavigator({
  Sites: {
    screen: Sites,
  },
  Home: {
    screen: Home,
    navigationOptions: {
      header: null,
    },
  },
});

export const RootNavigator = createAppContainer(RootStackNavigator);
