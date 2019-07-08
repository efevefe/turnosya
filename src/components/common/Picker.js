import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { MAIN_COLOR } from '../../constants';

class Picker extends Component {
  render() {
    return (
      <View>
        <Text style={styles.textStyle}>{this.props.title}</Text>
        <RNPickerSelect {...this.props} style={{ ...pickerStyles }} />
      </View>
    );
  }
}

const pickerStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    fontSize: 17,
    fontWeight: 'normal',
    borderBottomWidth: 1.5,
    marginRight: 10,
    marginLeft: 10,
    borderColor: MAIN_COLOR,
    color: 'black'
  },
  inputAndroid: {
    height: 40,
    fontSize: 17,
    fontWeight: 'normal',
    borderBottomWidth: 1.5,
    marginRight: 10,
    marginLeft: 10,
    borderColor: MAIN_COLOR,
    color: 'black'
  }
});

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 14,
    fontWeight: 'normal',
    color: MAIN_COLOR,
    marginRight: 10,
    marginLeft: 10
  }
});

export { Picker };
