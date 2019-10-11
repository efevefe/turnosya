import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, RefreshControl } from 'react-native';
import { Spinner, EmptyList } from './common';
import ClientReservationListItem from './ClientReservationListItem';
import { onClientReservationListRead } from '../actions';
import { MAIN_COLOR } from '../constants';
import moment from 'moment'

class ClientReservationList extends Component {

    constructor(props) {
        super(props);
        props.onClientReservationListRead();
    }

    renderRow({ item }) {
            return (
                <ClientReservationListItem reservation={item} navigation={this.props.navigation} />
            );
    }

    onRefresh = () => {
        return (
            <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={() => this.props.onClientReservationListRead()}
                colors={[MAIN_COLOR]}
                tintColor={MAIN_COLOR}
            />
        );
    };

    render() {
        const { reservations, loading } = this.props;

        if (loading) return <Spinner />;
        if (reservations.length > 0)
            return (
                <FlatList
                    data={reservations}
                    renderItem={this.renderRow.bind(this)}
                    keyExtractor={reservation => reservation.id}
                    refreshControl={this.onRefresh()}
                />
            );

        return (
            <EmptyList
                title='No tiene reservas'
                onRefresh={this.onRefresh()}
            />
        );
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