import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {
  Button,
  Menu,
  MenuItem,
  Input,
  CardSection,
  Toast,
  ReviewCard,
  ButtonGroup
} from '../common';
import CourtReservationDetails from '../CourtReservationDetails';
import {
  onCommerceCancelReservation,
  onCourtReservationsListValueChange,
  clientReviewValueChange,
  createClientReview,
  readClientReview,
  updateClientReview,
  deleteClientReview,
  clientReviewClear,
  readCommerceReview,
  commerceReviewClear,
  createCashPayment
} from '../../actions';
import { isOneWeekOld } from '../../utils/functions';

class CommerceCourtReservationDetails extends Component {
  constructor(props) {
    super(props);

    const reservation = props.navigation.getParam('reservation');

    this.state = {
      reservation,
      optionsVisible: false,
      error: '',
      confirmDeleteVisible: false,
      isOneWeekOld: isOneWeekOld(reservation.endDate),
      reviewBGIndex: 0,
      confirmCashPayVisible: false
    };
  }

  componentDidMount() {
    this.props.readClientReview({
      clientId: this.state.reservation.clientId,
      reviewId: this.state.reservation.reviewId
    });

    this.props.readCommerceReview({
      commerceId: this.props.commerceId,
      reviewId: this.state.reservation.receivedReviewId
    });

    if (!this.state.reservation.commerceId)
      this.setState({
        reservation: {
          ...this.state.reservation,
          commerceId: this.props.commerceId
        }
      });
  }

  componentWillUnmount() {
    this.props.clientReviewClear();
    this.props.commerceReviewClear();
  }

  renderCancelButton = () => {
    if (this.state.reservation.startDate > moment()) {
      return (
        <CardSection>
          <Button
            title="Cancelar Reserva"
            onPress={() =>
              this.setState({ optionsVisible: !this.state.optionsVisible })
            }
          />
        </CardSection>
      );
    }
  };

  renderError = () => {
    if (this.props.cancelationReason === '') {
      this.setState({ error: 'Debe informar el motivo' });
      return false;
    } else {
      this.setState({ error: '' });
      return true;
    }
  };

  onBackdropPress = () => {
    this.setState({ optionsVisible: false, error: '' });
    this.props.onCourtReservationsListValueChange({
      prop: 'cancelationReason',
      value: ''
    });
  };

  onConfirmDelete = (id, clientId) => {
    if (this.renderError()) {
      this.setState({ optionsVisible: false });
      this.props.onCommerceCancelReservation({
        commerceId: this.props.commerceId,
        reservationId: id,
        clientId,
        cancelationReason: this.props.cancelationReason,
        navigation: this.props.navigation
      });
    }
  };

  // *** Review Methods ***

  onSaveReviewHandler = () => {
    if (this.props.clientRating === 0) {
      Toast.show({ text: 'Debe primero especificar una calificación.' });
    } else {
      if (this.props.clientReviewId) {
        // Si tenia calificacion actualizarla
        this.props.updateClientReview({
          clientId: this.state.reservation.clientId,
          comment: this.props.clientComment,
          rating: this.props.clientRating,
          reviewId: this.props.clientReviewId
        });
      } else {
        // Si la reserva no tiene calificacion, crearla
        this.props.createClientReview({
          clientId: this.state.reservation.clientId,
          comment: this.props.clientComment,
          rating: this.props.clientRating,
          reservationId: this.state.reservation.id,
          commerceId: this.props.commerceId
        });
      }
    }
  };

  onDeleteReviewHandler = () => {
    this.props.deleteClientReview({
      clientId: this.state.reservation.clientId,
      reviewId: this.props.clientReviewId,
      reservationId: this.state.reservation.id,
      commerceId: this.props.commerceId
    });
    this.setState({ confirmDeleteVisible: false });
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
          onPress={this.onDeleteReviewHandler}
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
          disabled={this.state.isOneWeekOld || !this.props.clientReviewId}
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
    return this.props.commerceRating ? (
      <View style={{ paddingVertical: 10 }}>
        <ReviewCard
          title="Calificación realizada por el cliente"
          rating={this.props.commerceRating}
          commentPlaceholder="El cliente no realizó ningún comentario..."
          commentText={this.props.commerceComment}
          readOnly
          fieldsVisible
        />
      </View>
    ) : (
      <View style={{ paddingVertical: 10 }}>
        <ReviewCard title="El cliente no te ha calificado" />
      </View>
    );
  };

  renderClientReview = () => {
    const title =
      this.state.isOneWeekOld && !this.props.clientRating
        ? 'Ya pasó el período de calificación'
        : 'Calificación de la atención';

    return this.state.isOneWeekOld && !this.props.clientReviewId ? (
      <View style={{ paddingVertical: 10 }}>
        <ReviewCard title="Ya pasó el período de calificación" />
      </View>
    ) : (
      <View style={{ paddingVertical: 10 }}>
        <ReviewCard
          title={title}
          onFinishRating={value =>
            this.props.clientReviewValueChange('rating', value)
          }
          rating={this.props.clientRating}
          readOnly={this.state.isOneWeekOld}
          onChangeText={value =>
            this.props.clientReviewValueChange('comment', value)
          }
          commentPlaceholder="Comente sobre el cliente..."
          commentText={this.props.clientComment}
          fieldsVisible
        />
        {this.renderReviewButtons()}
      </View>
    );
  };

  renderReviewFields = () => {
    if (
      this.state.reservation.clientId &&
      this.state.reservation.startDate < moment()
    ) {
      return (
        <CardSection>
          <ButtonGroup
            onPress={index => this.setState({ reviewBGIndex: index })}
            selectedIndex={this.state.reviewBGIndex}
            buttons={['Calificar al cliente', 'Ver su calificación']}
          />
          {this.state.reviewBGIndex === 0
            ? this.renderClientReview()
            : this.renderCommerceReview()}
          {this.renderConfirmReviewDelete()}
        </CardSection>
      );
    }
  };

  onUserProfilePicturePress = () => {
    const { clientId } = this.state.reservation;
    this.props.navigation.navigate('clientProfileView', { clientId });
  };

  // *** Payment methods ***

  renderRegisterPaymentConfirmation = () => {
    return (
      <Menu
        title="¿Está seguro que desea registrar el pago en efectivo?"
        onBackdropPress={() => this.setState({ confirmCashPayVisible: false })}
        isVisible={this.state.confirmCashPayVisible}
      >
        <MenuItem
          title="Confirmar"
          icon="md-checkmark"
          loadingWithText={this.props.cashPayRegisterLoading}
          onPress={() =>
            this.props.createCashPayment(
              this.state.reservation,
              this.props.navigation
            )
          }
        />
        <Divider style={{ backgroundColor: 'grey' }} />
        <MenuItem
          title="Cerrar"
          icon="md-close"
          onPress={() => this.setState({ confirmCashPayVisible: false })}
        />
      </Menu>
    );
  };

  renderRegisterPaymentButton = () => {
    return (
      <CardSection>
        {this.renderRegisterPaymentConfirmation()}
        {this.state.reservation.paymentDate ? (
          <Button
            title="Ver detalle del pago"
            type="solid"
            onPress={() =>
              this.props.navigation.navigate('paymentDetails', {
                reservation: this.state.reservation
              })
            }
          />
        ) : (
          <Button
            title="Registrar pago en efectivo"
            type="solid"
            onPress={() => this.setState({ confirmCashPayVisible: true })}
          />
        )}
        <Divider
          style={{
            backgroundColor: 'gray',
            marginTop: 10,
            marginHorizontal: 10
          }}
        />
      </CardSection>
    );
  };

  // *** Render method ***

  render() {
    const {
      clientId,
      client,
      court,
      startDate,
      endDate,
      price,
      light,
      id,
      clientName,
      clientPhone
    } = this.state.reservation;

    return (
      <KeyboardAwareScrollView
        enableOnAndroid
        style={scrollViewStyle}
        extraScrollHeight={60}
      >
        <Menu
          title="Informar el motivo de la cancelación"
          onBackdropPress={() => this.onBackdropPress()}
          isVisible={this.state.optionsVisible}
        >
          <View style={{ alignSelf: 'stretch' }}>
            <CardSection
              style={{ padding: 20, paddingLeft: 10, paddingRight: 10 }}
            >
              <Input
                placeholder="Motivo de cancelación..."
                multiline={true}
                color="black"
                onChangeText={value => {
                  this.props.onCourtReservationsListValueChange({
                    prop: 'cancelationReason',
                    value
                  });
                  this.setState({ error: '' });
                }}
                value={this.props.cancelationReason}
                errorMessage={this.state.error}
                onFocus={() => this.setState({ error: '' })}
              />
            </CardSection>
            <Divider style={{ backgroundColor: 'grey' }} />
          </View>
          <MenuItem
            title="Confirmar Cancelación"
            icon="md-checkmark"
            loadingWithText={this.props.loading}
            onPress={() => this.onConfirmDelete(id, clientId)}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Cerrar"
            icon="md-close"
            onPress={() => this.onBackdropPress()}
          />
        </Menu>

        <CourtReservationDetails
          mode={clientId && 'client'}
          name={
            clientId ? `${client.firstName} ${client.lastName}` : clientName
          }
          info={clientId ? client.phone : clientPhone}
          infoIcon="ios-call"
          picture={clientId && client.profilePicture}
          court={court}
          startDate={startDate}
          endDate={endDate}
          price={price}
          light={light}
          showPrice={true}
          onPicturePress={this.onUserProfilePicturePress}
        />
        {this.renderRegisterPaymentButton()}
        {this.renderCancelButton()}
        {this.renderReviewFields()}
      </KeyboardAwareScrollView>
    );
  }
}

const { overlayDividerStyle, scrollViewStyle } = StyleSheet.create({
  overlayDividerStyle: { backgroundColor: 'grey' },
  scrollViewStyle: { flex: 1, alignSelf: 'stretch' }
});

const mapStateToProps = state => {
  const { loading, cancelationReason } = state.courtReservationsList;
  const { commerceId } = state.commerceData;
  const { saveLoading, deleteLoading, dataLoading } = state.clientReviewData;
  const { cashPayRegisterLoading } = state.paymentData;

  return {
    loading,
    commerceId,
    cancelationReason,
    clientRating: state.clientReviewData.rating,
    clientComment: state.clientReviewData.comment,
    clientReviewId: state.clientReviewData.reviewId,
    commerceRating: state.commerceReviewData.rating,
    commerceComment: state.commerceReviewData.comment,
    saveReviewLoading: saveLoading,
    deleteReviewLoading: deleteLoading,
    reviewDataLoading: dataLoading,
    cashPayRegisterLoading
  };
};

export default connect(mapStateToProps, {
  onCommerceCancelReservation,
  onCourtReservationsListValueChange,
  clientReviewValueChange,
  createClientReview,
  readClientReview,
  updateClientReview,
  deleteClientReview,
  clientReviewClear,
  readCommerceReview,
  commerceReviewClear,
  createCashPayment
})(CommerceCourtReservationDetails);
