import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';
import { MAIN_COLOR } from '../../constants';

class Button extends Component {
  render() {
    const backgroundColor = this.props.type !== 'clear' ? this.props.color || MAIN_COLOR : 'white';
    const color = this.props.type !== 'clear' ? 'white' : this.props.color || MAIN_COLOR;

    return (
      <View style={this.props.outerContainerStyle}>
        <RNEButton
          {...this.props}
          buttonStyle={[styles.buttonStyle, { backgroundColor }, this.props.buttonStyle]}
          containerStyle={[styles.containerStyle, this.props.containerStyle]}
          titleStyle={{ color }}
          loadingProps={{ color }}
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
