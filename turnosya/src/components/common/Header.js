//importar librerias para el componente
import React from 'react';
import { Text, View } from 'react-native';

//hacer el componente
const Header = (props) => {
    const { viewStyle, textStyle } = styles;
    return (
        <View style={ viewStyle }>
            <Text style={ textStyle }>{ props.headerText }</Text>
        </View>
    );
};

const styles = {
    viewStyle: {
        backgroundColor: '#00897b',
        justifyContent: 'center',
        height: 70,
        //para que ocupe todo el ancho
        alignSelf: 'stretch',
        paddingTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, heigth: 2},
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative'
    },
    textStyle: {
        fontSize: 17,
        color: '#FFFFFF',
        paddingLeft: 20
    }
}

//hacer disponible el componente
export {Header};