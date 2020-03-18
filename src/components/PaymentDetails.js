import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Text, View, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import { onReservationPaymentRead } from '../actions';
import { Spinner } from './common';

class PaymentDetails extends Component {
  constructor(props) {
    super(props);
    const reservation = props.navigation.getParam('reservation', null);
    this.state = { reservation };
  }

  componentDidMount() {
    this.props.onReservationPaymentRead(this.state.reservation);
  }

  getClientName = () => {
    const { client, clientName } = this.state.reservation;

    if (client) return client.firstName + ' ' + client.lastName;
    if (clientName) return clientName;
    return this.props.firstName + ' ' + this.props.lastName;
  };

  render() {
    return this.props.loading ? (
      <Spinner />
    ) : (
      <Card title="Información" textAlign="center" containerStyle={styles.cardStyle}>
        <View style={styles.containerStyle}>
          <Text style={styles.textStyle}>
            {`Fecha del Pago: ${moment(this.props.date.toDate()).format('DD/MM/YYYY')}`}
          </Text>
          <Text style={styles.textStyle}>{`Nombre: ${this.getClientName()}`}</Text>
          <Text style={styles.textStyle}>{`Monto: $${this.state.reservation.price}`}</Text>
          <Text style={styles.textStyle}>{`Método de Pago: ${this.props.method}`}</Text>
          {this.props.method === 'Efectivo' && this.props.receiptNumber ? (
            <Text style={styles.textStyle}>{`Nro. de Comprobante: ${this.props.receiptNumber || 'S/N'}`}</Text>
          ) : null}
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: { borderRadius: 10 },
  containerStyle: { flexDirection: 'column', marginRight: 15 },
  textStyle: { textAlign: 'left', fontSize: 15, padding: 5 }
});

const mapStateToProps = state => {
  const { method, loading, date, receiptNumber } = state.paymentData;
  const { firstName, lastName } = state.clientData;
  return { method, loading, firstName, lastName, date, receiptNumber };
};

export default connect(mapStateToProps, { onReservationPaymentRead })(PaymentDetails);
