import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { CardSection, Button, Input } from './common';
import { onValueChange, serviceCreate } from '../actions';

class ServiceForm extends Component {
    onButtonPressHandler = () => {
        const { name, duration, price, description } = this.props;

        this.props.serviceCreate({ name, duration, price, description });
    }

    render() {
        return (
            <Card containerStyle={{ padding: 2, borderRadius: 10 }}>
                <CardSection>
                    <Input
                        label='Nombre:'
                        placeholder="Nombre del servicio"
                        onChangeText={value => this.props.onValueChange({ prop: 'name', value })}
                        value={this.props.name}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        label='Duracion:'
                        placeholder="Duracion del servicio"
                        onChangeText={value => this.props.onValueChange({ prop: 'duration', value })}
                        value={this.props.duration}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        label='Precio:'
                        placeholder="Precio del servicio"
                        onChangeText={value => this.props.onValueChange({ prop: 'price', value })}
                        value={this.props.price}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        label='Descripcion:'
                        placeholder="Descripcion del servicio"
                        onChangeText={value => this.props.onValueChange({ prop: 'description', value })}
                        value={this.props.description}
                    />
                </CardSection>
                <CardSection>
                    <Button onPress={this.onButtonPressHandler}>Guardar</Button>
                </CardSection>
            </Card>
        );
    }
}

const mapStateToProps = (state) => {
    const { name, duration, price, description } = state.serviceForm;
    
    return { name, duration, price, description };
}

export default connect(mapStateToProps, { onValueChange, serviceCreate })(ServiceForm);