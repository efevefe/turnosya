import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { MAIN_COLOR } from '../../constants';

class Picker extends Component {
  renderErrorMessage = () => {
    if (this.props.errorMessage) {
      return (
        <Text style={styles.errorMessageStyle}>{this.props.errorMessage}</Text>
      );
    }
  };

  render() {
    const color = this.props.disabled ? '#c4c4c4' : MAIN_COLOR;
    const textColor = this.props.disabled ? 'grey' : 'black';

    const { inputIOS, inputAndroid } = pickerStyles;

    return (
      <View>
        <Text style={[styles.textStyle, { color }]}>{this.props.title}</Text>
        <RNPickerSelect
          {...this.props}
          style={{ 
            inputIOS: { ...inputIOS, color: textColor, borderColor: color }, 
            inputAndroid: { ...inputAndroid, color: textColor, borderColor: color } 
          }}
        />
        {this.renderErrorMessage()}
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
    borderColor: MAIN_COLOR
  },
  inputAndroid: {
    height: 40,
    // fontSize: 17,
    // fontWeight: 'normal',
    borderBottomWidth: 1.5,
    marginRight: 10,
    marginLeft: 10,
    borderColor: MAIN_COLOR
  }
});

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 12,
    fontWeight: 'normal',
    marginRight: 10,
    marginLeft: 10
  },
  errorMessageStyle: {
    marginLeft: 10,
    color: 'red',
    fontSize: 12
  }
});

export { Picker };