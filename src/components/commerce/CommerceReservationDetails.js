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
  ButtonGroup,
  AreaComponentRenderer
} from '../common';
import CourtReservationDetails from '../CourtReservationDetails';
import ServiceReservationDetails from '../ServiceReservationDetails';
import {
  onCommerceReservationCancel,
  onReservationsListValueChange,
  onClientReviewValueChange,
  onClientReviewCreate,
  onClientReviewReadById,
  onClientReviewUpdate,
  onClientReviewDelete,
  onClientReviewValuesReset,
  onCommerceReviewReadById,
  onCommerceReviewValuesReset,
  onCashPaymentCreate
} from '../../actions';
import { isOneWeekOld } from '../../utils/functions';
import { MONTHS, DAYS } from '../../constants';

class CommerceReservationDetails extends Component {
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
    this.props.onClientReviewReadById({
      clientId: this.state.reservation.clientId,
      reviewId: this.state.reservation.reviewId
    });

    this.props.onCommerceReviewReadById({
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
    this.props.onClientReviewValuesReset();
    this.props.onCommerceReviewValuesReset();
  }

  renderCancelButton = () => {
    if (this.state.reservation.startDate > moment()) {
      return (
        <CardSection>
          <Button
            title="Cancelar Reserva"
            onPress={() => this.setState({ optionsVisible: !this.state.optionsVisible })}
          />
        </CardSection>
      );
    }
  };

  renderError = () => {
    if (this.props.cancellationReason === '') {
      this.setState({ error: 'Debe informar el motivo' });
      return false;
    } else {
      this.setState({ error: '' });
      return true;
    }
  };

  onBackdropPress = () => {
    this.setState({ optionsVisible: false, error: '' });
    this.props.onReservationsListValueChange({ cancellationReason: '' });
  };

  onConfirmDelete = (id, clientId) => {
    if (this.renderError()) {
      this.setState({ optionsVisible: false });

      const { startDate } = this.state.reservation;

      const body = `El Turno del día ${DAYS[startDate.day()]} ${startDate.format('D')} de ${
        MONTHS[moment(startDate).month()]
      } a las ${moment(startDate).format('HH:mm')} fue cancelado. "${this.props.cancellationReason}"`;

      const title = 'Turno Cancelado';

      this.props.onCommerceReservationCancel({
        commerceId: this.props.commerceId,
        reservationId: id,
        clientId,
        cancellationReason: this.props.cancellationReason,
        navigation: this.props.navigation,
        notification: { title, body }
      });
    }
  };

  // *** Review Methods ***

  onSaveReviewHandler = () => {
    if (this.props.clientRating === 0) {
      Toast.show({ text: 'Debe primero especificar una calificación.' });
    } else {
      if (this.props.clientReviewId) {
        // Si tenia calificación actualizarla
        this.props.onClientReviewUpdate({
          clientId: this.state.reservation.clientId,
          comment: this.props.clientComment,
          rating: this.props.clientRating,
          reviewId: this.props.clientReviewId
        });
      } else {
        // Si la reserva no tiene calificación, crearla
        this.props.onClientReviewCreate({
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
    this.props.onClientReviewDelete({
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
        <MenuItem title="Confirmar" icon="md-checkmark" onPress={this.onDeleteReviewHandler} />
        <Divider style={overlayDividerStyle} />
        <MenuItem title="Cancelar" icon="md-close" onPress={() => this.setState({ confirmDeleteVisible: false })} />
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
          onFinishRating={rating => this.props.onClientReviewValueChange({ rating })}
          rating={this.props.clientRating}
          readOnly={this.state.isOneWeekOld}
          onChangeText={comment => this.props.onClientReviewValueChange({ comment })}
          commentPlaceholder="Comente sobre el cliente..."
          commentText={this.props.clientComment}
          fieldsVisible
        />
        {this.renderReviewButtons()}
      </View>
    );
  };

  renderReviewFields = () => {
    if (this.state.reservation.clientId && this.state.reservation.startDate < moment()) {
      return (
        <CardSection>
          <ButtonGroup
            onPress={index => this.setState({ reviewBGIndex: index })}
            selectedIndex={this.state.reviewBGIndex}
            buttons={['Calificar al cliente', 'Ver su calificación']}
          />
          {this.state.reviewBGIndex === 0 ? this.renderClientReview() : this.renderCommerceReview()}
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
          onPress={() => this.props.onCashPaymentCreate(this.state.reservation, this.props.navigation)}
        />
        <Divider style={{ backgroundColor: 'grey' }} />
        <MenuItem title="Cerrar" icon="md-close" onPress={() => this.setState({ confirmCashPayVisible: false })} />
      </Menu>
    );
  };

  renderRegisterPaymentButton = () => {
    return (
      <CardSection>
        {this.renderRegisterPaymentConfirmation()}
        {this.state.reservation.paymentId ? (
          <Button
            title="Ver detalle del pago"
            onPress={() =>
              this.props.navigation.navigate('paymentDetails', {
                reservation: this.state.reservation
              })
            }
          />
        ) : (
          <Button title="Registrar pago en efectivo" onPress={() => this.setState({ confirmCashPayVisible: true })} />
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
      id,
      areaId,
      clientId,
      clientName,
      clientPhone,
      client,
      court,
      service,
      startDate,
      endDate,
      price,
      light
    } = this.state.reservation;

    return (
      <KeyboardAwareScrollView enableOnAndroid style={scrollViewStyle} extraScrollHeight={60}>
        <Menu
          title="Informar el motivo de la cancelación"
          onBackdropPress={() => this.onBackdropPress()}
          isVisible={this.state.optionsVisible || this.props.loading}
        >
          <View style={{ alignSelf: 'stretch' }}>
            <CardSection style={{ padding: 20, paddingLeft: 10, paddingRight: 10 }}>
              <Input
                placeholder="Motivo de cancelación..."
                multiline={true}
                color="black"
                onChangeText={cancellationReason => {
                  this.props.onReservationsListValueChange({
                    cancellationReason
                  });
                  this.setState({ error: '' });
                }}
                value={this.props.cancellationReason}
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
          <MenuItem title="Cerrar" icon="md-close" onPress={() => this.onBackdropPress()} />
        </Menu>

        <AreaComponentRenderer
          area={areaId}
          sports={
            <CourtReservationDetails
              mode={clientId && 'client'}
              name={clientId ? `${client.firstName} ${client.lastName}` : clientName}
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
          }
          hairdressers={
            <ServiceReservationDetails
              mode={clientId && 'client'}
              name={clientId ? `${client.firstName} ${client.lastName}` : clientName}
              info={clientId ? client.phone : clientPhone}
              infoIcon="ios-call"
              picture={clientId && client.profilePicture}
              service={service}
              startDate={startDate}
              endDate={endDate}
              price={price}
              onPicturePress={this.onUserProfilePicturePress}
            />
          }
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
  const { loading, cancellationReason } = state.reservationsList;
  const { commerceId } = state.commerceData;
  const { saveLoading, deleteLoading, dataLoading } = state.clientReviewData;
  const { cashPayRegisterLoading } = state.paymentData;

  return {
    loading,
    commerceId,
    cancellationReason,
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
  onCommerceReservationCancel,
  onReservationsListValueChange,
  onClientReviewValueChange,
  onClientReviewCreate,
  onClientReviewReadById,
  onClientReviewUpdate,
  onClientReviewDelete,
  onClientReviewValuesReset,
  onCommerceReviewReadById,
  onCommerceReviewValuesReset,
  onCashPaymentCreate
})(CommerceReservationDetails);
