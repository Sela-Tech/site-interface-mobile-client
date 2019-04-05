import React, { Fragment } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text';
import Input from '../Input';
import Box from '../Box';
import Button from '../Button';
import { YELLOW } from '../../utils/constants';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  inputStyle: {
    borderColor: '#696f74',
    height: height / 14,
    width: width / 1.12,
  },
  inputStyle2: {
    borderColor: '#696f74',
    height: height / 14,
    width: width / 4
    // width: width / 1.12,
  },
  button: {
    width: width / 1.1,
  },
  image: {
    flexGrow: 4,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '5%',
  },
});

const MainContent = ({
  siteName,
  newBox,
  buttonLoading,
  fn,
  openCamera,
  showImage,
  updateText,
  updateDepth,
  updateLength,
  updateWidth,
  length,
  width,
  depth,
}) => (
    <Fragment>
      <View style={{ paddingTop: '5%', flex: 1 }}>
        <View>
          <View>
            <Text style={{ fontSize: 20 }}>Site Name</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Input
              value={siteName}
              text="What is the name of the site"
              placeHolderColor="#696F74"
              style={styles.inputStyle}
              onChangeTheText={updateText}
            />
          </View>
        </View>


        <View style={{ justifyContent: 'space-between', width: '100%', flexDirection: 'row' }}>
          <View style={{ marginTop: 10 }}>
            <Input
              value={length}
              text="Length"
              placeHolderColor="#696F74"
              style={styles.inputStyle2}
              onChangeTheText={updateLength}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Input
              value={width}
              text="Width"
              placeHolderColor="#696F74"
              style={styles.inputStyle2}
              onChangeTheText={updateWidth}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Input
              value={depth}
              text="Depth"
              placeHolderColor="#696F74"
              style={styles.inputStyle2}
              onChangeTheText={updateDepth}
            />
          </View>
        </View>
        {/* </View> */}


        <View style={styles.image}>
          {newBox.map((v, index) => (
            <Box
              fn={(v && v.uri) === '' ? openCamera : () => showImage(v.uri)}
              key={index}
              text="Add new picture"
              empty={(v && v.uri) !== ''}
              imageSource={{ uri: v.uri }}
            />
          ))}
        </View>

        <View>
          <View style={styles.bottom}>
            <View>
              <Button
                text="SAVE"
                color={YELLOW}
                style={styles.button}
                fn={fn}
                loading={buttonLoading}
              />
            </View>
          </View>
        </View>
      </View>
    </Fragment>
  );

MainContent.defaultProps = {
  fn: null,
  siteName: '',
  newBox: [],
  buttonLoading: false,
  openCamera: () => { },
  showImage: () => { },
};
MainContent.propTypes = {
  fn: PropTypes.func,
  buttonLoading: PropTypes.bool,
  siteName: PropTypes.string,
  newBox: PropTypes.array,
  openCamera: PropTypes.func,
  showImage: PropTypes.func,
};

export default MainContent;
