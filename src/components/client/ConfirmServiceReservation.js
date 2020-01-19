import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { CardSection, Button } from '../common';
import { MAIN_COLOR } from '../../constants';
import { onClientServiceReservationCreate } from '../../actions';
import ServiceReservationDetails from '../ServiceReservationDetails';

class ConfirmServiceReservation extends Component {
    onConfirmReservation = () => {
        const { commerce, service, employee, startDate, endDate, price, areaId } = this.props;

        this.props.onClientServiceReservationCreate({
            commerceId: commerce.objectID,
            areaId,
            serviceId: service.id,
            employeeId: employee.id,
            startDate,
            endDate,
            price
        });
    };

    renderButtons = () => {
        if (this.props.saved) {
            return (
                <CardSection style={{ flexDirection: 'row' }}>
                    <View style={{ alignItems: 'flex-start', flex: 1 }}>
                        <RNEButton
                            title="Reservar otro"
                            type="clear"
                            titleStyle={{ color: MAIN_COLOR }}
                            icon={
                                <Ionicons
                                    name="ios-arrow-back"
                                    size={30}
                                    color={MAIN_COLOR}
                                    style={{ marginRight: 10 }}
                                />
                            }
                            onPress={() => this.props.navigation.navigate('commerceProfileView')}
                        />
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <RNEButton
                            title="Finalizar"
                            type="clear"
                            titleStyle={{ color: MAIN_COLOR }}
                            iconRight
                            icon={
                                <Ionicons
                                    name="ios-arrow-forward"
                                    size={30}
                                    color={MAIN_COLOR}
                                    style={{ marginLeft: 10 }}
                                />
                            }
                            onPress={() => this.props.navigation.navigate('commercesAreas')}
                        />
                    </View>
                </CardSection>
            );
        }

        return (
            <CardSection>
                <Button
                    title="Confirmar Reserva"
                    loading={this.props.loading}
                    onPress={this.onConfirmReservation}
                />
            </CardSection>
        );
    };

    render() {
        const { commerce, employee, service, startDate, endDate, price } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <ServiceReservationDetails
                    mode='commerce'
                    name={commerce.name}
                    info={
                        commerce.address + ', ' +
                        commerce.city + ', ' +
                        commerce.provinceName
                    }
                    infoIcon='md-pin'
                    picture={commerce.profilePicture}
                    service={service}
                    employee={employee}
                    startDate={startDate}
                    endDate={endDate}
                    price={price}
                />
                <View style={styles.confirmButtonContainer}>
                    {this.renderButtons()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardSections: {
        alignItems: 'center'
    },
    confirmButtonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignSelf: 'stretch'
    }
});

const mapStateToProps = state => {
    const {
        commerce,
        service,
        employee,
        startDate,
        endDate,
        price,
        saved,
        areaId,
        loading
    } = state.reservation;

    return { commerce, employee, service, startDate, endDate, price, areaId, saved, loading };
};

export default connect(mapStateToProps, { onClientServiceReservationCreate })(ConfirmServiceReservation);