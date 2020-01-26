import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { MAIN_COLOR } from '../../constants';

const Spinner = ({ size, color, style, type }) => {
  // cuando se pone en transparente, el spinner se debe agregar debajo de los demas elementos en el DOM, para que se superponga
  const background = type == 'transparent' ? 'rgba(0, 0, 0, 0.6)' : 'white';

  return (
    <View style={[styles.containerStyle, { backgroundColor: background }, style]}>
      <ActivityIndicator color={color || MAIN_COLOR} size={size || 'large'} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});

export { Spinner };
