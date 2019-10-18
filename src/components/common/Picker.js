import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { MAIN_COLOR, GREY_DISABLED } from '../../constants';

class Picker extends Component {
  renderErrorMessage = () => {
    if (this.props.errorMessage) {
      return (
        <Text style={styles.errorMessageStyle}>{this.props.errorMessage}</Text>
      );
    }
  };

  render() {
    const enabled = this.props.disabled ? false : true;
    const color = enabled ? this.props.color || MAIN_COLOR : GREY_DISABLED;
    const textColor = enabled ? this.props.textColor || 'black' : 'grey';
    const borderBottomWidth = enabled ? 1.5 : 1;

    const { pickerStyle, iconContainer } = styles;

    return (
      <View>
        <Text style={[styles.textStyle, { color }]}>{this.props.title}</Text>
        <RNPickerSelect
          {...this.props}
          style={{
            inputIOS: {
              ...pickerStyle,
              color: textColor,
              borderColor: color,
              borderBottomWidth
            },
            inputAndroid: {
              ...pickerStyle,
              color: textColor,
              borderColor: color,
              borderBottomWidth
            },
            iconContainer: iconContainer
          }}
          useNativeAndroidPickerStyle={false}
          Icon={() => {
            return (
              <Ionicons
                name="ios-arrow-down"
                type="ionicons"
                size={20}
                color={color}
              />
            );
          }}
        />
        {this.renderErrorMessage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerStyle: {
    height: 40,
    fontSize: 17,
    fontWeight: 'normal',
    marginRight: 10,
    marginLeft: 10,
    paddingLeft: 5,
    paddingRight: 5
  },
  iconContainer: {
    top: 11,
    right: 17
  },
  textStyle: {
    fontSize: 12,
    fontWeight: 'normal',
    marginRight: 10,
    marginLeft: 10
  },
  errorMessageStyle: {
    margin: 5,
    marginLeft: 10,
    marginRight: 10,
    color: 'red',
    fontSize: 12
  }
});

export { Picker };
