import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import Box from '../components/Box';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    margin: 15,
    paddingBottom: '10%',
    justifyContent: 'space-between',
  },
});

export default class Sites extends Component {
  static navigationOptions = {
    title: 'SITES',
    headerTitleStyle: {
      textAlign: 'center',
      alignSelf: 'center',
      flex: 1,
    },
    headerStyle: {
      fontFamily: 'proximaNova',
      fontWeight: 'normal',
    },
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* <View style={{ flex: 1 }}> */}
        <Box fn={() => this.props.navigation.navigate('AddSite')} />
        <Box empty siteName="Abuja" imageSource={require('../../assets/road.jpeg')} />
        <Box empty siteName="Abuja" imageSource={require('../../assets/house.png')} />
        <Box empty siteName="Abuja" imageSource={require('../../assets/road.jpeg')} />
        <Box empty imageSource={require('../../assets/house.png')} />
        <Box empty siteName="Abuja" imageSource={require('../../assets/house.png')} />
        <Box empty siteName="Abuja" imageSource={require('../../assets/road.jpeg')} />
        <Box empty imageSource={require('../../assets/house.png')} />
        <Box empty siteName="Abuja" imageSource={require('../../assets/house.png')} />
        <Box empty siteName="Abuja" imageSource={require('../../assets/road.jpeg')} />
        <Box empty imageSource={require('../../assets/house.png')} />
        {/* </View> */}
      </ScrollView>
    );
  }
}
