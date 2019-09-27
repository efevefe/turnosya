import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View, Text } from 'react-native';
import { Spinner, EmptyList } from './common';
import CheckCustomerShiftReservationsListItem from './CheckCustomerShiftReservationsListItem';
import { servicesRead } from '../actions';
import { MAIN_COLOR } from '../constants';

class CheckCustomerShiftReservationsList extends Component {
    renderRow({ item }) {
        return (
            <CheckCustomerShiftReservationsListItem commerce={item} navigation={this.props.navigation} />
        );
    }
    render() {
        const { onlyFavoriteCommerces, loading } = this.props;

        if (loading) return <Spinner />;

        if (onlyFavoriteCommerces.length > 0) {
            return (
                <FlatList
                    data={onlyFavoriteCommerces}
                    renderItem={this.renderRow.bind(this)}
                    keyExtractor={commerce => commerce.objectID}
                    refreshControl={this.onRefresh()}
                />
            );
        }

        return (
            <EmptyList
                title='No tenes favoritos'
                onRefresh={this.onRefresh()}
            />
        );


    }
}
const mapStateToProps = state => {
    const { services, loading } = state.servicesList;
    const { commerceId } = state.commerceData;

    return { services, loading, commerceId };
};

export default connect(
    mapStateToProps,
    {}
)(CheckCustomerShiftReservationsList); 