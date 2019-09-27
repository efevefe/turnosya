import React, { Component } from 'react';
import { View } from 'react-native';
/* import { NavigationActions } from 'react-navigation';
import { ListItem, Divider } from 'react-native-elements'; */
import { connect } from 'react-redux';
/* import { Menu, MenuItem, IconButton } from '../components/common';
 */import { serviceDelete } from '../actions';

class CheckCustomerShiftReservationsListItem  extends Component{
    render (){
        return(
            <View></View>
        )
    }
}

export default connect(
    null,
    { serviceDelete }
  )(CheckCustomerShiftReservationsListItem);