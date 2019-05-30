import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem, Button, Overlay, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { serviceDelete } from '../actions';

class ServicesListItem extends Component {
    state = { visible: false };

    onRowPress() {
        this.setState({ visible: !this.state.visible });
    }

    onDeletePress() {
        const { id } = this.props.service;

        this.props.serviceDelete({ id });
    }

    render() {
        const { name, duration, price, id } = this.props.service;

        return (
            <View style={{flex: 1}}>
                <Overlay height='auto' onBackdropPress={this.onRowPress.bind(this)} isVisible={this.state.visible} >
                    <View >
                        <View style={{padding: 5}}>
                            <Button type='clear' title='Editar' />
                        </View>
                        <Divider style={{ backgroundColor: 'grey' }} />
                        <View style={{padding: 5}}>
                            <Button type='clear' titleStyle={{color: 'red'}} title='Eliminar' onPress={this.onDeletePress.bind(this)} />
                        </View>
                    </View>
                </Overlay>

                <ListItem
                    title={name}
                    subtitle={`Duracion: ${duration} min.`}
                    rightTitle={`$${price}`}
                    key={id}
                    onLongPress={this.onRowPress.bind(this)}
                    bottomDivider
                    rightElement={
                        <Button
                            type='clear'
                            buttonStyle={{ padding: 0 }}
                            onPress={this.onRowPress.bind(this)}
                            icon={
                                <Icon
                                    name='more-vert'
                                    size={20}
                                    color='grey'
                                />
                            }
                        />
                    }
                />
            </View>
        );
    }
}

export default connect(null, { serviceDelete })(ServicesListItem);