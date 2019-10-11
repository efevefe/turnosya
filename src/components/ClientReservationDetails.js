import React, { Component } from 'react';
import { View } from 'react-native';
import CourtReservationDetails from './CourtReservationDetails';
import { connect } from 'react-redux';
import { CardSection, Button } from './common/'
import moment from 'moment'

class ClientReservationDetails extends Component {

    constructor(props) {
        super(props)
        const { params } = this.props.navigation.state;
        this.state = {
            reservations: params
        }
    }

    renderButtonPress = (startDate) => {
        if(startDate > moment())
        return (
            <CardSection style={{ flexDirection: 'row' }}>
                <View style={{ alignItems: 'center', padding: 3, flex: 1 }}>
                    <Button
                        title="Cancelar Reserva"
                        type='solid'
                    />
                </View>
            </CardSection>
        );
    }

    render() {

        const { commerce, court, endDate, startDate, light, price } = this.state.reservations;

        return (
            <View style={{ flex: 1 }}>
                <CourtReservationDetails
                    commerce={commerce}
                    court={court}
                    startDate={startDate}
                    endDate={endDate}
                    price={price}
                    light={light}
                    showPrice={true}
                >
                    <View>{this.renderButtonPress(startDate)}</View>
                </CourtReservationDetails>
            </View>
        );
    }
}

export default connect(null, {})(ClientReservationDetails);