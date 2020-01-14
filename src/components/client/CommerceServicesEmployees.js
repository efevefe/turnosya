import React from 'react';
import {
    Text,
    TouchableHighlight,
    View,
    StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { onNewServiceReservation } from '../../actions';

const CommerceCourtTypes = props => {
    onServicesPress = () => {
        if (props.navigation.state.routeName === 'commerceProfileView') {
            props.onNewServiceReservation();
            props.navigation.navigate('commerceServicesList');
        }
    }

    onEmployeesPress = () => {
        if (props.navigation.state.routeName === 'commerceProfileView') {
            props.onNewServiceReservation();
            props.navigation.navigate('commerceEmployeesList');
        }
    }

    return (
        <View style={styles.mainContainer}>
            <TouchableHighlight
                onPress={onServicesPress}
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
                onPress={onEmployeesPress}
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

export default connect(null, { onNewServiceReservation })(CommerceCourtTypes);