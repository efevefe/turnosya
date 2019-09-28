import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { Menu, MenuItem, IconButton } from './common';

class ClientReservationListItem extends Component {
    render() {
        const {commerceName,courtName,startDate,endDate,price} = this.props.reservation

        return (
            <View>
                <ListItem
                title={commerceName}
                //rightSubtitle={`$${price}`}
                subtitle={`${courtName}\n${startDate.substring(4,24)} - ${endDate.substring(4,24)}`}
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