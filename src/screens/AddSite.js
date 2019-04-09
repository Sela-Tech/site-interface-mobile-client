import React, { Component, Fragment } from 'react';
import { ScrollView, NetInfo, AppState, Linking } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import AndroidOpenSettings from 'react-native-android-open-settings';
import { connect } from 'react-redux';
import { uploadSingleImage, addNewImage } from '../../actions/images';
import { uploadToAWS } from '../utils/api';
import { isAndroid } from '../utils/helpers';
import Image from '../components/AddSite/Image';
import MainContent from '../components/AddSite/MainContent';

const options = {
  title: 'Take Picture',
  customButtons: [{ name: 'sela', title: 'Choose Photo ' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

// var options = { quality: 0.5 };
// const options = {
//   title: 'Upload Avatar',
//   customButtons: [{ name: 'sela', title: 'Take Photo' }],
//   storageOptions: {
//     skipBackup: true,
//     path: 'images',
//   },
// };

class AddSite extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: navigation.getParam('header', undefined),
  });

  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState,
      author: JSON.parse(this.props && this.props.name && this.props.name.name).name,
      isConnected: true,
      siteName: '',
      width: '',
      depth: '',
      length: '',
      buttonLoading: false,
      step: 0,
      flash: 'off',
      autoFocus: 'on',
      showImage: false,
      fullScreen: true,
      unit: 'kilometer',
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
    // AppState.addEventListener('change', this.handleAppStateChange);
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    AppState.addEventListener('change', this.handleAppStateChange);

    try {
      await this.getLocation();
    } catch (err) {
      this.setState({ message: err.message });
    }
  }

  getLocation = () =>
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      error => {
        console.log('fkkd', error.message);
        if (error.message !== 'Location request timed out') {
          // Open location source settings menu
          AndroidOpenSettings.locationSourceSettings();
          this.setState({ error: error.message });
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

  async componentDidMount() {
    // NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    // AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = async nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      await this.getLocation();
      // console.log('App has come to the foreground!');
    }
    this.setState({ appState: nextAppState });
  };

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  openSettings = () => {
    if (isAndroid) {
    } else {
      Linking.openURL('app-settings:');
    }
  };

  save = async val => {
    const {
      newBox,
      siteName,
      length,
      width,
      depth,
      isConnected,
      author,
      longitude,
      unit,
      latitude,
    } = this.state;
    const allImage = this.props && this.props.images && this.props.images.images;
    const allImages = allImage === null ? [] : allImage;
    const credentials = this.props && this.props.credentials && this.props.credentials.credentials;

    const checkIfImageIsEmpty = newBox.filter(v => v.uri !== '');

    if (siteName === '') {
      this.setState({ buttonLoading: false });
      return alert('Enter site name.');
    }

    if (checkIfImageIsEmpty.length === 0) {
      return alert('Upload Image');
    }

    try {
      const data = newBox.filter(v => v.uri !== '');

      data.map(d => {
        const imageName = d.uri.split('/');
        d.author = author;
        d.site_name = siteName;
        d.evidence_name =
          Math.floor(Math.random() * Math.floor(1000)) + imageName[imageName.length - 1];
        d.longitude = longitude;
        d.latitude = latitude;
        d.length = length;
        d.depth = depth;
        d.width = width;
        d.unit = unit;
        return d;
      });

      if (val) {
        return this.failedToUpload(allImages, data);
      }

      this.setState({ buttonLoading: true });
      //if no internet persist the information
      if (isConnected === false) {
        this.failedToUpload(allImages, data);
      }
      //Bulk image upload 
      else if (data.length > 1) {
        const imagesArray = data.map(async c => {
          c.type = 'image/png';
          c.name = c.evidence_name;
          const resp = await uploadToAWS(c, null, credentials);
          if (resp === false) {
            await this.failedToUpload(allImages, [c]);
            return false;
          }
          return resp;
        });

        let images = await Promise.all(imagesArray);
        images = images.filter(c => c !== false).map(c => c.postResponse.location);
        if (images.length === 0) {
          this.setState({ buttonLoading: false });
          return this.props.navigation.navigate('Sites');
        }

        data[0].images = images;
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
      // Upload single Image
      else {
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

  upload = async (data, allImage, credentials) =>
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

  failedToUpload = async (images, data) => {
    if (images === null) {
      images = [];
    }
    await this.props.addNewImage(images.concat(data));
    this.setState({ buttonLoading: false });
    return this.props.navigation.navigate('Sites');
  };

  takePicture = async () => {
    let { step } = this.state;
    step += 1;
    // Launch Camera:
    ImagePicker.launchCamera(options, response => {
      this.setState(prevState => ({
        step,
        // fullScreen: true,
        // openCamera: false,
        showImage: false,
        newBox: prevState.newBox.concat({
          uri: response.uri,
        }),
      }));
      this.props.navigation.setParams({ header: undefined });
    });
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

  render() {
    const {
      buttonLoading,
      siteName,
      width,
      length,
      depth,
      openCamera,
      unit,
      newBox,
      fullScreen,
      showImage,
      singleImageUri,
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
          ) : (
              <MainContent
                siteName={siteName}
                width={width}
                depth={depth}
                length={length}
                unit={unit}
                newBox={newBox}
                updateUnit={unit => this.setState({ unit })}
                updateLength={length => this.setState({ length })}
                updateDepth={depth => this.setState({ depth })}
                updateWidth={width => this.setState({ width })}
                updateText={siteName => this.setState({ siteName })}
                buttonLoading={buttonLoading}
                fn={() => this.save()}
                offline={() => this.save('val')}
                openCamera={() => this.takePicture()}
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
