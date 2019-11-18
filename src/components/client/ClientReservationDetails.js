import React, { Component } from 'react';
import { View, Text } from 'react-native';
import CourtReservationDetails from '../CourtReservationDetails';
import { connect } from 'react-redux';
import { Divider, AirbnbRating, Rating } from 'react-native-elements';
import {
  CardSection,
  Button,
  Menu,
  MenuItem,
  Spinner,
  Toast,
  Input
} from '../common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {
  onClientCancelReservation,
  readCancellationTimeAllowed,
  reviewValueChange
} from '../../actions';
import { stringFormatHours } from '../../utils/functions';
import { MAIN_COLOR } from '../../constants';

class ClientReservationDetails extends Component {
  constructor(props) {
    super(props);

    const reservation = props.navigation.getParam('reservation');
    this.state = {
      reservation,
      optionsVisible: false
    };
  }

  componentDidMount() {
    this.props.readCancellationTimeAllowed(
      this.props.navigation.state.params.reservation.commerceId
    );
  }

  onPressCancelButton = () => {
    const { reservationMinCancelTime } = this.props;
    const { startDate } = this.state.reservation;
    if (startDate.diff(moment(), 'hours') > reservationMinCancelTime)
      this.setState({ optionsVisible: true });
    else
      Toast.show({
        text:
          'No puede cancelar el turno, el tiempo minimo permitido es ' +
          stringFormatHours(reservationMinCancelTime)
      });
  };

  renderCancelButton = () => {
    const { startDate } = this.state.reservation;
    if (startDate > moment()) {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <CardSection>
            <Button
              title="Cancelar Reserva"
              type="solid"
              onPress={this.onPressCancelButton}
            />
          </CardSection>
        </View>
      );
    }
  };

  renderCommerceReview = () => {
    if (this.state.reservation.startDate < moment()) {
      return (
        <View>
          <Divider
            style={{
              margin: 10,
              marginLeft: 40,
              marginRight: 40,
              backgroundColor: 'grey'
            }}
          />
          <CardSection>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>
              Calificación de la Atención
            </Text>
          </CardSection>
          <CardSection>
            <AirbnbRating
              onFinishRating={value =>
                this.props.reviewValueChange('rating', value)
              }
              defaultRating={2.67}
              showRating={false}
              size={25}
            />
          </CardSection>
          <View style={{ marginTop: 10 }}>
            <Input
              onChangeText={value =>
                this.props.reviewValueChange('comment', value)
              }
              editable={true}
              multiline={true}
              maxLength={128}
              maxHeight={180}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'stretch',
              marginBottom: 10
            }}
          >
            <Button
              title="Borrar Review"
              type="clear"
              color="white"
              titleStyle={{ color: MAIN_COLOR }}
              outerContainerStyle={{ flex: 1 }}
            />
            <Button
              title="Guardar"
              type="solid"
              outerContainerStyle={{ flex: 1 }}
            />
          </View>
        </View>
      );
    }
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

    if (this.props.loadingCancel) return <Spinner />;

    return (
      <KeyboardAwareScrollView
        enableOnAndroid
        style={{ flex: 1, alignSelf: 'stretch' }}
        extraScrollHeight={70}
      >
        <Menu
          title="¿Está seguro que desea cancelar el turno?"
          onBackdropPress={() => this.setState({ optionsVisible: false })}
          isVisible={
            this.state.optionsVisible || this.props.loadingReservations
          }
        >
          <MenuItem
            title="Aceptar"
            icon="md-checkmark"
            loadingWithText={this.props.loadingReservations}
            onPress={() => {
              this.setState({ optionsVisible: false });
              this.props.onClientCancelReservation({
                reservationId: id,
                commerceId,
                navigation: this.props.navigation
              });
            }}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Cancelar"
            icon="md-close"
            onPress={() => this.setState({ optionsVisible: false })}
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
        {this.renderCommerceReview()}
        {this.renderCancelButton()}
      </KeyboardAwareScrollView>
    );
  }
}
const mapStateToProps = state => {
  const loadingReservations = state.clientReservationsList.loading;
  const { reservationMinCancelTime } = state.commerceSchedule;
  const loadingCancel = state.commerceSchedule.loading;

  return {
    loadingReservations,
    loadingCancel,
    reservationMinCancelTime
  };
};

export default connect(mapStateToProps, {
  onClientCancelReservation,
  readCancellationTimeAllowed,
  reviewValueChange
})(ClientReservationDetails);
