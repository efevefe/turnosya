import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { EmptyList, Spinner } from '../common';
import { servicesRead, onReservationValueChange } from '../../actions';

class CommerceServicesList extends Component {
    componentDidMount() {
        // aca se debe filtrar por empleado si se selecciona o sino no
        this.unsubscribeServices = this.props.servicesRead(this.props.commerce.objectID);
    }

    componentWillUnmount() {
        this.unsubscribeServices && this.unsubscribeServices();
    }

    renderItem = ({ item }) => {
        return (
            <ListItem
                title={item.name}
                subtitle={`Duración: ${item.duration} min.`}
                rightTitle={`$${item.price}`}
                rightTitleStyle={{ fontWeight: 'bold', color: 'black' }}
                rightIcon={{
                    name: 'ios-arrow-forward',
                    type: 'ionicon',
                    color: 'black'
                }}
                bottomDivider
                onPress={() => this.props.onReservationValueChange({ prop: 'service', value: item })}
            />
        )
    }

    render() {
        if (this.props.loading) return <Spinner />;

        if (this.props.services.length) {
            return (
                <FlatList
                    data={this.props.services}
                    renderItem={this.renderItem}
                    keyExtractor={service => service.id}
                    contentContainerStyle={{ paddingBottom: 15 }}
                />
            );
        }

        return <EmptyList title='Parece que no hay servicios' />
    }
}

const mapStateToProps = state => {
    const { commerce } = state.reservation;
    const { services, loading } = state.servicesList;

    return { commerce, services, loading };
};

export default connect(mapStateToProps, { servicesRead, onReservationValueChange })(CommerceServicesList);