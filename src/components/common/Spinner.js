import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Spinner = ({ size, color }) => {
  return (
    <View style={styles.containerStyle}>
      <ActivityIndicator color={color} size={size || 'large'} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  }
});

export { Spinner };
