import React, { Component } from 'react';
import { View } from 'react-native';
import CourtReservationDetails from './CourtReservationDetails';
import { connect } from 'react-redux';
import {CardSection ,Button} from './common/'
import { MAIN_COLOR } from '../constants';


class ClientReservationDetails extends Component {

    constructor(props) {
        super(props)
        const { params } = this.props.navigation.state;
        this.state = {
            reservation: params
        }
    }

    renderButtonPress = () => {
        return (
            <CardSection style={{ flexDirection: 'row' }}>
                <View style={{ alignItems: 'flex-start', flex: 1 }}>
                    <Button
                        title="Cancelar Reserva"
                        type='solid'
                    />
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Button
                        title="Comfirmar Reserva"
                        type='solid'
                    />
                </View>
            </CardSection>
        );
    }

    render() {

        const { commerce, court, endDate, startDate, light, price } = this.state.reservation;

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
                    <View>{this.renderButtonPress()}</View>
                </CourtReservationDetails>
            </View>
        );
    }
}

export default connect(null, {})(ClientReservationDetails);