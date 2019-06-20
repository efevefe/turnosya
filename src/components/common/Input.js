import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Input as RNEInput } from 'react-native-elements';
import { MAIN_COLOR } from '../../constants';

class Input extends Component {
  render() {
    const color = this.props.color || MAIN_COLOR;

    return (
      <RNEInput
        {...this.props}
        inputContainerStyle={[
          styles.inputContainerStyle,
          { borderColor: color },
          this.props.inputContainerStyle
        ]}
        inputStyle={[styles.inputStyle, this.props.inputStyle]}
        labelStyle={[
          styles.labelStyle,
          { color: color },
          this.props.labelStyle
        ]}
        errorStyle={[styles.errorStyle, this.props.errorStyle]}
        selectionColor={color}
      />
    );
  }
}

const styles = StyleSheet.create({
  inputContainerStyle: {
    borderBottomWidth: 1.5
  },
  inputStyle: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 17
  },
  labelStyle: {
    fontSize: 14,
    fontWeight: 'normal'
  },
  errorStyle: {
    marginLeft: 0
  }
});

export { Input };
