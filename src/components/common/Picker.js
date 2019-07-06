import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { MAIN_COLOR } from '../../constants';
class Picker extends Component {
  render() {
    return (
      <View>
        <RNPickerSelect
          {...this.props}
          style={{ ...styles }}
          items={this.props.items}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputIOS: {
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
export { Picker };
