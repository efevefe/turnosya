import React, { Component } from "react";
import { View } from "react-native";
import CourtReservationDetails from "./CourtReservationDetails";
import { connect } from "react-redux";
import { Divider } from "react-native-elements";
import { CardSection, Button, Menu, MenuItem } from "./common/";
import moment from "moment";
import { onPressCancelReservation } from "../actions";

class ClientReservationDetails extends Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      reservations: params,
      visible: false
    };
  }

  onButtonPress = () => {
    this.setState({ visible: true });
  };

  onModalCancel = () => {
    this.setState({ visible: false });
  };

  renderButtonPress = reservations => {
    const { startDate } = reservations;
    if (startDate > moment())
      return (
        <CardSection style={{ flexDirection: "row" }}>
          <View style={{ alignItems: "center", padding: 3, flex: 1 }}>
            <Button
              title="Cancelar Reserva"
              type="solid"
              onPress={this.onButtonPress}
            />
          </View>
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
    } = this.state.reservations;

    return (
      <View style={{ flex: 1 }}>
        <Menu
          title="¿Esta seguro que desea cancelar el turno?"
          onBackdropPress={this.onOptionsPress}
          isVisible={this.state.visible}
        >
          <MenuItem
            title="Aceptar"
            icon="md-trash"
            onPress={() =>
              this.props.onPressCancelReservation(
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
            onPress={this.onModalCancel}
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
        >
          <View>{this.renderButtonPress(this.state.reservations)}</View>
        </CourtReservationDetails>
      </View>
    );
  }
}

export default connect(
  null,
  { onPressCancelReservation }
)(ClientReservationDetails);
