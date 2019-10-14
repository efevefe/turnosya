import React, { Component } from 'react';
import CourtReservationDetails from './CourtReservationDetails';

class CommerceCourtReservationDetails extends Component {
    // pantalla de detalles del turno (alternativa al modal con los detalles por si tenemos que meter mas funciones u opciones)

    render() {
        const { client, court, startDate, endDate, price, light } = this.props.navigation.getParam('reservation');

        return (
            <CourtReservationDetails
                client={client}
                court={court}
                startDate={startDate}
                endDate={endDate}
                price={price}
                light={light}
                showPrice={true}
            />
        );
    }
}

export default CommerceCourtReservationDetails;