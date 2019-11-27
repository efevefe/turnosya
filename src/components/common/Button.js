import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';
import { MAIN_COLOR } from '../../constants';

class Button extends Component {
  render() {
    const color = this.props.color || MAIN_COLOR;

    return (
      <View style={this.props.outerContainerStyle}>
        <Text style={styles.errorMessageStyle}>{this.props.errorMessage}</Text>
        <RNEButton
          {...this.props}
          buttonStyle={[
            styles.buttonStyle,
            { backgroundColor: color },
            this.props.buttonStyle
          ]}
          containerStyle={[styles.containerStyle, this.props.containerStyle]}
        />
      </View>
    );
  }
}

const borderRadius = 8;

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius,
    padding: 10,
    margin: 8
  },
  containerStyle: {
    borderRadius,
    overflow: 'hidden'
  },
  errorMessageStyle: {
    color: 'red',
    marginLeft: 8
  }
});

export { Button };
