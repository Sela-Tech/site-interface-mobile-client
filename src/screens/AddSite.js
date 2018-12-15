import React, { Component, Fragment } from 'react';
import { ScrollView, NetInfo, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Location, Permissions, Camera } from 'expo';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons'; // eslint-disable-line
import { uploadSingleImage, addNewImage } from '../../actions/images';
import { uploadToAWS } from '../utils/api';
import Image from '../components/AddSite/Image';
// import OpenCamera from '../components/AddSite/OpenCamera';
import MainContent from '../components/AddSite/MainContent';



const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bottomBar: {
    paddingBottom: 5,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 0.12,
    flexDirection: 'row',
  },
});
class AddSite extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: navigation.getParam('header', undefined),
  });

  constructor(props) {
    super(props);

    this.state = {
      author: JSON.parse(this.props && this.props.name && this.props.name.name).name,
      isConnected: true,
      siteName: '',
      buttonLoading: false,
      step: 0,
      flash: 'off',
      autoFocus: 'on',
      showImage: false,
      fullScreen: true,
      newBox: [
        {
          uri: '',
          name: '',
        },
      ],
      // singleImageUri: '',
    };
  }

  async componentWillMount() {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ permissionsGranted: status === 'granted' });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      // https://github.com/expo/expo/issues/946
      return Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        timeout: 20000, // , maximumAge: 10000,
      })
        .then(res => res)
        .catch(err => false);
    }
    return false;
  };

  save = async () => {
    this.setState({ buttonLoading: true });
    const { newBox, siteName, isConnected, author } = this.state;
    const allImage = this.props && this.props.images && this.props.images.images;
    const allImages = allImage === null ? [] : allImage;
    const credentials = this.props && this.props.credentials && this.props.credentials.credentials;

    if (siteName === '') {
      this.setState({ buttonLoading: false });
      return alert('Enter site name.');
    }

    try {
      const status = await this.getLocationAsync();
      if (status === false) {
        this.setState({ buttonLoading: false });
        return alert('location access denied,turn on your Location.');
      }

      const { longitude, latitude } = status.coords;
      const data = newBox.filter(v => v.uri !== '');

      data.map(d => {
        const imageName = d.uri.split('/');
        d.author = author;
        d.site_name = siteName;
        d.evidence_name = imageName[imageName.length - 1];
        d.longitude = longitude;
        d.latitude = latitude;
        return d;
      });

      if (isConnected === false) {
        this.failedToUpload(allImages, data);
      } else {
        if (data.length > 1) {
          const imagesArray = data.map(async c => {
            c.type = 'image/png';
            await uploadToAWS(c, null, credentials);
            // const resp = await uploadToAWS(c, null, credentials);
            // if (resp === false) {
            //   return await this.failedToUpload(allImages, c);
            // }
            // return resp;
          });

          let images = await Promise.all(imagesArray);
          console.log('imahee', images)
          images = images.map(c => c.postResponse.location);
          data[0].images = images;
        }

        this.props
          .uploadSingleImage(data[0], allImages, credentials)
          .then(async resp => {
            if (resp.message === 'Saved Successfully.') {
              alert('saved');
              this.setState({ buttonLoading: false });
              this.props.navigation.navigate('Sites');
            } else {
              await this.failedToUpload(allImages, data);
            }
          })
          .catch(async err => {
            await this.failedToUpload(allImages, data);
          });
      }
    } catch (err) {
      this.setState({ buttonLoading: false, error: err.message });
    }
  };

  failedToUpload = async (images, data) => {
    if (images === null) {
      images = [];
    }
    await this.props.addNewImage(images.concat(data));
    this.setState({ buttonLoading: false });
    return this.props.navigation.navigate('Sites');
  };

  openCamera = () => {
    this.setState({ openCamera: true, fullScreen: false });
    this.props.navigation.setParams({ header: null });
  };

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
          fullScreen: true,
          openCamera: false,
          showImage: false,
          newBox: prevState.newBox.concat({
            uri: photo.uri,
          }),
        }));
        this.props.navigation.setParams({ header: undefined });
      } catch (error) {
        this.setState({ error: error.message });
      }
    } else {
      this.setState({
        error: 'Request failed',
      });
    }
  };

  toggleSingleImage = () => {
    this.setState(
      prevState => ({ showImage: !prevState.showImage, fullScreen: true }),
      () => {
        if (this.state.fullScreen) {
          this.props.navigation.setParams({ header: undefined });
        } else {
          this.props.navigation.setParams({ header: null });
        }
      },
    );
  };

  deleteImage = uri => {
    this.toggleSingleImage();
    this.setState(prevState => ({ newBox: prevState.newBox.filter(v => v.uri !== uri) }));
  };

  showImage = uri => {
    this.setState(
      prevState => ({
        fullScreen: false,
        singleImageUri: uri,
        showImage: !prevState.showImage,
      }),
      () => {
        if (this.state.showImage) {
          this.props.navigation.setParams({ header: null });
        } else {
          this.props.navigation.setParams({ header: undefined });
        }
      },
    );
  };

  renderTopBar = () => <View style={styles.topBar} />;

  renderBottomBar = () => {
    const { openCamera } = this.state;
    return (
      <View style={styles.bottomBar}>
        <View style={{ flex: 0.4 }}>
          <TouchableOpacity onPress={() => this.takePicture()} style={{ alignSelf: 'center' }}>
            <Fragment>
              <Ionicons name="ios-radio-button-on" size={70} color={!openCamera ? 'white' : 'red'} />
            </Fragment>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const {
      buttonLoading,
      siteName,
      openCamera,
      type,
      flash,
      autoFocus,
      newBox,
      fullScreen,
      showImage,
      singleImageUri,
      cameraRef,
    } = this.state;
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={
          fullScreen
            ? {
              flexGrow: 1,
              marginHorizontal: '5%',
              justifyContent: 'space-around',
            }
            : { flexGrow: 1 }
        }
      >
        <Fragment>
          {showImage ? (
            <Image
              fn={() => this.toggleSingleImage()}
              filterFn={() => this.deleteImage(singleImageUri)}
              imageSource={{ uri: singleImageUri }}
            />
          ) : openCamera ? (
            <Fragment>
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
            </Fragment>
          ) : (
                <MainContent
                  siteName={siteName}
                  newBox={newBox}
                  updateText={siteName => this.setState({ siteName })}
                  buttonLoading={buttonLoading}
                  fn={() => this.save()}
                  openCamera={() => this.openCamera()}
                  showImage={this.showImage}
                />
              )}
        </Fragment>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  name: state.name,
  images: state.images,
  credentials: state.credentials,
});

const mapDispatchToProps = dispatch => ({
  uploadSingleImage: (data, images, credentials) =>
    dispatch(uploadSingleImage(data, images, credentials)),
  addNewImage: data => dispatch(addNewImage(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddSite);
