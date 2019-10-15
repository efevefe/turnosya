import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { IconButton, Picker } from './common';
import { MAIN_COLOR } from '../constants';
import LocationMap from './LocationMap';

export default class CommercesFiltersMap extends Component {
  constructor(props) {
    super(props);
  }

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
          <LocationMap navigation={this.props.navigation} />
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
