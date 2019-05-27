import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

const Button = ({children, onPress}) => {
    const {buttonStyle, textStyle} = styles;

    return (
        //con los touchable encapsulamos las cosas que queremos que sean clickeables y que den un feedback
        <TouchableOpacity onPress={onPress} style={buttonStyle}>
            <Text style={textStyle}>{children}</Text>
        </TouchableOpacity>
    );
}

const styles = {
    textStyle:{
        alignSelf: 'center',
        color: '#fff',
        fontSize: 16,
        //fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    buttonStyle:{
        //alignSelf stretch le dice que llene el contenedor, junto con flex
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: "#00897b",
        //borders
        borderColor: '#00897b',
        borderRadius: 25,
        borderWidth: 1,
        margin: 10,
        //shadow
        shadowColor: '#000',
        shadowOffset: {width: 0, heigth: 2},
        shadowOpacity: 0.1,
        //shadowRadius: 10,
        elevation: 2
    }
}

export {Button};