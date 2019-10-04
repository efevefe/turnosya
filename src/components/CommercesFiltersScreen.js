import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Divider, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { IconButton } from './common';
import { MAIN_COLOR } from '../constants';
import { Ionicons } from '@expo/vector-icons';

class CommerceFiltersScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
        <View
          style={{
            paddingTop: 20,
            height: 70,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row'
          }}
        >
          <IconButton
            icon="md-close"
            onPress={() => this.props.navigation.goBack()}
          />
          <Button
            title="Aplicar Filtros"
            type="clear"
            titleStyle={{ color: 'white' }}
            onPress={() => this.props.navigation.goBack()}
            style={{ marginRight: 10, padding: 5 }}
          />
        </View>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        </View>
      </View>
    );
  }
}

export default CommerceFiltersScreen;
