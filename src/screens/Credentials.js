import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { getAccessCredentials } from '../../actions/credentials';
import DismissKeyboard from '../components/DismissKeyboard';
import Text from '../components/Text';
import B from '../components/BoldText';
import Button from '../components/Button';
import Input from '../components/Input';
import { YELLOW, WHITE } from '../utils/constants';
import ExtStyle from '../utils/styles';
import { isAndroid } from '../utils/helpers';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  begContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: isAndroid ? '25%' : '15%',
  },
  otherContainer: {
    flex: 2,
    alignItems: 'center',
    margin: 15,
  },
  inputStyle: {
    borderColor: '#696f74',
    height: height / 14,
  },
});

class Credentials extends Component {
  state = {
    password: '',
    loading: false,
  };

  saveCredentials = async () => {
    this.setState({ loading: true });
    const { password } = this.state;
    const { getAccessCredentials } = this.props;
    try {
      const data = {
        name: 'aws',
        password: this.state.password,
      };
      const resp = await getAccessCredentials(data);
      this.setState({ loading: false });
      if (resp === 200) {
        this.props.navigation.navigate('App');
      } else {
        alert('Wrong password');
      }
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false,
      });
    }
  };

  render() {
    const { password, loading } = this.state;
    return (
      <DismissKeyboard>
        <ScrollView contentContainerStyle={styles.container}>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.begContainer}>
              <Image source={require('../../assets/icon.png')} />
            </View>
            <View style={styles.otherContainer}>
              <View style={ExtStyle.align}>
                <B size={20}> Welcome. </B>
                <Text style={{ fontWeight: '400', fontSize: 18 }}>
                  {' '}
                  Enter your password to start
                </Text>
              </View>
              <View style={{ alignItems: 'center', margin: 10 }}>
                <View>
                  <Input
                    value={password}
                    text="Password"
                    secure
                    placeHolderColor="#696F74"
                    style={styles.inputStyle}
                    onChangeTheText={password => this.setState({ password })}
                  />
                </View>
                <View style={{ marginTop: '5%' }}>
                  <Button
                    text="Start"
                    color={YELLOW}
                    textColor={WHITE}
                    fn={() => this.saveCredentials()}
                    loading={loading}
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </DismissKeyboard>
    );
  }
}

const mapStateToProps = state => ({
  credentials: state.credentials,
});

const mapDispatchToProps = dispatch => ({
  getAccessCredentials: data => dispatch(getAccessCredentials(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Credentials);
