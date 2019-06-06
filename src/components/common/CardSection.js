import React from 'react';
import {View} from 'react-native';

const CardSection = (props) => {
    return (
        <View style={[styles.containerStyle, props.style]}>
            {props.children}
        </View>
    );
}

const styles = {
    containerStyle: {
        alignSelf: 'stretch',
        padding: 5,
        position: 'relative'
    }
}

export {CardSection};