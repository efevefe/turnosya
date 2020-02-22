import React from 'react';
import { StyleSheet } from 'react-native';
import { Badge as RNEBadge } from 'react-native-elements';

const Badge = props => {
  return (
    <RNEBadge
      value={props.value}
      onPress={props.onPress}
      badgeStyle={{
        ...styles.badgeStyle,
        backgroundColor: props.color,

      }}
      containerStyle={[styles.containerStyle, props.containerStyle]}
    />
  )
}

const styles = StyleSheet.create({
  badgeStyle: {
    height: 25,
    width: 'auto',
    borderRadius: 12.5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  containerStyle: {
    paddingTop: 3
  }
});

export { Badge };