import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';
import { MAIN_COLOR } from '../../constants';

class Button extends Component {
  render() {
    const { type } = this.props;

    const backgroundColor = !type || type === 'solid' ? this.props.color || MAIN_COLOR : 'white';
    const color = !type || type === 'solid' ? 'white' : this.props.color || MAIN_COLOR;
    const border = type === 'outline' ? { borderColor: color, borderWidth: 1 } : {};

    return (
      <View style={this.props.outerContainerStyle}>
        <RNEButton
          {...this.props}
          buttonStyle={[styles.buttonStyle, { backgroundColor, ...border }, this.props.buttonStyle]}
          containerStyle={[styles.containerStyle, this.props.containerStyle]}
          titleStyle={[{ color }, this.props.titleStyle]}
          loadingProps={[{ color }, this.props.loadingProps]}
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
  }
});

export { Button };
