import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './screens/Home';
import Sites from './screens/Sites';
import AddSite from './screens/AddSite';

export const RootStackNavigator = createStackNavigator({
  // AddSite: {
  //   screen: AddSite,
  // },
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

export const RootNavigator = createAppContainer(RootStackNavigator);
