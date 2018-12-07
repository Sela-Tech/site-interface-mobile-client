import React, { Component, Fragment } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Location, Permissions, Camera, Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons'; // eslint-disable-line
import Text from '../components/Text';
import Input from '../components/Input';
import Box from '../components/Box';
import Button from '../components/Button';
import { YELLOW } from '../utils/constants';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  inputStyle: {
    borderColor: '#696f74',
    height: height / 14,
  },
  image: {
    flexGrow: 4,
    flexWrap: 'wrap',
    flexDirection: 'row',
    margin: 15,
    justifyContent: 'space-between',
  },
  button: {
    width: width / 1.1,
  },
  bottomBar: {
    paddingBottom: 5,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 0.12,
    flexDirection: 'row',
  },
  topBar: {
    flex: 0.2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Constants.statusBarHeight / 2,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '5%',
  },
});

export default class AddSite extends Component {
  static navigationOptions = {
    // title: 'Add New Site',
    // headerTitleStyle: {
    //   textAlign: 'center',
    //   alignSelf: 'center',
    //   flex: 1,
    // },
    // headerStyle: {
    //   fontFamily: 'proximaNova',
    //   fontWeight: 'normal',
    // },
  };

  state = {
    siteName: '',
    buttonLoading: false,
    step: 0,
    flash: 'off',
    autoFocus: 'on',
  };

  async componentWillMount() {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      console.log('status', status);
      this.setState({ permissionsGranted: status === 'granted' });
    } catch (error) {
      console.log('err', error.message);
      this.setState({ error: error.message });
    }
  }

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      return Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
    }
    return false;
  };

  save = async () => {
    this.setState({ buttonLoading: true });
    try {
      const status = await this.getLocationAsync();
      console.log('status', status);
      if (status === false) {
        return alert('location access denied');
      }
      const { longitude, latitude } = status.coords;
      this.setState({
        longitude,
        latitude,
        buttonLoading: false,
      });

      console.log('this', this.state);
    } catch (err) {
      console.log('err', err.message);
      this.setState({ buttonLoading: false, error: err.message });
    }
  };

  openCamera = () => this.setState({ openCamera: true });

  takePicture = async () => {
    // console.log('ashhshshh')
    // this.setState({ openCamera: true });
    let { step } = this.state;
    step += 1;

    if (this.camera) {
      try {
        const photo = await this.camera.takePictureAsync({
          skipProcessing: true,
        });

        console.log('the photo', photo);
        this.setState({
          step,
          openCamera: false,
        });
      } catch (error) {
        console.log(error.message);
        this.setState({ error: error.message });
      }
    } else {
      this.setState({
        error: 'Request failed',
      });
    }
  };

  renderTopBar = () => <View style={styles.topBar} />;

  renderBottomBar = () => {
    const { openCamera } = this.state;
    return (
      <View style={styles.bottomBar}>
        <View style={{ flex: 0.4 }}>
          <TouchableOpacity onPress={() => this.takePicture()} style={{ alignSelf: 'center' }}>
            <Fragment>
              <Ionicons
                name="ios-radio-button-on"
                size={70}
                color={!openCamera ? 'white' : 'red'}
              />
            </Fragment>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const { buttonLoading, siteName, openCamera, type, flash, autoFocus } = this.state;
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        {openCamera ? (
          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            type={type}
            flashMode={flash}
            autoFocus={autoFocus}
            style={styles.camera}
          >
            {this.renderTopBar()}
            {this.renderBottomBar()}
          </Camera>
        ) : (
          <Fragment>
            <View style={{ paddingTop: '5%', marginLeft: '3%', flex: 1 }}>
              <View>
                <Text style={{ fontSize: 20 }}>Site Name</Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <Input
                  value={siteName}
                  text="What is the name of the site"
                  placeHolderColor="#696F74"
                  style={styles.inputStyle}
                  onChangeTheText={siteName => this.setState({ siteName })}
                />
              </View>
              <View style={styles.image}>
                <Box fn={() => this.openCamera()} />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
              </View>

              <View>
                <View style={styles.bottom}>
                  <View>
                    <Button
                      text="SAVE"
                      color={YELLOW}
                      style={styles.button}
                      fn={() => this.save()}
                      loading={buttonLoading}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Fragment>
        )}
      </ScrollView>
    );
  }
}
