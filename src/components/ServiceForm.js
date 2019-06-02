import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Input, Button } from 'react-native-elements';
import { CardSection } from './common';

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
        const { name, duration, price, description } = this.props;

        const { params } = this.props.navigation.state;

        if (params) {
            const { id } = this.props.navigation.state.params.service;

            this.props.serviceUpdate({ name, duration, price, description, id });
        } else {
            this.props.serviceCreate({ name, duration, price, description });
        }

        this.props.navigation.goBack();
    }

    render() {
        const { inputContainerStyle, inputStyle, labelStyle, buttonStyle } = styles;

        return (
            <Card containerStyle={{ padding: 5, paddingTop: 10, borderRadius: 10 }}>
                <CardSection>
                    <Input
                        label="Nombre:"
                        placeholder="Nombre del servicio"
                        inputStyle={inputStyle}
                        inputContainerStyle={inputContainerStyle}
                        labelStyle={labelStyle}
                        onChangeText={value => this.props.onValueChange({ prop: 'name', value })}
                        value={this.props.name}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        label="Duracion:"
                        placeholder="Duracion del servicio"
                        inputStyle={inputStyle}
                        inputContainerStyle={inputContainerStyle}
                        labelStyle={labelStyle}
                        onChangeText={value => this.props.onValueChange({ prop: 'duration', value })}
                        value={this.props.duration}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        label="Precio:"
                        placeholder="Precio del servicio"
                        inputStyle={inputStyle}
                        inputContainerStyle={inputContainerStyle}
                        labelStyle={labelStyle}
                        onChangeText={value => this.props.onValueChange({ prop: 'price', value })}
                        value={this.props.price}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        label="Descripcion:"
                        placeholder="Descripcion del servicio"
                        multiline={true}
                        inputStyle={inputStyle}
                        inputContainerStyle={inputContainerStyle}
                        labelStyle={labelStyle}
                        onChangeText={value => this.props.onValueChange({ prop: 'description', value })}
                        value={this.props.description}
                    />
                </CardSection>
                <CardSection>
                    <Button
                        title='Guardar'
                        buttonStyle={buttonStyle}
                        onPress={this.onButtonPressHandler.bind(this)}
                    />
                </CardSection>
            </Card>
        );
    }
}

const red = '#c72c41';

const styles = {
    inputContainerStyle: {
        borderBottomWidth: 2,
        borderColor: red
    },
    inputStyle: {
        marginLeft: 10,
        marginRight: 10,  
        fontSize: 16
    },
    labelStyle: {
        color: red,
        fontWeight: 'normal'
    },
    buttonStyle: {
        borderRadius: 10, 
        padding: 10, 
        margin: 10,
        backgroundColor: red
    }
}

const mapStateToProps = (state) => {
    const { name, duration, price, description } = state.serviceForm;

    return { name, duration, price, description };
}

export default connect(mapStateToProps, { onValueChange, serviceCreate, serviceUpdate })(ServiceForm);