import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View, Text } from 'react-native';
import { Spinner, EmptyList } from './common';
import ClientReservationListItem from './ClientReservationListItem';
import { onClientReservationListRead } from '../actions';

class ClientReservationList extends Component {
    renderRow({ item }) {
        console.log(item)
        return (
            <ClientReservationListItem reservation={item} navigation={this.props.navigation} />
        );
    }

    constructor(props) {
        super(props);

        props.onClientReservationListRead();

    }
    render() {
        if (this.props.loading) return <Spinner />;

        return (
            <FlatList
                data={this.props.reservations}
                renderItem={this.renderRow.bind(this)}
                keyExtractor={reservations => reservations.id}
            //refreshControl={this.onRefresh()}
            />
        );
        /* 
            return (
                <EmptyList
                    title='No tenes favoritos'
                    onRefresh={this.onRefresh()}
                /> 
            );*/


    }
}
const mapStateToProps = state => {
    const { reservations, loading } = state.clientReservationList;
    return { reservations, loading };
};

export default connect(
    mapStateToProps,
    { onClientReservationListRead }
)(ClientReservationList); 