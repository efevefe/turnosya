import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

const SettingsItem = props => {
  renderIcon = () => {
    if (props.leftIcon) {
      return (
        <View style={{ width: 25, alignItems: 'center' }}>
          {
            props.loading ? (
              <ActivityIndicator
                style={StyleSheet.flatten({ marginVertical: 2 })}
                color={props.leftIcon.color}
                size="small"
              />
            ) : (
                <Ionicons name={props.leftIcon.name} color={props.leftIcon.color} size={23} />
              )
          }

        </View>
      );
    }
  }

  return (
    <ListItem
      {...props}
      leftIcon={this.renderIcon()}
    />
  )
}

export { SettingsItem };