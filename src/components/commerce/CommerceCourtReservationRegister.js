import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input, Button, CardSection, ButtonGroup } from '../common';
import CourtReservationDetails from '../CourtReservationDetails';
import { onReservationValueChange, onCommerceCourtReservationCreate } from '../../actions';
import { validateValueType } from '../../utils';

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

        this.props.onReservationValueChange({
            prop: "price",
            value: this.state.prices[selectedIndex]
        });

        this.props.onReservationValueChange({
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
                            textStyle={{ fontSize: 14 }}
                        />
                    </CardSection>
                    <CardSection style={styles.cardSection}>
                        <Input
                            label="Nombre:"
                            placeholder='Nombre del cliente'
                            autoCapitalize='words'
                            value={this.props.clientName}
                            onChangeText={this.onNameValueChange}
                            errorMessage={this.state.nameError}
                            onFocus={() => this.setState({ nameError: '' })}
                            onBlur={this.nameError}
                        />
                    </CardSection>
                    <CardSection style={styles.cardSection}>
                        <Input
                            label="Teléfono:"
                            placeholder='Teléfono del cliente (opcional)'
                            value={this.props.clientPhone}
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
        this.props.onReservationValueChange({
            prop: 'clientName',
            value: name
        });
    }

    onPhoneValueChange = phone => {
        this.props.onReservationValueChange({
            prop: 'clientPhone',
            value: phone
        });
    }

    nameError = () => {
        const { clientName } = this.props;

        if (!clientName) {
            this.setState({ nameError: 'Dato requerido' });
        } else if (!validateValueType('name', clientName)) {
            this.setState({ nameError: 'Formato no valido' });
        } else {
            this.setState({ nameError: '' });
            return false;
        }

        return true;
    }

    phoneError = () => {
        const { clientPhone } = this.props;

        if (clientPhone && !validateValueType('phone', clientPhone)) {
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
            const { commerceId, clientName, clientPhone, court, slot, light, price } = this.props;

            this.props.onCommerceCourtReservationCreate({
                commerceId,
                clientName,
                clientPhone,
                court,
                slot,
                light,
                price
            })
        }
    }

    render() {
        const { clientName, clientPhone, court, slot, light, price, saved } = this.props;

        return (
            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={60}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <CourtReservationDetails
                    name={saved && clientName}
                    info={saved && clientPhone}
                    infoIcon='ios-call'
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
    confirmButtonContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignSelf: "stretch"
    }
});

const mapStateToProps = state => {
    const { commerceId } = state.commerceData;
    const { clientName, clientPhone, court, slot, light, price, saved, loading } = state.reservation;

    return { commerceId, clientName, clientPhone, court, slot, light, price, saved, loading };
}

export default connect(mapStateToProps, {
    onReservationValueChange,
    onCommerceCourtReservationCreate
})(CommerceCourtReservationRegister);