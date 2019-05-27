import React from 'react';
import { Picker, View, Text } from 'react-native';

const InputPicker = ({ label, selectedValue, onValueChange, children }) => {
    const { pickerStyle, pickerContainerStyle, labelStyle, container } = styles;

    return (
        <View style={container}>
            <Text style={labelStyle}>{label}</Text>
            <View style={pickerContainerStyle}>
                <Picker selectedValue={selectedValue} onValueChange={onValueChange} style={pickerStyle} >
                    {children}
                </Picker>
            </View>
        </View>
    );
}

const styles = {
    pickerStyle: {
        //flex: 1 //esto es por si no se viera nada
        //margins
        marginLeft: 5,
        color: '#00897b'
    },
    pickerContainerStyle: {
        borderWidth: 1,
        borderColor: '#00897b',
        borderRadius: 5,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10
    },
    labelStyle: {
        fontSize: 16,
        marginTop: 5,
        paddingLeft: 10,
        color: '#00897b'
    },
    container: {
        flex: 1,
    }
}

export { InputPicker };