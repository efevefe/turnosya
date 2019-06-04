import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Input, Button } from 'react-native-elements';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { CardSection } from './common';
import { validateValueType } from './common/validate';
import { mainColor } from '../constants';
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
            const { name, duration, price, description } = this.props;

            const { params } = this.props.navigation.state;

            if (params) {
                const { id } = this.props.navigation.state.params.service;

                this.props.serviceUpdate({
                    name,
                    duration,
                    price,
                    description,
                    id,
                });
            } else {
                this.props.serviceCreate({
                    name,
                    duration,
                    price,
                    description,
                });
            }

            this.props.navigation.goBack();
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
        const {
            inputContainerStyle,
            inputStyle,
            labelStyle,
            buttonStyle,
        } = styles;

        return (
            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={25}
            >
                <View>
                    <Card
                        containerStyle={{
                            padding: 5,
                            paddingTop: 10,
                            borderRadius: 10,
                        }}
                    >
                        <CardSection>
                            <Input
                                label="Nombre:"
                                placeholder="Nombre del servicio"
                                inputStyle={inputStyle}
                                inputContainerStyle={inputContainerStyle}
                                labelStyle={labelStyle}
                                value={this.props.name}
                                onChangeText={value =>
                                    this.props.onValueChange({
                                        prop: 'name',
                                        value,
                                    })
                                }
                                errorMessage={this.state.nameError}
                                onFocus={() => this.setState({ nameError: '' })}
                                onBlur={this.renderNameError}
                            />
                        </CardSection>
                        <CardSection>
                            <Input
                                label="Duración:"
                                placeholder="Duración del servicio"
                                keyboardType="numeric"
                                inputStyle={inputStyle}
                                inputContainerStyle={inputContainerStyle}
                                labelStyle={labelStyle}
                                value={this.props.duration}
                                onChangeText={value => {
                                    this.props.onValueChange({
                                        prop: 'duration',
                                        value,
                                    });
                                }}
                                errorMessage={this.state.durationError}
                                onFocus={() =>
                                    this.setState({ durationError: '' })
                                }
                                onBlur={this.renderDurationError}
                            />
                        </CardSection>

                        <CardSection>
                            <Input
                                label="Precio:"
                                placeholder="Precio del servicio"
                                keyboardType="numeric"
                                inputStyle={inputStyle}
                                inputContainerStyle={inputContainerStyle}
                                labelStyle={labelStyle}
                                value={this.props.price}
                                onChangeText={value =>
                                    this.props.onValueChange({
                                        prop: 'price',
                                        value,
                                    })
                                }
                                errorMessage={this.state.priceError}
                                onFocus={() =>
                                    this.setState({ priceError: '' })
                                }
                                onBlur={this.renderPriceError}
                            />
                        </CardSection>

                        <CardSection>
                            <Input
                                label="Descripción:"
                                placeholder="Descripción del servicio"
                                multiline={true}
                                inputStyle={inputStyle}
                                inputContainerStyle={inputContainerStyle}
                                labelStyle={labelStyle}
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
                            <Button
                                title="Guardar"
                                buttonStyle={buttonStyle}
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
    inputContainerStyle: {
        borderBottomWidth: 2,
        borderColor: mainColor,
    },
    inputStyle: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16,
    },
    labelStyle: {
        color: mainColor,
        fontWeight: 'normal',
    },
    buttonStyle: {
        borderRadius: 10,
        padding: 10,
        margin: 10,
        backgroundColor: mainColor,
    },
    errorStyle: {
        color: mainColor,
        textAlign: 'center',
        alignSelf: 'center',
    },
};

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
