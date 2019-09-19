import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { CardSection, Button } from './common';
import { MAIN_COLOR } from '../constants';
import { onCourtReservationValueChange, onClientCourtReservationCreate } from '../actions';
import CourtReservationDetails from './CourtReservationDetails';

class ConfirmCourtReservation extends Component {
    state = { selectedIndex: 0, priceButtons: [], prices: [] };

    componentDidMount() {
        this.priceButtons();
    }

    priceButtons = () => {
        const { court } = this.props;
        var priceButtons = [];
        var prices = [];

        if (court) {
            priceButtons.push(`Sin Luz: $${court.price}`);
            prices.push(court.price);

            if (court.lightPrice) {
                priceButtons.push(`Con Luz: $${court.lightPrice}`);
                prices.push(court.lightPrice);
            }
        }

        this.setState({ priceButtons, prices });
    }

    onPriceSelect = selectedIndex => {
        this.setState({ selectedIndex });

        this.props.onCourtReservationValueChange({
            prop: 'price',
            value: this.state.prices[selectedIndex]
        });

        this.props.onCourtReservationValueChange({
            prop: 'light',
            value: !!selectedIndex  // 0 = false = no light // 1 = true = light
        });
    }

    onConfirmReservation = () => {
        const { commerce, court, slot, price, light } = this.props;

        this.props.onClientCourtReservationCreate({
            commerceId: commerce.objectID,
            courtId: court.id,
            slot,
            price,
            light
        });
    }

    renderButtons = () => {
        if (this.props.saved) {
            return (
                <Button
                    title='Ir a Mis Turnos'
                    icon={
                        <Ionicons
                            name='md-checkmark'
                            size={22}
                            color="white"
                            style={{ marginRight: 10 }}
                        />
                    }
                />
            );
        }

        return <Button title='Confirmar Reserva' loading={this.props.loading} onPress={this.onConfirmReservation} />;
    }

    render() {
        const { commerce, court, slot } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <CourtReservationDetails
                    commerce={commerce}
                    court={court}
                    slot={slot}
                >
                    <View style={{ flex: 1 }}>
                        <CardSection style={styles.cardSections}>
                            <ButtonGroup
                                onPress={this.onPriceSelect}
                                selectedIndex={this.state.selectedIndex}
                                buttons={this.state.priceButtons}
                                containerStyle={styles.priceButtons}
                                selectedButtonStyle={{ backgroundColor: MAIN_COLOR }}
                                selectedTextStyle={{ color: 'white' }}
                                textStyle={{ color: 'black' }}
                                containerStyle={styles.priceButtons}
                                innerBorderStyle={{ color: MAIN_COLOR }}
                            />
                        </CardSection>
                    </View>
                    <View style={styles.confirmButtonContainer}>
                        <CardSection>
                            {this.renderButtons()}
                        </CardSection>
                    </View>
                </CourtReservationDetails>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardSections: {
        alignItems: 'center'
    },
    priceButtons: {
        borderColor: MAIN_COLOR,
        height: 60,
        marginTop: 15,
        borderRadius: 8
    },
    confirmButtonContainer: {
        justifyContent: 'flex-end',
        alignSelf: 'stretch'
    }
});

const mapStateToProps = state => {
    const { commerce, court, slot, price, light, saved, loading } = state.courtReservation;

    return { commerce, court, slot, price, light, saved, loading };
}

export default connect(mapStateToProps, { onCourtReservationValueChange, onClientCourtReservationCreate })(ConfirmCourtReservation);