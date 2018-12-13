import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { getName } from '../../actions/name';
import Loading from '../components/Loading';
import { getCredentials, getAccessCredentials } from '../../actions/credentials';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class AuthLoading extends React.Component {
  async componentDidMount() {
    try {
      await this.getCredentials();
      await this.getKey();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  getCredentials = async () => {
    try {
      await this.props.getPassCredentials();
      if (this.props && this.props.credentials && this.props.credentials.credentials !== null) {
        return;
      } else if (this.props && this.props.credentials && this.props.credentials.credentials === '') {
        return await getAccessCredentials();
      } else {
        return await getAccessCredentials();
      }
    } catch (err) {
      return await getAccessCredentials();
    }
  }

  getKey = async () => {
    try {
      await this.props.getName();
      if (this.props && this.props.name && this.props.name.name !== null) {
        this.props.navigation.navigate('AppHome');
      } else if (this.props && this.props.name && this.props.name.name === '') {
        this.props.navigation.navigate('AuthHome');
      } else {
        this.props.navigation.navigate('AuthHome');
      }
    } catch (err) {
      this.props.navigation.navigate('AuthHome');
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
  name: state.name,
  credentials: state.credentials,
});

const mapDispatchToProps = dispatch => ({
  getName: () => dispatch(getName()),
  getPassCredentials: () => dispatch(getCredentials()),
  getAccessCredentials: () => dispatch(getAccessCredentials()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthLoading);
