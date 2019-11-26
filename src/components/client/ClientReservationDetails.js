import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CourtReservationDetails from '../CourtReservationDetails';
import { connect } from 'react-redux';
import { Divider, AirbnbRating } from 'react-native-elements';
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
  createCommerceReview,
  readCommerceReview,
  updateCommerceReview,
  deleteCommerceReview,
  commerceReviewValueChange,
  commerceReviewClear
} from '../../actions';
import { stringFormatHours } from '../../utils/functions';

class ClientReservationDetails extends Component {
  constructor(props) {
    super(props);

    const reservation = props.navigation.getParam('reservation');
    this.state = {
      reservation,
      optionsVisible: false,
      confirmDeleteVisible: false,
      isOneWeekOld: !moment()
        .subtract(1, 'w')
        .isBefore(reservation.endDate)
    };
  }

  // ** Lifecycle methods **

  componentDidMount() {
    this.props.readCancellationTimeAllowed(
      this.props.navigation.state.params.reservation.commerceId
    );

    this.props.readCommerceReview({
      commerceId: this.state.reservation.commerceId,
      reviewId: this.state.reservation.reviewId
    });
  }

  componentWillUnmount() {
    this.props.commerceReviewClear();
  }

  // ** Cancelation methods **

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
        <View style={cancelButtonContainerStyle}>
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

  // ** Commerce Review methods **

  onSaveReviewHandler = () => {
    if (this.state.reservation.reviewId || this.props.reviewId) {
      // Si tenia calificacion actualizarla
      this.props.updateCommerceReview({
        commerceId: this.state.reservation.commerceId,
        comment: this.props.comment,
        rating: this.props.rating,
        reviewId: this.state.reservation.reviewId || this.props.reviewId
      });
    } else {
      // Si la reserva no tiene calificacion, crearla
      this.props.createCommerceReview({
        commerceId: this.state.reservation.commerceId,
        comment: this.props.comment,
        rating: this.props.rating,
        reservationId: this.state.reservation.id
      });
    }
  };

  onDeleteReviewHandler = () => {
    this.setState({ confirmDeleteVisible: true });
  };

  onDeleteConfirmBackdropPress = () => {
    this.setState({ confirmDeleteVisible: false });
  };

  deleteReview = () => {
    this.setState({
      confirmDeleteVisible: false,
      reservation: { ...this.state.reservation, reviewId: null }
    });
    this.props.deleteCommerceReview({
      commerceId: this.state.reservation.commerceId,
      reservationId: this.state.reservation.id,
      reviewId: this.state.reservation.reviewId || this.props.reviewId
    });
  };

  renderConfirmCommerceDelete = () => {
    return (
      <Menu
        title="¿Esta seguro que desea eliminar su negocio?"
        onBackdropPress={this.onDeleteConfirmBackdropPress}
        isVisible={this.state.confirmDeleteVisible}
      >
        <MenuItem
          title="Confirmar"
          icon="md-checkmark"
          onPress={this.deleteReview}
        />
        <Divider style={overlayDividerStyle} />
        <MenuItem
          title="Cancelar"
          icon="md-close"
          onPress={this.onDeleteConfirmBackdropPress}
        />
      </Menu>
    );
  };

  renderCommerceReview = () => {
    if (this.state.reservation.startDate < moment()) {
      return (
        <View>
          <Divider style={reviewDividerStyle} />
          <CardSection>
            <Text style={reviewTitleStyle}>Calificación de la Atención</Text>
          </CardSection>
          <CardSection>
            <AirbnbRating
              onFinishRating={value =>
                this.props.commerceReviewValueChange('rating', value)
              }
              showRating={false}
              size={25}
              defaultRating={this.props.rating}
              isDisabled={this.state.isOneWeekOld}
            />
          </CardSection>
          <View style={{ marginTop: 10 }}>
            <Input
              onChangeText={value =>
                this.props.commerceReviewValueChange('comment', value)
              }
              editable={true}
              multiline={true}
              maxLength={128}
              maxHeight={180}
              defaultValue={this.props.comment}
              editable={!this.state.isOneWeekOld}
            />
          </View>
          <View style={reviewButtonsContainerStyle}>
            <Button
              title="Borrar"
              type="solid"
              outerContainerStyle={{ flex: 1 }}
              onPress={this.onDeleteReviewHandler}
              loading={this.props.deleteReviewLoading}
              disabled={
                this.state.isOneWeekOld ||
                !(this.state.reservation.reviewId || this.props.reviewId)
              }
            />
            <Button
              title="Guardar"
              type="solid"
              outerContainerStyle={{ flex: 1 }}
              onPress={this.onSaveReviewHandler}
              loading={this.props.saveReviewLoading}
              disabled={this.state.isOneWeekOld}
            />
          </View>
        </View>
      );
    }
  };

  // ** Render method **

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
      <KeyboardAwareScrollView enableOnAndroid style={scrollViewStyle}>
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
          <Divider style={overlayDividerStyle} />
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
        {this.renderConfirmCommerceDelete()}
        {this.renderCancelButton()}
      </KeyboardAwareScrollView>
    );
  }
}

const {
  cancelButtonContainerStyle,
  reviewDividerStyle,
  reviewTitleStyle,
  reviewButtonsContainerStyle,
  overlayDividerStyle,
  scrollViewStyle
} = StyleSheet.create({
  cancelButtonContainerStyle: { flex: 1, justifyContent: 'flex-end' },
  reviewDividerStyle: {
    margin: 10,
    marginLeft: 40,
    marginRight: 40,
    backgroundColor: 'grey'
  },
  reviewTitleStyle: { fontSize: 16, textAlign: 'center' },
  reviewButtonsContainerStyle: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 10
  },
  overlayDividerStyle: { backgroundColor: 'grey' },
  scrollViewStyle: { flex: 1, alignSelf: 'stretch' }
});

const mapStateToProps = state => {
  const loadingReservations = state.clientReservationsList.loading;
  const { reservationMinCancelTime } = state.commerceSchedule;
  const loadingCancel = state.commerceSchedule.loading;
  const {
    rating,
    comment,
    saveLoading,
    deleteLoading,
    reviewId
  } = state.commerceReviewData;

  return {
    loadingReservations,
    loadingCancel,
    reservationMinCancelTime,
    rating,
    comment,
    saveReviewLoading: saveLoading,
    deleteReviewLoading: deleteLoading,
    reviewId
  };
};

export default connect(mapStateToProps, {
  onClientCancelReservation,
  readCancellationTimeAllowed,
  createCommerceReview,
  readCommerceReview,
  updateCommerceReview,
  deleteCommerceReview,
  commerceReviewValueChange,
  commerceReviewClear
})(ClientReservationDetails);
