import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { getCredentials } from '../../actions/credentials';
import Loading from '../components/Loading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class AuthLoading extends React.Component {
  async componentDidMount() {
    try {
      // await AsyncStorage.removeItem('credentials');
      // await AsyncStorage.removeItem('name');
      await this.getKey();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  getKey = async () => {
    try {
      await this.props.getPassCredentials();
      if (this.props && this.props.credentials && this.props.credentials.credentials !== null) {
        this.props.navigation.navigate('App');
      } else if (this.props && this.props.credentials && this.props.credentials.credentials === '') {
        this.props.navigation.navigate('Auth');
      } else {
        this.props.navigation.navigate('Auth');
      }
    } catch (err) {
      this.props.navigation.navigate('Auth');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  credentials: state.credentials,
});

const mapDispatchToProps = dispatch => ({
  getPassCredentials: () => dispatch(getCredentials()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthLoading);
