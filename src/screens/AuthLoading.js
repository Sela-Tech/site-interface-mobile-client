import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { getName } from '../../actions/name';
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
      await this.props.getName();
      if (this.props && this.props.name && this.props.name.name !== '') {
        this.props.navigation.navigate('App');
      }
      else {
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
};

const mapStateToProps = state => ({
  name: state.name,
});

const mapDispatchToProps = dispatch => ({
  getName: () => dispatch(getName()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthLoading);

