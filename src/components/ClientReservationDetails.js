import React, { Component } from "react";
import { View } from "react-native";
import CourtReservationDetails from "./CourtReservationDetails";
import { connect } from "react-redux";
import { Divider } from "react-native-elements";
import { CardSection, Button, Menu, MenuItem } from "./common/";
import moment from "moment";
import { onClientCancelReservation } from "../actions";

class ClientReservationDetails extends Component {
  constructor(props) {
    super(props);
    const { reservation } = this.props.navigation.state.params;
    this.state = {
      reservation,
      visible: false
    };
  }

  renderCancelButton = () => {
    const { startDate } = this.state.reservation;
    if (startDate > moment())
      return (
        <CardSection>
            <Button
              loading={this.props.loading}
              title="Cancelar Reserva"
              type="solid"
              onPress={() => this.setState({ visible: true })}
            />
        </CardSection>
      );
  };

  render() {
    const {
      commerce,
      court,
      endDate,
      startDate,
      light,
      price,
      id,
      commerceId
    } = this.state.reservation;

    return (
      <View style={{ flex: 1 }}>
        <Menu
          title="¿Está seguro que desea cancelar el turno?"
          onBackdropPress={this.onOptionsPress}
          isVisible={this.state.visible}
        >
          <MenuItem
            title="Aceptar"
            icon="md-trash"
            onPress={() =>
              this.props.onClientCancelReservation(
                id,
                commerceId,
                this.props.navigation
              )
            }
          />
          <Divider style={{ backgroundColor: "grey" }} />
          <MenuItem
            title="Cancelar"
            icon="md-close"
            onPress={() => this.setState({ visible: false })}
          />
        </Menu>
        <CourtReservationDetails
          commerce={commerce}
          court={court}
          startDate={startDate}
          endDate={endDate}
          price={price}
          light={light}
          showPrice={true}
        />
        {this.renderCancelButton()}
      </View>
    );
  }
}
const mapStateToProps = state => {
  const { loading } = state.clientReservationsList;
  return { loading };
};

export default connect(
  mapStateToProps,
  { onClientCancelReservation }
)(ClientReservationDetails);
