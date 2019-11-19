import React, { Component } from 'react';
import CourtReservationDetails from '../CourtReservationDetails';
import { View } from 'react-native';
import { Button, Menu, MenuItem, Input, CardSection } from '../common';
import { Divider } from 'react-native-elements';
import moment from 'moment';
import {
  onCommerceCancelReservation,
  onCourtReservationsListValueChange
} from '../../actions';
import { connect } from 'react-redux';

class CommerceCourtReservationDetails extends Component {
  // pantalla de detalles del turno (alternativa al modal con los detalles por si tenemos que meter mas funciones u opciones)

  constructor(props) {
    super(props);
    const reservation = this.props.navigation.getParam('reservation');
    this.state = {
      reservation,
      optionsVisible: false,
      commentVisible: false,
      comment: ''
    };
  }

  onCancelPress = () => {
    this.setState({
      optionsVisible: false,
      commentVisible: !this.state.commentVisible
    });
  };

  renderCancelButton = () => {
    if (this.state.reservation.startDate > moment()) {
      return (
        <Button
          title="Cancelar Reserva"
          onPress={() =>
            this.setState({ optionsVisible: !this.state.optionsVisible })
          }
        />
      );
    }
  };

  render() {
    const {
      client,
      court,
      startDate,
      endDate,
      price,
      light,
      id,
      clientId
    } = this.state.reservation;
    return (
      <View>
        <CourtReservationDetails
          client={client}
          court={court}
          startDate={startDate}
          endDate={endDate}
          price={price}
          light={light}
          showPrice={true}
        />
        <CardSection>{this.renderCancelButton()}</CardSection>

        <Menu
          title="¿Está seguro que desea cancelar el turno?"
          onBackdropPress={() => this.setState({ optionsVisible: false })}
          isVisible={this.state.optionsVisible}
        >
          <MenuItem
            title="Aceptar"
            icon="md-checkmark"
            // loadingWithText={this.props.loadingReservations}
            onPress={this.onCancelPress}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Cancelar"
            icon="md-close"
            onPress={() => this.setState({ optionsVisible: false })}
          />
        </Menu>
        <Menu
          title="Informar el motivo de la cancelación"
          onBackdropPress={() => this.setState({ commentVisible: false })}
          isVisible={this.state.commentVisible}
        >
          <Input
            placeholder="Motivos por los que decidio cancelar el turno..."
            multiline={true}
            color="black"
            onChangeText={value =>
              this.props.onCourtReservationsListValueChange({
                prop: 'cancelComment',
                value
              })
            }
            value={this.props.cancelComment}
          />
          <MenuItem
            title="Confirmar"
            icon="md-checkmark"
            onPress={() => {
              this.onCancelPress();
              this.props.onCommerceCancelReservation({
                commerceId: this.props.commerceId,
                reservationId: id,
                clientId,
                cancelComment: this.props.cancelComment,
                navigation: this.props.navigation
              });
            }}
          />
          {/* <MenuItem
            title="Cancelar"
            icon="md-close"
            onPress={() => this.setState({ commentVisible: false })}
          /> */}
        </Menu>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { loading, cancelComment } = state.courtReservationsList;
  const { commerceId } = state.commerceData;

  return { loading, commerceId, cancelComment };
};

export default connect(mapStateToProps, {
  onCommerceCancelReservation,
  onCourtReservationsListValueChange
})(CommerceCourtReservationDetails);
