import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { MAIN_COLOR } from '../../constants';

class Picker extends Component {
  render() {
    return (
      <View>
        <Text style={styles.textStyle}>{this.props.title}</Text>
        <RNPickerSelect
          {...this.props}
          style={[styles.pickerStyle, this.props.style]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerStyle: {
    height: 40,
    fontSize: 17,
    fontWeight: 'normal',
    borderBottomWidth: 1.5,
    marginRight: 10,
    marginLeft: 10,
    borderColor: MAIN_COLOR,
    color: 'black'
  },
  textStyle: {
    fontSize: 14,
    fontWeight: 'normal',
    color: MAIN_COLOR,
    marginRight: 10,
    marginLeft: 10
  }
});

export { Picker };
