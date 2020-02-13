import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { CardSection, Button, ButtonGroup } from '../common';
import { MAIN_COLOR } from '../../constants';
import CourtReservationDetails from '../CourtReservationDetails';
import { onReservationValueChange, onClientCourtReservationCreate } from '../../actions';
import { isEmailVerified, newReservationNotificationFormat } from '../../utils';
import VerifyEmailModal from './VerifyEmailModal';

class ConfirmCourtReservation extends Component {
  state = { selectedIndex: 0, priceButtons: [], prices: [] };

  componentDidMount() {
    this.loading = false;
    this.priceButtons();
  }

  componentDidUpdate() {
    if (this.props.loading !== this.loading) {
      this.loading = this.props.loading;
    }
  }

  priceButtons = () => {
    const { court } = this.props;
    const priceButtons = [];
    const prices = [];

    if (court) {
      priceButtons.push(`Sin Luz: $${court.price}`);
      prices.push(court.price);

      if (court.lightPrice) {
        priceButtons.push(`Con Luz: $${court.lightPrice}`);
        prices.push(court.lightPrice);
      }
    }

    this.setState({ priceButtons, prices }, () => this.onPriceSelect(0));
  };

  onPriceSelect = selectedIndex => {
    this.setState({ selectedIndex });
    this.props.onReservationValueChange({
      price: this.state.prices[selectedIndex],
      light: !!selectedIndex // 0 = false = no light // 1 = true = light
    });
  };

  renderPriceButtons = () => {
    if (!this.props.saved) {
      return (
        <View>
          <CardSection>
            <ButtonGroup
              onPress={this.onPriceSelect}
              selectedIndex={this.state.selectedIndex}
              buttons={this.state.priceButtons}
              textStyle={{ fontSize: 14 }}
            />
          </CardSection>
        </View>
      );
    }
  };

  onConfirmReservation = async () => {
    if (this.loading) return;

    this.loading = true;

    try {
      if (await isEmailVerified()) {
        const {
          commerce,
          court,
          courtType,
          startDate,
          endDate,
          areaId,
          price,
          light,
          firstName,
          lastName
        } = this.props;

        const notification = newReservationNotificationFormat({
          startDate,
          service: `${court.name}`,
          actorName: `${firstName} ${lastName}`,
          receptorName: `${commerce.name}`
        });

        this.props.onClientCourtReservationCreate({
          commerceId: commerce.objectID,
          areaId,
          courtId: court.id,
          courtType,
          startDate,
          endDate,
          price,
          light,
          notification
        });
      } else {
        this.setState({ modal: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  onModalClose = () => {
    this.setState({ modal: false });
  };

  renderEmailModal = () => {
    if (this.state.modal) return <VerifyEmailModal onModalCloseCallback={this.onModalClose} />;
  };

  renderButtons = () => {
    if (this.props.saved || this.props.exists) {
      return (
        <CardSection style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'flex-start', flex: 1 }}>
            <RNEButton
              title="Reservar Otro"
              type="clear"
              titleStyle={{ color: MAIN_COLOR }}
              icon={<Ionicons name="ios-arrow-back" size={30} color={MAIN_COLOR} style={{ marginRight: 10 }} />}
              onPress={() => this.props.navigation.navigate('commerceProfileView')}
            />
          </View>
          {this.props.saved ? (
            <View style={{ alignItems: 'flex-end' }}>
              <RNEButton
                title="Finalizar"
                type="clear"
                titleStyle={{ color: MAIN_COLOR }}
                iconRight
                icon={<Ionicons name="ios-arrow-forward" size={30} color={MAIN_COLOR} style={{ marginLeft: 10 }} />}
                onPress={() => this.props.navigation.navigate('commercesAreas')}
              />
            </View>
          ) : null}
        </CardSection>
      );
    }

    return (
      <CardSection>
        <Button title="Confirmar Reserva" loading={this.loading} onPress={this.onConfirmReservation} />
      </CardSection>
    );
  };

  render() {
    const { commerce, court, startDate, endDate, light, price, saved } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <CourtReservationDetails
          mode="commerce"
          name={commerce.name}
          info={commerce.address + ', ' + commerce.city + ', ' + commerce.provinceName}
          infoIcon="md-pin"
          picture={commerce.profilePicture}
          court={court}
          startDate={startDate}
          endDate={endDate}
          price={price}
          light={light}
          showPrice={saved}
        />
        {this.renderPriceButtons()}
        <View style={styles.confirmButtonContainer}>{this.renderButtons()}</View>
        {this.renderEmailModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardSections: {
    alignItems: 'center'
  },
  confirmButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'stretch'
  }
});

const mapStateToProps = state => {
  const {
    commerce,
    courtType,
    court,
    startDate,
    endDate,
    price,
    light,
    areaId,
    saved,
    exists,
    loading
  } = state.reservation;
  const { firstName, lastName } = state.clientData;

  return {
    commerce,
    courtType,
    court,
    startDate,
    endDate,
    price,
    light,
    areaId,
    saved,
    exists,
    loading,
    firstName,
    lastName
  };
};

export default connect(mapStateToProps, {
  onReservationValueChange,
  onClientCourtReservationCreate
})(ConfirmCourtReservation);
