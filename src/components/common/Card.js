import React from 'react';
import {View} from 'react-native';

const Card = (props) => {
    //con props.children le estamos indicando que tiene que renderizar los componentes que se encuentren dentro de Card cuando la usamos
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    );
}

const styles = {
    containerStyle: {
        //border
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        //shadow
        shadowColor: '#000',
        shadowOffset: {width: 0, heigth: 2},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        //margins
        margin: 13,
        //para que los elementos children no se extiendan por fuera del padre
        overflow: 'hidden'
    }
}

export {Card};