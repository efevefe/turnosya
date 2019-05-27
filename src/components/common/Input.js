import React from 'react';
import { TextInput, View, Text } from 'react-native';

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
    const { inputStyle, labelStyle, container } = styles;

    return (
        <View style={container}>
            <Text style={labelStyle}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                style={inputStyle}
                autoCorrect={false}
                placeholder={placeholder}
                //cuando se pone sola la propiedad, es igual a un ={true}
                //si desde el prop recibe un 'true', activa la propiedad y si no recibe nada, lo toma como 'false'
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
}

const styles = {
    inputStyle: {
        fontSize: 18,
        lineHeight: 23,
        color: '#00897b',
        //borders
        borderBottomWidth: 2,
        borderColor: '#00897b',
        padding: 5,
        //margins
        marginLeft: 10,
        marginRight: 10,
    },
    labelStyle: {
        fontSize: 16,
        marginTop: 5,
        paddingLeft: 10,
        color: '#00897b'
    },
    container: {
        flex: 1
    }
}

//cuando a inputStyle le pongo flex:2 y al labelStyle le pongo un flex:1, lo que eso indica es que del total (3), uno va a ocupar 2/3 y el otro 1/3

export { Input };