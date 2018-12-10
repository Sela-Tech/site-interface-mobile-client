import React, { Component, Fragment } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Location, Permissions, Camera, Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons'; // eslint-disable-line
import Text from '../components/Text';
import Input from '../components/Input';
import Box from '../components/Box';
import Button from '../components/Button';
import { YELLOW } from '../utils/constants';
import * as API from '../utils/api';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginHorizontal: '5%',
    justifyContent: 'space-around',
  },
  inputStyle: {
    borderColor: '#696f74',
    height: height / 14,
    width: width / 1.12,
  },
  image: {
    flexGrow: 4,
    flexWrap: 'wrap',
    flexDirection: 'row',
    // margin: 15,
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
  state = {
    siteName: '',
    buttonLoading: false,
    step: 0,
    flash: 'off',
    autoFocus: 'on',
    newBox: [
      {
        uri: '',
        name: '',
      },
    ],
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
    const { newBox, siteName } = this.state;
    try {
      const status = await this.getLocationAsync();
      if (status === false) {
        return alert('location access denied');
      }
      const { longitude, latitude } = status.coords;
      let data = newBox.filter(v => v.uri !== '');

      data.map(d => {
        const imageName = d.uri.split('/');
        d.author = 'david';
        d.site_name = siteName;
        d.evidence_name = imageName[imageName.length - 1];
        d.longitude = longitude;
        d.latitude = latitude;
        return d;
      });

      this.setState({
        longitude,
        latitude,
        data,
        buttonLoading: false,
      });
      console.log('dataaaa', data)
      try {
        const resp = await API.upload(data[0]);
        if (resp.data.message === 'Saved Successfully') {
          this.props.navigation.navigate('Home');
        }
        else {
          console.log('failed');
        }
      }
      catch (err) {
        console.log('err', err.message);
        this.setState({ err: err.message });
      }
    } catch (err) {
      console.log('err', err.message);
      this.setState({ buttonLoading: false, error: err.message });
    }
  };

  openCamera = () => this.setState({ openCamera: true });

  takePicture = async () => {
    let { step } = this.state;
    step += 1;

    if (this.camera) {
      try {
        const photo = await this.camera.takePictureAsync({
          skipProcessing: true,
        });


        this.setState(prevState => ({
          step,
          openCamera: false,
          newBox: prevState.newBox.concat({
            uri: photo.uri,
          }),
        }));
      } catch (error) {
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
    const { buttonLoading, siteName, openCamera, type, flash, autoFocus, newBox } = this.state;
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
              <View style={{ paddingTop: '5%', flex: 1 }}>
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
                  {newBox.map((v, index) => (
                    <Box
                      fn={() => this.openCamera()}
                      key={index}
                      empty={(v && v.uri) !== ''}
                      imageSource={{ uri: v.uri }}
                    />
                  ))}
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
