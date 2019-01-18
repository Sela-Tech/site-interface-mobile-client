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
import { addNewName } from '../../actions/name';
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
    justifyContent: 'center',
  },
  begContainer: {
    flex: 1,
    // justifyContent: 'center',
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

class Home extends Component {
  state = {
    name: '',
    loading: false,
  };

  saveName = async () => {
    this.setState({ loading: true });
    const { name } = this.state;
    const { addName } = this.props;
    try {
      const data = JSON.stringify({ name });
      await addName(data);
      this.props.navigation.navigate('Sites');
      this.setState({ loading: true });
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false,
      });
    }
  };

  render() {
    const { name, loading } = this.state;
    return (
      <DismissKeyboard>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <View style={styles.begContainer}>
            <Image source={require('../../assets/icon.png')} />
          </View>
          <View style={styles.otherContainer}>
            <View style={ExtStyle.align}>
              <B size={20}> Welcome. </B>
              <Text style={{ fontWeight: '400', fontSize: 18 }}> Enter your name to start</Text>
            </View>
            <View style={{ alignItems: 'center', margin: 10 }}>
              <View>
                <Input
                  value={name}
                  text="Your full name"
                  placeHolderColor="#696F74"
                  style={styles.inputStyle}
                  onChangeTheText={name => this.setState({ name })}
                />
              </View>
              <View style={{ marginTop: '5%' }}>
                <Button
                  text="Start"
                  color={YELLOW}
                  textColor={WHITE}
                  fn={() => this.saveName()}
                  loading={loading}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </DismissKeyboard>
    );
  }
}

const mapStateToProps = state => ({
  name: state.name,
});

const mapDispatchToProps = dispatch => ({
  addName: name => dispatch(addNewName(name)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
