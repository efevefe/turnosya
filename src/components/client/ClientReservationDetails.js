import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CourtReservationDetails from '../CourtReservationDetails';
import { connect } from 'react-redux';
import { Divider, AirbnbRating, ButtonGroup } from 'react-native-elements';
import {
  CardSection,
  Button,
  Menu,
  MenuItem,
  Spinner,
  Toast,
  Input,
  ReviewCard
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
  commerceReviewClear,
  clientReviewClear,
  readClientReview
} from '../../actions';
import { stringFormatHours, isOneWeekOld } from '../../utils/functions';
import { MAIN_COLOR } from '../../constants';

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
    this.props.readCancellationTimeAllowed(
      this.props.navigation.state.params.reservation.commerceId
    );

    this.props.readCommerceReview({
      commerceId: this.state.reservation.commerceId,
      reviewId: this.state.reservation.reviewId
    });

    this.props.readClientReview({
      clientId: this.props.clientId,
      reviewId: this.state.reservation.receivedReviewId
    });
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
        <View style={cancelButtonContainerStyle}>
          <CardSection>
            <Button
              title="Cancelar Reserva"
              type="solid"
              onPress={this.onCancelButtonPress}
            />
          </CardSection>
        </View>
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
      reviewId: this.props.commerceReviewId
    });
  };

  renderConfirmReviewDelete = () => {
    return (
      <Menu
        title="¿Está seguro que desea borrar su reseña?"
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

  renderReviewButtons = () => {
    return this.state.isOneWeekOld ? null : (
      <View style={reviewButtonsContainerStyle}>
        <Button
          title="Borrar"
          type="solid"
          outerContainerStyle={{ flex: 1 }}
          onPress={this.onDeleteReviewHandler}
          loading={this.props.deleteReviewLoading}
          disabled={this.state.isOneWeekOld || !this.props.commerceReviewId}
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
    );
  };

  renderCommerceReview = () => {
    const title =
      this.state.isOneWeekOld && !this.props.commerceRating
        ? 'Ya pasó el período de calificación'
        : 'Calificación de la atención';

    return this.state.isOneWeekOld && !this.props.commerceReviewId ? (
      <View style={{ paddingVertical: 10 }}>
        <ReviewCard title={'Ya pasó el período de calificación'} />
      </View>
    ) : (
      <View style={{ paddingVertical: 10 }}>
        <ReviewCard
          title={title}
          onFinishRating={value =>
            this.props.commerceReviewValueChange('rating', value)
          }
          rating={this.props.commerceRating}
          isDisabled={this.state.isOneWeekOld}
          onChangeText={value =>
            this.props.commerceReviewValueChange('comment', value)
          }
          commentPlaceholder={'Deje un comentario sobre la atención...'}
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
          title={'Calificación realizada por el negocio'}
          rating={this.props.clientRating}
          isDisabled
          commentPlaceholder={'El negocio no realizó ningún comentario...'}
          commentText={this.props.clientComment}
          fieldsVisible
        />
      </View>
    ) : (
      <View style={{ paddingVertical: 10 }}>
        <ReviewCard title={'El negocio no te ha calificado'} />
      </View>
    );
  };

  renderReviewFields = () => {
    if (this.state.reservation.startDate < moment()) {
      return (
        <View>
          <Divider style={reviewDividerStyle} />
          <ButtonGroup
            onPress={index => this.setState({ reviewBGIndex: index })}
            selectedIndex={this.state.reviewBGIndex}
            buttons={['Calificar al negocio', 'Ver su calificación']}
            selectedButtonStyle={{ backgroundColor: MAIN_COLOR }}
            selectedTextStyle={{ color: 'white' }}
            textStyle={locationBGTextStyle}
            containerStyle={locationBGContainerStyle}
            innerBorderStyle={{ color: MAIN_COLOR }}
          />
          {this.state.reviewBGIndex === 0
            ? this.renderCommerceReview()
            : this.renderClientReview()}
          {this.renderConfirmReviewDelete()}
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
        {this.renderReviewFields()}
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
  scrollViewStyle,
  locationBGTextStyle,
  locationBGContainerStyle
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
  scrollViewStyle: { flex: 1, alignSelf: 'stretch' },
  locationBGTextStyle: {
    color: MAIN_COLOR,
    textAlign: 'center',
    fontSize: 12
  },
  locationBGContainerStyle: {
    borderColor: MAIN_COLOR,
    height: 40,
    borderRadius: 8
  }
});

const mapStateToProps = state => {
  const loadingReservations = state.clientReservationsList.loading;
  const { reservationMinCancelTime } = state.commerceSchedule;
  const loadingCancel = state.commerceSchedule.loading;
  const { saveLoading, deleteLoading } = state.commerceReviewData;
  const { clientId } = state.clientData;

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
    clientId
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
  commerceReviewClear,
  clientReviewClear,
  readClientReview
})(ClientReservationDetails);
