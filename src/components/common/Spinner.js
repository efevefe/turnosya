import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import { MAIN_COLOR } from '../../constants';

const Spinner = ({ size, color }) => {
    return (
        <View style={styles.containerStyle}>
            <ActivityIndicator color={color || MAIN_COLOR} size={size || 'large'}/>
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
