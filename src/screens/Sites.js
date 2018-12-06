import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Box from '../components/Box';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        margin: 15,
        // marginTop: 5,
        // alignItems: 'flex-start',
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
            <ScrollView
                contentContainerStyle={styles.container}>
                <Box />
                <Box
                    empty
                    siteName="Abuja"
                    imageSource={require('../../assets/road.jpeg')}
                />
                <Box
                    empty
                    siteName="Abuja"
                    imageSource={require('../../assets/house.png')}
                />
                <Box
                    empty
                    siteName="Abuja"
                    imageSource={require('../../assets/road.jpeg')}
                />
                <Box
                    empty
                    imageSource={require('../../assets/house.png')}
                />
            </ScrollView>
        )
    }
}