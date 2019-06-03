import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import { Card, Input, Button } from 'react-native-elements';
import { CardSection, Spinner } from './common';
import { validateValueType } from './common/validate';

//import { CardSection, Button, Input } from './common';
import { onValueChange, serviceCreate, serviceUpdate } from '../actions';

class ServiceForm extends Component {
    componentWillMount() {
        const { params } = this.props.navigation.state;
        
        if (params) {
            _.each(params.service, (value, prop) => {
                this.props.onValueChange({ prop, value });
            });
        }
    }

    onButtonPressHandler() {
        this.setState({ loading: true });
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
        } else {
            this.props.onValueChange({
                prop: 'error',
                value: 'Ingrese todos los valores mínimos porfavor.',
            });
        }
        this.setState({ loading: false });
    }

    renderPriceError = () => {
        if (this.props.price !== '') {
            if (!validateValueType('number', this.props.price)) {
                return 'Número inválido.';
            }
        }
    };

    validateMinimumData = () => {
        return (
            validateValueType('string', this.props.name) &&
            validateValueType('number', this.props.price)
        );
    };

    render() {
        const {
            inputContainerStyle,
            inputStyle,
            labelStyle,
            buttonStyle,
            errorStyle,
        } = styles;

        return (
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
                        onChangeText={value =>
                            this.props.onValueChange({ prop: 'name', value })
                        }
                        value={this.props.name}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        label="Duración:"
                        placeholder="Duración del servicio"
                        inputStyle={inputStyle}
                        inputContainerStyle={inputContainerStyle}
                        labelStyle={labelStyle}
                        onChangeText={value =>
                            this.props.onValueChange({
                                prop: 'duration',
                                value,
                            })
                        }
                        value={this.props.duration}
                    />
                </CardSection>
                {/* <Text style={{ marginLeft: 10, color: red }}>falta el validate de duration</Text> */}

                <CardSection>
                    <Input
                        label="Precio:"
                        placeholder="Precio del servicio"
                        inputStyle={inputStyle}
                        inputContainerStyle={inputContainerStyle}
                        labelStyle={labelStyle}
                        onChangeText={value =>
                            this.props.onValueChange({ prop: 'price', value })
                        }
                        value={this.props.price}
                    />
                </CardSection>
                <Text style={errorStyle}>{this.renderPriceError()}</Text>

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
                <Text style={errorStyle}>{this.props.error}</Text>
            </Card>
        );
    }
}

const red = '#c72c41';

const styles = {
    inputContainerStyle: {
        borderBottomWidth: 2,
        borderColor: red,
    },
    inputStyle: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16,
    },
    labelStyle: {
        color: red,
        fontWeight: 'normal',
    },
    buttonStyle: {
        borderRadius: 10,
        padding: 10,
        margin: 10,
        backgroundColor: red,
    },
    errorStyle: {
        color: red,
        textAlign: 'center',
        alignSelf: 'center',
    },
};

const mapStateToProps = (state) => {
    const { name, duration, price, description, error, loading } = state.serviceForm;

    return { name, duration, price, description, error, loading };
}

export default connect(
    mapStateToProps,
    { onValueChange, serviceCreate, serviceUpdate }
)(ServiceForm);
