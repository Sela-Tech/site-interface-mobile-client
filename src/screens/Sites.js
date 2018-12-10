import React, { Component, Fragment } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { getAllImages } from '../../actions/images';
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
  }

  async componentWillMount() {
    this.setState()
    try {
      await this.props.getAllImages();
      console.log('this.props');
      this.setState({ loading: false });
    }
    catch (err) {
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {
          loading === true ? (
            <Spinner />
          ) :
            (
              <Fragment>
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
              </Fragment>
            )
        }
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  images: state.images,
});

const mapDispatchToProps = dispatch => ({
  getAllImages: () => dispatch(getAllImages()),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sites);