import React from 'react';
import {View, ActivityIndicator} from 'react-native';

const Spinner = ({size}) => {
    return (
        <View style={styles.containerStyle}>
            <ActivityIndicator color='#00897b' size={size || 'large'}/>
        </View>
    );
};

const styles = {
    containerStyle:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    }
}

export {Spinner};