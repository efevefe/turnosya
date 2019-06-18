import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CardSection, Button as TYButton, Input as TYInput } from './common';
import { validateValueType } from './common/validate';
import { onValueChange, onFormOpen, serviceCreate, serviceUpdate } from '../actions';

class ServiceForm extends Component {
    state = { nameError: '', durationError: '', priceError: '' };

    componentWillMount() {
        const { params } = this.props.navigation.state;

        if (params) {
            _.each(params.service, (value, prop) => {
                this.props.onValueChange({ prop, value });
            });
        } else {
            this.props.onFormOpen();
        }
    }

    onButtonPressHandler() {
        if (this.validateMinimumData()) {
            const { name, duration, price, description, navigation } = this.props;
            const { params } = this.props.navigation.state;

            if (params) {
                const { id } = this.props.navigation.state.params.service;

                this.props.serviceUpdate({
                    name,
                    duration,
                    price,
                    description,
                    id,
                },
                navigation
                );
            } else {
                this.props.serviceCreate({
                    name,
                    duration,
                    price,
                    description,
                },
                navigation
                );
            }
        }
    }

    renderNameError = () => {
        if (this.props.name === '') {
            this.setState({ nameError: 'Dato requerido' });
            return false;
        } else {
            this.setState({ nameError: '' });
            return true;
        }
    };

    renderDurationError = () => {
        if (this.props.duration === '') {
            this.setState({ durationError: 'Dato requerido' });
            return false;
        } else if (!validateValueType('int', this.props.duration)) {
            this.setState({ durationError: 'Debe ingresar un valor numerico' });
            return false;
        } else {
            this.setState({ durationError: '' });
            return true;
        }
    };

    renderPriceError = () => {
        if (this.props.price === '') {
            this.setState({ priceError: 'Dato requerido' });
            return false;
        } else if (!validateValueType('number', this.props.price)) {
            this.setState({ priceError: 'Debe ingresar un valor numerico' });
            return false;
        } else {
            this.setState({ priceError: '' });
            return true;
        }
    };

    validateMinimumData = () => {
        return (
            this.renderNameError() &&
            this.renderDurationError() &&
            this.renderPriceError()
        );
    };

    render() {
        const { cardStyle } = styles;

        return (
            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={60}
            >
                <View>
                    <Card containerStyle={cardStyle} >
                        <CardSection>
                            <TYInput
                                label="Nombre:"
                                placeholder="Nombre del servicio"
                                value={this.props.name}
                                errorMessage={this.state.nameError}
                                onChangeText={value =>
                                    this.props.onValueChange({
                                        prop: 'name',
                                        value,
                                    })
                                }
                                onFocus={() => this.setState({ nameError: '' })}
                                onBlur={this.renderNameError}
                            />
                        </CardSection>
                        <CardSection>
                            <TYInput
                                label="Duración:"
                                placeholder="Duración del servicio"
                                keyboardType="numeric"
                                value={this.props.duration}
                                errorMessage={this.state.durationError}
                                onChangeText={value => {
                                    this.props.onValueChange({
                                        prop: 'duration',
                                        value,
                                    });
                                }}
                                onFocus={() =>
                                    this.setState({ durationError: '' })
                                }
                                onBlur={this.renderDurationError}
                            />
                        </CardSection>
                        <CardSection>
                            <TYInput
                                label="Precio:"
                                placeholder="Precio del servicio"
                                keyboardType="numeric"
                                value={this.props.price}
                                errorMessage={this.state.priceError}
                                onChangeText={value =>
                                    this.props.onValueChange({
                                        prop: 'price',
                                        value,
                                    })
                                }
                                onFocus={() =>
                                    this.setState({ priceError: '' })
                                }
                                onBlur={this.renderPriceError}
                            />
                        </CardSection>
                        <CardSection>
                            <TYInput
                                label="Descripción:"
                                placeholder="Descripción del servicio"
                                multiline={true}
                                maxLength={250}
                                maxHeight={180}
                                onChangeText={value =>
                                    this.props.onValueChange({
                                        prop: 'description',
                                        value,
                                    })
                                }
                                value={this.props.description}
                            />
                        </CardSection>
                        <CardSection>
                            <TYButton
                                title="Guardar"
                                loading={this.props.loading}
                                onPress={this.onButtonPressHandler.bind(this)}
                            />
                        </CardSection>
                    </Card>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = {
    cardStyle: {
        padding: 5,
        paddingTop: 10,
        borderRadius: 10,
    }
}

const mapStateToProps = state => {
    const {
        name,
        duration,
        price,
        description,
        error,
        loading,
    } = state.serviceForm;

    return { name, duration, price, description, error, loading };
};

export default connect(
    mapStateToProps,
    { onValueChange, onFormOpen, serviceCreate, serviceUpdate }
)(ServiceForm);
