import React, { Component } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Input as RNEInput } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { MAIN_COLOR, GREY_DISABLED } from '../../constants';

class Input extends Component {
  state = { revealPassword: true };

  componentDidMount() {
    if (this.props.password) {
      this.setState({ revealPassword: false });
    }
  }

  isEnabled = () => {
    const { editable } = this.props;

    if (editable == undefined) {
      return true;
    } else if (editable) {
      return true;
    } else {
      return false;
    }
  };

  revealPasswordButton = color => {
    if (this.props.password) {
      const { revealPassword } = this.state;

      return (
        <TouchableWithoutFeedback
          onPressIn={() => this.setState({ revealPassword: !revealPassword })}
          onPressOut={() => this.setState({ revealPassword: !revealPassword })}
        >
          <Ionicons name={`md-eye${revealPassword ? '-off' : ''}`} color={color} size={22} style={{ marginRight: 5 }} />
        </TouchableWithoutFeedback>
      );
    }
  };

  render() {
    const enabled = this.isEnabled();
    const inputColor = enabled ? this.props.color || MAIN_COLOR : GREY_DISABLED;

    return (
      <RNEInput
        {...this.props}
        inputContainerStyle={[
          { borderColor: inputColor, borderBottomWidth: enabled ? 1.5 : 1 },
          this.props.inputContainerStyle
        ]}
        inputStyle={[styles.inputStyle, { color: enabled ? 'black' : 'grey' }, this.props.inputStyle]}
        labelStyle={[styles.labelStyle, { color: inputColor }, this.props.labelStyle]}
        errorStyle={[styles.errorStyle, this.props.errorStyle]}
        secureTextEntry={!this.state.revealPassword}
        rightIcon={this.props.password ? this.revealPasswordButton(inputColor) : this.props.rightIcon}
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
