import React, { Component, Fragment } from 'react';
import { StyleSheet, ScrollView, NetInfo } from 'react-native';
import { connect } from 'react-redux';
import { getAllImages, uploadSingleImage, addNewImage } from '../../actions/images';
import Spinner from '../components/Spinner';
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

class Sites extends Component {
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

  state = {
    loading: true,
    isConnected: true,
  };

  async componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    const { isConnected } = this.state;

    try {
      await this.props.getAllImages();
      const images = this.props.images && this.props.images.images;
      if (isConnected) {
        const imageQuery = images.map(async val => this.props.uploadSingleImage(val, images));
        await Promise.all(imageQuery);
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
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

  render() {
    const { loading } = this.state;
    const images = this.props.images && this.props.images.images;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {loading === true ? (
          <Spinner />
        ) : (
          <Fragment>
            <Box fn={() => this.props.navigation.navigate('AddSite')} />
            <Fragment>
              {this.props.images && this.props.images.images === null ? null : this.props.images &&
                this.props.images.images.length === 0 ? null : (
                  <Fragment>
                  {images.map((v, index) => (
                      <Box
                      fn={() => this.openCamera()}
                      key={index}
                      empty={(v && v.uri) !== ''}
                      imageSource={{ uri: v.uri }}
                      siteName={v.siteName}
                    />
                  ))}
                </Fragment>
              )}
            </Fragment>
          </Fragment>
        )}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  images: state.images,
});

const mapDispatchToProps = dispatch => ({
  uploadSingleImage: (data, images) => dispatch(uploadSingleImage(data, images)),
  getAllImages: () => dispatch(getAllImages()),
  addNewImage: data => dispatch(addNewImage(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sites);
