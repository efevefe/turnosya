import React, { Component } from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
class Picker extends Component {
  render() {
    return (
      <View>
        <RNPickerSelect
          {...this.props}
          style={{ height: 50, width: 100 }}
          items={this.props.items}
          // onValueChange={(itemValue, itemIndex) =>
          //   this.setState({ language: itemValue })
          // }
        />
      </View>
    );
  }
}

export { Picker };
