import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { ListItem, Button, Overlay, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { serviceDelete } from '../actions';

class ServicesListItem extends Component {
    state = { optionsVisible: false };

    onOptionsPress() {
        this.setState({ optionsVisible: !this.state.optionsVisible });
    }

    onDeletePress() {
        this.props.serviceDelete({ id: this.props.service.id });

        this.setState({ optionsVisible: !this.state.optionsVisible });
    }

    onUpdatePress() {
        const navigateAction = NavigationActions.navigate({
            routeName: 'serviceForm',
            params: { service: this.props.service, title: 'Editar Servicio' }
        });

        this.setState({ optionsVisible: !this.state.optionsVisible });

        //hay que ver la forma de que esto se haga en el .then() del update()
        this.props.navigation.navigate(navigateAction);
    }

    render() {
        const { name, duration, price, id } = this.props.service;

        return (
            <View style={{ flex: 1 }}>
                <Overlay
                    height='auto'
                    overlayStyle={{ padding: 0 }}
                    onBackdropPress={this.onOptionsPress.bind(this)}
                    isVisible={this.state.optionsVisible}
                    animationType='fade'
                >
                    <View>
                        <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'grey', fontSize: 16, margin: 15 }}>{name}</Text>
                        </View>
                        <Divider style={{ backgroundColor: 'grey' }} />
                        <Button
                            type='clear'
                            title='Editar'
                            buttonStyle={{ padding: 15 }}
                            onPress={this.onUpdatePress.bind(this)}
                        />
                        <Divider style={{ backgroundColor: 'grey', marginLeft: 10, marginRight: 10 }} />
                        <Button
                            type='clear'
                            title='Eliminar'
                            buttonStyle={{ padding: 15 }}
                            titleStyle={{ color: 'red' }}
                            onPress={this.onDeletePress.bind(this)}
                        />
                    </View>
                </Overlay>

                <ListItem
                    title={name}
                    subtitle={`Duracion: ${duration} min.`}
                    rightTitle={`$${price}`}
                    key={id}
                    onLongPress={this.onOptionsPress.bind(this)}
                    rightElement={
                        <Button
                            type='clear'
                            buttonStyle={{ padding: 0 }}
                            containerStyle={{ borderRadius: 15, overflow: 'hidden' }}
                            onPress={this.onOptionsPress.bind(this)}
                            icon={
                                <Icon
                                    name='more-vert'
                                    size={22}
                                    color='grey'
                                />
                            }
                        />
                    }
                    bottomDivider
                />
            </View>
        );
    }
}

export default connect(null, { serviceDelete })(ServicesListItem);