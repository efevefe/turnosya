import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'
import { MONTHS, DAYS } from '../constants';

class ClientReservationListItem extends Component {

    OnPressItem = (reservation) => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'reservationsDetail',
            params: reservation
        });
        this.props.navigation.navigate(navigateAction);
    }

    render() {
        const { commerce, startDate, endDate,price } = this.props.reservation
        return (
            <View>
                <ListItem
                    title={commerce.name}
                    rightTitle={`$${price}`}
                    subtitle={`${DAYS[startDate.day()]} ${startDate.format('D')} de ${MONTHS[startDate.month()]}\nDe ${startDate.format('HH:mm')} hs. a ${endDate.format('HH:mm')} hs.`}
                    bottomDivider
                    onPress={() => this.OnPressItem(this.props.reservation)}
                >
                </ListItem>

            </View>
        )
    }
}

export default connect(null,{})(ClientReservationListItem);