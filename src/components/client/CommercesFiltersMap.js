import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { IconButton, Picker } from '../common';
import { MAIN_COLOR } from '../../constants';
import Map from '../common/Map';

export default class CommercesFiltersMap extends Component {
  render() {
    return (
      <View style={windowContainerStyle}>
        <View style={windowTopContainerStyle}>
          <IconButton
            icon="md-close"
            onPress={() => this.props.navigation.goBack()}
          />
          <Button
            title="Aceptar"
            type="clear"
            titleStyle={{ color: 'white' }}
            onPress={() => this.props.navigation.goBack()}
            style={applyFilterButtonStyle}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Map />
        </View>
      </View>
    );
  }
}

const {
  windowContainerStyle,
  windowTopContainerStyle,
  applyFilterButtonStyle
} = StyleSheet.create({
  windowContainerStyle: { flex: 1, backgroundColor: MAIN_COLOR },
  windowTopContainerStyle: {
    paddingTop: 20,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  applyFilterButtonStyle: { marginRight: 10, padding: 5 }
});
