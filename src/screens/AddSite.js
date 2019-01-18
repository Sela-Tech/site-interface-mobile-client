import React, { Component, Fragment } from 'react';
import { ScrollView, NetInfo, StyleSheet, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import { uploadSingleImage, addNewImage } from '../../actions/images';
import { uploadToAWS } from '../utils/api';
import Image from '../components/AddSite/Image';
import MainContent from '../components/AddSite/MainContent';


const options = {
  title: 'Upload Avatar',
  customButtons: [{ name: 'sela', title: 'Take Photo' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};


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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
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

  save = async () => {
    this.setState({ buttonLoading: true });
    const { newBox, siteName, isConnected, author, longitude, latitude } = this.state;
    const allImage = this.props && this.props.images && this.props.images.images;
    const allImages = allImage === null ? [] : allImage;
    const credentials = this.props && this.props.credentials && this.props.credentials.credentials;
    if (siteName === '') {
      this.setState({ buttonLoading: false });
      return alert('Enter site name.');
    }

    try {
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
          else {
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
        }
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
      }
    } catch (err) {
      this.setState({ buttonLoading: false, error: err.message });
    }
  };

  upload = async (data, allImage, credentials) => {
    return this.props
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
    this.takePicture();
  };

  takePicture = async () => {
    let { step } = this.state;
    step += 1;

    // Launch Camera:
    ImagePicker.launchCamera(options, (response) => {
      console.log('the- reps', response.uri);
      this.setState(prevState => ({
        step,
        fullScreen: true,
        openCamera: false,
        showImage: false,
        newBox: prevState.newBox.concat({
          uri: response.uri,
        }),
      }));
      this.props.navigation.setParams({ header: undefined });
      // Same code as in above section!
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
              <View />
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
