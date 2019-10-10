import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ButtonGroup, Button as RNEButton } from 'react-native-elements';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBackButton } from 'react-navigation-stack';
import { CardSection, Button } from './common';
import { MAIN_COLOR } from '../constants';
import {
    onCourtReservationValueChange,
    onClientCourtReservationCreate,
    onCourtReservationClear,
    onCommerceCourtsReadByType,
    onCommerceCourtReservationsOnSlotRead
} from '../actions';
import CourtReservationDetails from './CourtReservationDetails';

class ConfirmCourtReservation extends Component {
    state = { selectedIndex: 0, priceButtons: [], prices: [] };

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: navigation.getParam('leftButton')
        };
    };

    async componentDidMount() {
        this.props.navigation.setParams({
            leftButton: this.renderBackButton()
        });

        await this.priceButtons();
        this.onPriceSelect(0);
    }

    renderBackButton = () => {
        return <HeaderBackButton onPress={this.onBackPress} tintColor='white' />
    }

    onBackPress = () => {
        // hace lo mismo que haria si se volviera a montar la pantalla anterior
        this.onNewReservation();
        this.props.navigation.goBack(null);

        this.props.onCommerceCourtReservationsOnSlotRead({
            commerceId: this.props.commerce.objectID,
            startDate: this.props.slot.startDate
        });

        this.props.onCommerceCourtsReadByType({
            commerceId: this.props.commerce.objectID,
            courtType: this.props.courtType
        });
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

    renderPriceButtons = () => {
        if (!this.props.saved) {
            return (
                <View>
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
            );
        }
    }

    onConfirmReservation = () => {
        const { commerce, court, courtType, slot, price, light } = this.props;

        this.props.onClientCourtReservationCreate({
            commerceId: commerce.objectID,
            courtId: court.id,
            courtType,
            slot,
            price,
            light
        });
    }

    onNewReservation = () => {
        this.props.onCourtReservationValueChange({
            prop: 'saved',
            value: false
        });
    }

    renderButtons = () => {
        if (this.props.saved) {
            return (
                <CardSection style={{ flexDirection: 'row' }}>
                    <View style={{ alignItems: 'flex-start', flex: 1 }}>
                        <RNEButton
                            title="Reservar otro"
                            type='clear'
                            titleStyle={{ color: MAIN_COLOR }}
                            icon={
                                <Ionicons
                                    name="ios-arrow-back"
                                    size={30}
                                    color={MAIN_COLOR}
                                    style={{ marginRight: 10 }}
                                />
                            }
                            onPress={() => {
                                this.onNewReservation();
                                this.props.navigation.navigate('commerceCourtTypes');
                            }}
                        />
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <RNEButton
                            title="Finalizar"
                            type='clear'
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
                            onPress={() => {
                                this.onNewReservation();
                                this.props.navigation.navigate('commercesAreas');
                            }}
                        />
                    </View>
                </CardSection>
            );
        }

        return (
            <CardSection>
                <Button
                    title='Confirmar Reserva'
                    loading={this.props.loading}
                    onPress={this.onConfirmReservation}
                />
            </CardSection>
        );
    }

    render() {
        const { commerce, court, slot, light, price, saved } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <CourtReservationDetails
                    commerce={commerce}
                    court={court}
                    startDate={slot.startDate}
                    endDate={slot.endDate}
                    price={price}
                    light={light}
                    showPrice={saved}
                />
                {this.renderPriceButtons()}
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
    priceButtons: {
        borderColor: MAIN_COLOR,
        height: 60,
        marginTop: 15,
        borderRadius: 8
    },
    confirmButtonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignSelf: 'stretch'
    }
});

const mapStateToProps = state => {
    const { commerce, courtType, court, slot, price, light, saved, loading } = state.courtReservation;

    return { commerce, courtType, court, slot, price, light, saved, loading };
}

export default connect(
    mapStateToProps,
    {
        onCourtReservationValueChange,
        onClientCourtReservationCreate,
        onCourtReservationClear,
        onCommerceCourtsReadByType,
        onCommerceCourtReservationsOnSlotRead
    }
)(ConfirmCourtReservation);