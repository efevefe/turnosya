import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import CourtReservationDetails from '../CourtReservationDetails';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import {
  CardSection,
  Button,
  Menu,
  MenuItem,
  Spinner,
  Toast,
  ReviewCard,
  ButtonGroup
} from '../common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {
  onClientCancelReservation,
  onScheduleRead,
  createCommerceReview,
  readCommerceReview,
  updateCommerceReview,
  deleteCommerceReview,
  commerceReviewValueChange,
  commerceReviewClear,
  clientReviewClear,
  readClientReview,
  onCommercePushNotificationTokensRead
} from '../../actions';
import { stringFormatHours, isOneWeekOld } from '../../utils/functions';
import { MONTHS, DAYS } from '../../constants';

class ClientReservationDetails extends Component {
  constructor(props) {
    super(props);
    const reservation = props.navigation.getParam('reservation');
    this.state = {
      reservation,
      optionsVisible: false,
      confirmDeleteVisible: false,
      isOneWeekOld: isOneWeekOld(reservation.endDate),
      reviewBGIndex: 0
    };
  }

  // ** Lifecycle methods **

  componentDidMount() {
    // puse esta misma action para que traiga el tiempi minimo de cancelacion
    this.props.onScheduleRead({
      commerceId: this.state.reservation.commerceId,
      selectedDate: this.state.reservation.startDate
    });

    this.props.readCommerceReview({
      commerceId: this.state.reservation.commerceId,
      reviewId: this.state.reservation.reviewId
    });

    this.props.readClientReview({
      clientId: this.props.clientId,
      reviewId: this.state.reservation.receivedReviewId
    });

    this.props.onCommercePushNotificationTokensRead(
      this.state.reservation.commerceId
    );
  }

  componentWillUnmount() {
    this.props.commerceReviewClear();
    this.props.clientReviewClear();
  }

  // ** Cancelation methods **

  onCancelButtonPress = () => {
    const { reservationMinCancelTime } = this.props;
    const { startDate } = this.state.reservation;
    if (startDate.diff(moment(), 'hours', 'minutes') > reservationMinCancelTime)
      this.setState({ optionsVisible: true });
    else
      Toast.show({
        text:
          'No puede cancelar el turno, el tiempo mínimo permitido es ' +
          stringFormatHours(reservationMinCancelTime)
      });
  };

  renderCancelButton = () => {
    const { startDate } = this.state.reservation;
    if (startDate > moment()) {
      return (
        <CardSection>
          <Button
            title="Cancelar Reserva"
            type="solid"
            onPress={this.onCancelButtonPress}
          />
        </CardSection>
      );
    }
  };

  // ** Commerce Review methods **

  onSaveReviewHandler = () => {
    if (this.props.commerceRating === 0) {
      Toast.show({ text: 'Debe primero especificar una calificación.' });
    } else {
      if (this.props.commerceReviewId) {
        // Si tenia calificacion actualizarla
        this.props.updateCommerceReview({
          commerceId: this.state.reservation.commerceId,
          comment: this.props.commerceComment,
          rating: this.props.commerceRating,
          reviewId: this.props.commerceReviewId
        });
      } else {
        // Si la reserva no tiene calificacion, crearla
        this.props.createCommerceReview({
          commerceId: this.state.reservation.commerceId,
          comment: this.props.commerceComment,
          rating: this.props.commerceRating,
          reservationId: this.state.reservation.id
        });
      }
    }
  };

  onCancelReservationButtonPress = () => {
    const { startDate, id, commerceId } = this.state.reservation;

    const body = `El Turno del día ${DAYS[startDate.day()]} ${startDate.format(
      'D'
    )} de ${MONTHS[moment(startDate).month()]} a las ${moment(startDate).format(
      'HH:mm'
    )} fue cancelado`;
    const title = 'Turno Cancelado';
    notification = { title, body, tokens: this.props.tokens };
    this.setState({ optionsVisible: false });
    this.props.onClientCancelReservation({
      reservationId: id,
      commerceId,
      navigation: this.props.navigation,
      notification
    });
  };

  deleteReview = () => {
    this.setState({
      confirmDeleteVisible: false,
      reservation: { ...this.state.reservation, reviewId: null }
    });
    this.props.deleteCommerceReview({
      commerceId: this.state.reservation.commerceId,
      reservationId: this.state.reservation.id,
      reviewId: this.props.commerceReviewId
    });
  };

  renderConfirmReviewDelete = () => {
    return (
      <Menu
        title="¿Está seguro que desea borrar su reseña?"
        onBackdropPress={() => this.setState({ confirmDeleteVisible: false })}
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
          onPress={() => this.setState({ confirmDeleteVisible: false })}
        />
      </Menu>
    );
  };

  renderReviewButtons = () => {
    return this.state.isOneWeekOld ? null : (
      <CardSection style={{ flexDirection: 'row' }}>
        <Button
          title="Borrar"
          outerContainerStyle={{ flex: 1 }}
          onPress={() => this.setState({ confirmDeleteVisible: true })}
          loading={this.props.deleteReviewLoading}
          disabled={this.state.isOneWeekOld || !this.props.commerceReviewId}
        />
        <Button
          title="Guardar"
          outerContainerStyle={{ flex: 1 }}
          onPress={this.onSaveReviewHandler}
          loading={this.props.saveReviewLoading}
          disabled={this.state.isOneWeekOld}
        />
      </CardSection>
    );
  };

  renderCommerceReview = () => {
    const title =
      this.state.isOneWeekOld && !this.props.commerceRating
        ? 'Ya pasó el período de calificación'
        : 'Calificación de la atención';

    return this.state.isOneWeekOld && !this.props.commerceReviewId ? (
      <View style={{ paddingVertical: 10 }}>
        <ReviewCard title="Ya pasó el período de calificación" />
      </View>
    ) : (
      <View style={{ paddingVertical: 10 }}>
        <ReviewCard
          title={title}
          onFinishRating={value =>
            this.props.commerceReviewValueChange('rating', value)
          }
          rating={this.props.commerceRating}
          readOnly={this.state.isOneWeekOld}
          onChangeText={value =>
            this.props.commerceReviewValueChange('comment', value)
          }
          commentPlaceholder="Deje un comentario sobre la atención..."
          commentText={this.props.commerceComment}
          fieldsVisible
        />
        {this.renderReviewButtons()}
      </View>
    );
  };

  renderClientReview = () => {
    return this.props.clientRating ? (
      <View style={{ paddingVertical: 10 }}>
        <ReviewCard
          title="Calificación realizada por el negocio"
          rating={this.props.clientRating}
          commentPlaceholder="El negocio no realizó ningún comentario..."
          commentText={this.props.clientComment}
          readOnly
          fieldsVisible
        />
      </View>
    ) : (
      <View style={{ paddingVertical: 10 }}>
        <ReviewCard title="El negocio no te ha calificado" />
      </View>
    );
  };

  renderReviewFields = () => {
    if (this.state.reservation.startDate < moment()) {
      return (
        <CardSection>
          <Divider style={reviewDividerStyle} />
          <ButtonGroup
            onPress={index => this.setState({ reviewBGIndex: index })}
            selectedIndex={this.state.reviewBGIndex}
            buttons={['Calificar al negocio', 'Ver su calificación']}
          />
          {this.state.reviewBGIndex === 0
            ? this.renderCommerceReview()
            : this.renderClientReview()}
          {this.renderConfirmReviewDelete()}
        </CardSection>
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
      price
    } = this.state.reservation;

    if (this.props.loadingCancel) return <Spinner />;

    return (
      <KeyboardAwareScrollView
        enableOnAndroid
        style={scrollViewStyle}
        extraScrollHeight={60}
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
            onPress={() => this.onCancelReservationButtonPress()}
          />
          <Divider style={overlayDividerStyle} />
          <MenuItem
            title="Cancelar"
            icon="md-close"
            onPress={() => this.setState({ optionsVisible: false })}
          />
        </Menu>

        <CourtReservationDetails
          mode="commerce"
          name={commerce.name}
          picture={commerce.profilePicture}
          info={
            commerce.address +
            ', ' +
            commerce.city +
            ', ' +
            commerce.province.name
          }
          infoIcon="md-pin"
          court={court}
          startDate={startDate}
          endDate={endDate}
          price={price}
          light={light}
          showPrice={true}
        />

        {this.renderReviewFields()}
        {this.renderCancelButton()}
      </KeyboardAwareScrollView>
    );
  }
}

const {
  reviewDividerStyle,
  overlayDividerStyle,
  scrollViewStyle
} = StyleSheet.create({
  reviewDividerStyle: {
    marginBottom: 10,
    marginHorizontal: 40,
    backgroundColor: 'grey'
  },
  overlayDividerStyle: { backgroundColor: 'grey' },
  scrollViewStyle: { flex: 1, alignSelf: 'stretch' }
});

const mapStateToProps = state => {
  const loadingReservations = state.clientReservationsList.loading;
  const { reservationMinCancelTime } = state.commerceSchedule;
  const loadingCancel = state.commerceSchedule.loading;
  const { saveLoading, deleteLoading } = state.commerceReviewData;
  const { clientId } = state.clientData;
  const { tokens } = state.pushNotification;

  return {
    loadingReservations,
    loadingCancel,
    reservationMinCancelTime,
    saveReviewLoading: saveLoading,
    deleteReviewLoading: deleteLoading,
    commerceRating: state.commerceReviewData.rating,
    commerceComment: state.commerceReviewData.comment,
    commerceReviewId: state.commerceReviewData.reviewId,
    clientRating: state.clientReviewData.rating,
    clientComment: state.clientReviewData.comment,
    clientId,
    tokens
  };
};

export default connect(mapStateToProps, {
  onClientCancelReservation,
  onScheduleRead,
  createCommerceReview,
  readCommerceReview,
  updateCommerceReview,
  deleteCommerceReview,
  commerceReviewValueChange,
  commerceReviewClear,
  clientReviewClear,
  readClientReview,
  onCommercePushNotificationTokensRead
})(ClientReservationDetails);
