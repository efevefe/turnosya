import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { Menu, MenuItem, IconButton } from './common';
import moment from 'moment';

class ClientReservationListItem extends Component {
    render() {
        return (
            <View>
                <ListItem
                    title={this.props.reservation.commerceName}
                    subtitle={this.props.reservation.courtName}
                >
                </ListItem>

            </View>
        )
    }
}

export default connect(
    null,
    {}
)(ClientReservationListItem);