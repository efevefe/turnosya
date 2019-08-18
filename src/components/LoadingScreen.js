import React from 'react';
import { View, ActivityIndicator, Image, StyleSheet, Dimensions } from 'react-native';
import { MAIN_COLOR } from '../constants';

const logoSize = Math.round(Dimensions.get('window').width) / 2;

const LoadingScreen = () => {
    return (
        <View style={styles.containerStyle}>
            <View style={styles.logoContainerStyle}>
                <Image
                    source={require('../../assets/turnosya-white.png')}
                    style={{ height: logoSize, width: logoSize }}
                />
                <ActivityIndicator color='white' size='large' />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: MAIN_COLOR,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoContainerStyle: {
        alignItems: 'center',
        paddingBottom: 20
    }
});

export default LoadingScreen;