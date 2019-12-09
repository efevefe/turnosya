import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input, Button, CardSection } from '../common';
import CourtReservationDetails from '../CourtReservationDetails';
import { onCourtReservationValueChange, onCommerceCourtReservationCreate } from '../../actions';
import { validateValueType } from '../../utils';
import { MAIN_COLOR } from '../../constants';

class CommerceCourtReservationRegister extends Component {
    state = { selectedIndex: 0, priceButtons: [], prices: [], nameError: '', phoneError: '' };

    componentDidMount() {
        this.priceButtons();
    }

    priceButtons = () => {
        const { court } = this.props;
        const priceButtons = [];
        const prices = [];

        if (court) {
            priceButtons.push(`Sin Luz: $${court.price}`);
            prices.push(court.price);

            if (court.lightPrice) {
                priceButtons.push(`Con Luz: $${court.lightPrice}`);
                prices.push(court.lightPrice);
            }
        }

        this.setState({ priceButtons, prices }, () => this.onPriceSelect(0));
    };

    onPriceSelect = selectedIndex => {
        this.setState({ selectedIndex });

        this.props.onCourtReservationValueChange({
            prop: "price",
            value: this.state.prices[selectedIndex]
        });

        this.props.onCourtReservationValueChange({
            prop: "light",
            value: !!selectedIndex // 0 = false = no light // 1 = true = light
        });
    };

    renderInputs = () => {
        if (!this.props.saved) {
            return (
                <View>
                    <CardSection>
                        <ButtonGroup
                            onPress={this.onPriceSelect}
                            selectedIndex={this.state.selectedIndex}
                            buttons={this.state.priceButtons}
                            containerStyle={styles.priceButtons}
                            selectedButtonStyle={{ backgroundColor: MAIN_COLOR }}
                            selectedTextStyle={{ color: "white" }}
                            textStyle={{ color: "black" }}
                            containerStyle={styles.priceButtons}
                            innerBorderStyle={{ color: MAIN_COLOR }}
                        />
                    </CardSection>
                    <CardSection style={styles.cardSection}>
                        <Input
                            label="Nombre:"
                            placeholder='Nombre del cliente'
                            value={this.props.client.name}
                            onChangeText={this.onNameValueChange}
                            errorMessage={this.state.nameError}
                            onFocus={() => this.setState({ nameError: '' })}
                            onBlur={this.nameError}
                        />
                    </CardSection>
                    <CardSection style={styles.cardSection}>
                        <Input
                            label="Telefono:"
                            placeholder='Telefono del cliente (opcional)'
                            value={this.props.client.phone}
                            onChangeText={this.onPhoneValueChange}
                            errorMessage={this.state.phoneError}
                            onFocus={() => this.setState({ phoneError: '' })}
                            onBlur={this.phoneError}
                        />
                    </CardSection>
                </View>
            );
        }
    };

    onNameValueChange = name => {
        const { client } = this.props;

        this.props.onCourtReservationValueChange({
            prop: 'client',
            value: { ...client, name }
        });
    }

    onPhoneValueChange = phone => {
        const { client } = this.props;

        this.props.onCourtReservationValueChange({
            prop: 'client',
            value: { ...client, phone }
        });
    }

    nameError = () => {
        const { name } = this.props.client;

        if (!name) {
            this.setState({ nameError: 'Dato requerido' });
            return true;
        } else if (!validateValueType('name')) {
            this.setState({ nameError: 'Formato no valido' });
            return true;
        } else {
            this.setState({ nameError: '' });
            return false;
        }
    }

    phoneError = () => {
        const { phone } = this.props.client;

        if (phone && !validateValueType('phone')) {
            this.setState({ phoneError: 'Formato no valido' });
            return true;
        } else {
            this.setState({ phoneError: '' });
            return false;
        }
    }

    renderButtons = () => {
        if (!this.props.saved) {
            return (
                <CardSection>
                    <Button
                        title="Confirmar Reserva"
                        loading={this.props.loading}
                        onPress={this.onConfirmReservation}
                    />
                </CardSection>
            );
        }
    }

    onConfirmReservation = () => {
        if (!this.nameError() && !this.phoneError()) {
            const { commerceId, client, court, slot, light, price } = this.props;

            this.props.onCommerceCourtReservationCreate({
                commerceId,
                client,
                court,
                slot,
                light,
                price
            })
        }
    }

    render() {
        const { court, slot, light, price, saved } = this.props;

        return (
            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={60}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <CourtReservationDetails
                    court={court}
                    startDate={slot.startDate}
                    endDate={slot.endDate}
                    price={price}
                    light={light}
                    showPrice={saved}
                />
                {this.renderInputs()}
                <View style={styles.confirmButtonContainer}>
                    {this.renderButtons()}
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardSection: {
        paddingHorizontal: 10
    },
    priceButtons: {
        borderColor: MAIN_COLOR,
        height: 60,
        marginTop: 15,
        borderRadius: 8
    },
    confirmButtonContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignSelf: "stretch"
    }
});

const mapStateToProps = state => {
    const { commerceId } = state.commerceData;
    const { client, court, slot, light, price, saved, loading } = state.courtReservation;

    return { commerceId, client, court, slot, light, price, saved, loading };
}

export default connect(mapStateToProps, {
    onCourtReservationValueChange,
    onCommerceCourtReservationCreate
})(CommerceCourtReservationRegister);