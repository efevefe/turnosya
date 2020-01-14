import React from 'react';
import {
    Text,
    TouchableHighlight,
    View,
    StyleSheet
} from 'react-native';
import { Card } from 'react-native-elements';

const CommerceCourtTypes = props => {
    return (
        <View style={styles.mainContainer}>
            <TouchableHighlight
                onPress={props.navigation.state.routeName === 'commerceProfileView'
                    ? (() => props.navigation.navigate('commerceServicesList')) : null}
                underlayColor="transparent"
            >
                <Card
                    image={require('../../../assets/hairdressers/services.jpg')}
                    imageStyle={styles.imageStyle}
                    containerStyle={styles.containerStyle}
                >
                    <Text>Servicios</Text>
                </Card>
            </TouchableHighlight>
            <TouchableHighlight
                onPress={props.navigation.state.routeName === 'commerceProfileView'
                    ? (() => alert('empleados')) : null}
                underlayColor="transparent"
            >
                <Card
                    image={require('../../../assets/hairdressers/hairdressers.jpg')}
                    imageStyle={styles.imageStyle}
                    containerStyle={styles.containerStyle}
                >
                    <Text>Estilistas</Text>
                </Card>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingBottom: 15
    },
    imageStyle: {
        height: 80
    },
    containerStyle: {
        overflow: 'hidden',
        borderRadius: 10
    }
});

export default CommerceCourtTypes;