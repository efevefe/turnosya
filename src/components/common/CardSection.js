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
        flexDirection: 'row',
        justifyContent: 'flex-start',
        position: 'relative',
        //shadow
        shadowColor: '#000',
        shadowOffset: {width: 0, heigth: 2},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        //borders
        borderColor: '#ddd',
        padding: 5
    }
}

export {CardSection};