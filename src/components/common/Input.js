import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Input as RNEInput } from 'react-native-elements';
import { MAIN_COLOR } from '../../constants';

class Input extends Component {
  isEnabled = () => {
    const { editable } = this.props;

    if (editable == undefined) {
      return true;
    } else if (editable) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const enabled = this.isEnabled();
    const inputColor = enabled ? ( this.props.color || MAIN_COLOR ) : '#c4c4c4';

    return (
      <RNEInput
        {...this.props}
        inputContainerStyle={[
          { borderColor: inputColor, borderBottomWidth: enabled ? 1.5 : 1 },
          this.props.inputContainerStyle
        ]}
        inputStyle={[
          styles.inputStyle,
          { color: enabled ? 'black' : 'grey' },
          this.props.inputStyle
        ]}
        labelStyle={[
          styles.labelStyle,
          { color: inputColor },
          this.props.labelStyle
        ]}
        errorStyle={[styles.errorStyle, this.props.errorStyle]}
        selectionColor={inputColor}
      />
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 17,
    lineHeight: 25
  },
  labelStyle: {
    fontSize: 12,
    fontWeight: 'normal'
  },
  errorStyle: {
    marginLeft: 0
  }
});

export { Input };
