import React from 'react';
import { Text, View, Modal } from 'react-native';
import { CardSection, Button } from './';

const Confirm = ({ children, visible, onAccept, onDecline }) => {
    const { textCardSectionStyle, buttonsCardSectionStyle, textStyle, containerStyle } = styles;

    return (
        //android requiere si o si algo en el onRequestClose, por lo que si no necesitamos usarlo, le pasamos una funcion vacia
        <Modal
            transparent
            visible={visible}
            animationType='slide'
            onRequestClose={() => { }}
        >
            <View style={containerStyle}>
                <CardSection style={textCardSectionStyle}>
                    <Text style={textStyle}>{children}</Text>
                </CardSection>
                <CardSection style={buttonsCardSectionStyle}>
                    <Button onPress={onDecline}>No</Button>
                    <Button onPress={onAccept}>Yes</Button>
                </CardSection>
            </View>
        </Modal>
    );
};

const styles = {
    textCardSectionStyle: {
        justifyContent: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    buttonsCardSectionStyle: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10

    },
    textStyle: {
        flex: 1,
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 25,
        marginTop: 10
    },
    containerStyle: {
        //el cuarto valor es la opacidad
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        padding: 15
    }
}

export { Confirm };