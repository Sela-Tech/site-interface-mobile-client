import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Loading from '../components/Loading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class AuthLoading extends React.Component {
  async componentDidMount() {
    try {
      await this.getKey();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  getKey = async () => {
    try {
      const name = 'linux';
      this.props.navigation.navigate(name !== null ? 'App' : 'Auth');
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

export default AuthLoading;
