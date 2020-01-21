import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import { readReservationPaymentMethod } from '../actions';
import { Spinner } from './common';

class PaymentDetails extends Component {
  constructor(props) {
    super(props);

    const reservation = props.navigation.getParam('reservation', null);
    console.log(reservation);

    this.state = { reservation, client: reservation.client || {} };
  }

  componentDidMount() {
    this.props.readReservationPaymentMethod(this.state.reservation);
  }

  render() {
    return this.props.loading ? (
      <Spinner />
    ) : (
      <Card
        title="Información"
        textAlign="center"
        containerStyle={{ borderRadius: 10 }}
      >
        <View style={{ flexDirection: 'column', marginRight: 15 }}>
          <Text
            style={{ textAlign: 'left', fontSize: 15, padding: 5 }}
          >{`Fecha del Pago: ${moment(
            this.state.reservation.paymentDate.toDate()
          ).format('DD/MM/YYYY')}`}</Text>
          <Text
            style={{ textAlign: 'left', fontSize: 15, padding: 5 }}
          >{`Nombre: ${this.state.client.firstName ||
            this.props.firstName} ${this.state.client.lastName ||
            this.props.lastName}`}</Text>
          <Text
            style={{ textAlign: 'left', fontSize: 15, padding: 5 }}
          >{`Email: ${this.state.client.email || this.props.email}`}</Text>
          <Text
            style={{ textAlign: 'left', fontSize: 15, padding: 5 }}
          >{`Monto: $${this.state.reservation.price}`}</Text>
          <Text
            style={{ textAlign: 'left', fontSize: 15, padding: 5 }}
          >{`Método de Pago: ${this.props.method}`}</Text>
        </View>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  const { method, loading } = state.paymentData;
  const { firstName, lastName, email } = state.clientData;
  return { method, loading, firstName, lastName, email };
};

export default connect(mapStateToProps, { readReservationPaymentMethod })(
  PaymentDetails
);
