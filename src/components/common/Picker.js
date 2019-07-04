import React, { Component } from 'react';
import { Picker as RNPicker, View } from 'react-native';
class Picker extends Component {
  render() {
    return (
      <View>
        <RNPicker
          {...this.props}
          selectedValue={this.props.selectedValue}
          style={{ height: 50, width: 100 }}
          // onValueChange={(itemValue, itemIndex) =>
          //   this.setState({ language: itemValue })
          // }
        >
          {this.props.children}
        </RNPicker>
      </View>
    );
  }
}

export { Picker };
