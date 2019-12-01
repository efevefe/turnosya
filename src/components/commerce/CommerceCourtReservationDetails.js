import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Divider, AirbnbRating } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {
  Button,
  Menu,
  MenuItem,
  Input,
  CardSection,
  Spinner,
  Toast
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
  clientReviewClear
} from '../../actions';
import { isOneWeekOld } from '../../utils/functions';

class CommerceCourtReservationDetails extends Component {
  // pantalla de detalles del turno (alternativa al modal con los detalles por si tenemos que meter mas funciones u opciones)

  constructor(props) {
    super(props);

    const reservation = props.navigation.getParam('reservation');

    this.state = {
      reservation,
      optionsVisible: false,
      error: '',
      confirmDeleteVisible: false,
      isOneWeekOld: isOneWeekOld(reservation.endDate)
    };
  }

  componentDidMount() {
    this.props.readClientReview({
      clientId: this.state.reservation.clientId,
      reviewId: this.state.reservation.reviewId
    });
  }

  componentWillUnmount() {
    this.props.clientReviewClear();
  }

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
    if (this.props.rating === 0) {
      Toast.show({ text: 'Debe primero especificar una calificación.' });
    } else {
      if (this.props.reviewId) {
        // Si tenia calificacion actualizarla
        this.props.updateClientReview({
          clientId: this.state.reservation.clientId,
          comment: this.props.comment,
          rating: this.props.rating,
          reviewId: this.props.reviewId
        });
      } else {
        // Si la reserva no tiene calificacion, crearla
        this.props.createClientReview({
          clientId: this.state.reservation.clientId,
          comment: this.props.comment,
          rating: this.props.rating,
          reservationId: this.state.reservation.id,
          commerceId: this.props.commerceId
        });
      }
    }
  };

  onDeleteReviewHandler = () => {
    this.props.deleteClientReview({
      clientId: this.state.reservation.clientId,
      reviewId: this.props.reviewId,
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
      <View style={reviewButtonsContainerStyle}>
        <Button
          title="Borrar"
          type="solid"
          outerContainerStyle={{ flex: 1 }}
          onPress={() => this.setState({ confirmDeleteVisible: true })}
          loading={this.props.deleteReviewLoading}
          disabled={this.state.isOneWeekOld || !this.props.reviewId}
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

  renderRatingAndComment = () => {
    return this.state.isOneWeekOld && !this.props.reviewId ? null : (
      <View>
        <CardSection>
          <AirbnbRating
            onFinishRating={value =>
              this.props.clientReviewValueChange('rating', value)
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
              this.props.clientReviewValueChange('comment', value)
            }
            editable={true}
            multiline={true}
            maxLength={128}
            maxHeight={180}
            placeholder="Comente sobre el comportamiento del cliente..."
            defaultValue={this.props.comment}
            editable={!this.state.isOneWeekOld}
          />
        </View>
      </View>
    );
  };

  renderCommerceReview = () => {
    if (this.state.reservation.startDate < moment()) {
      return this.props.reviewDataLoading ? (
        <Spinner />
      ) : (
        <View>
          <Divider style={reviewDividerStyle} />
          <CardSection>
            <Text style={reviewTitleStyle}>
              {this.state.isOneWeekOld
                ? 'Ya pasó el período de calificación'
                : 'Calificación del Cliente'}
            </Text>
          </CardSection>
          {this.renderRatingAndComment()}
          {this.renderReviewButtons()}
        </View>
      );
    }
  };

  // *** Render method ***

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
      <KeyboardAwareScrollView enableOnAndroid style={scrollViewStyle}>
        <CourtReservationDetails
          client={client}
          court={court}
          startDate={startDate}
          endDate={endDate}
          price={price}
          light={light}
          showPrice={true}
          navigation={this.props.navigation}
        />
        <CardSection>{this.renderCancelButton()}</CardSection>

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
                placeholder="Motivos de cancelación..."
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
          <MenuItem
            title="Cerrar"
            icon="md-close"
            onPress={() => this.onBackdropPress()}
          />
        </Menu>
        {this.renderCommerceReview()}
        {this.renderConfirmReviewDelete()}
      </KeyboardAwareScrollView>
    );
  }
}

const {
  reviewDividerStyle,
  reviewTitleStyle,
  reviewButtonsContainerStyle,
  overlayDividerStyle,
  scrollViewStyle
} = StyleSheet.create({
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
  const { loading, cancelationReason } = state.courtReservationsList;
  const { commerceId } = state.commerceData;
  const {
    rating,
    comment,
    reviewId,
    saveLoading,
    deleteLoading,
    dataLoading
  } = state.clientReviewData;

  return {
    loading,
    commerceId,
    cancelationReason,
    rating,
    comment,
    reviewId,
    saveReviewLoading: saveLoading,
    deleteReviewLoading: deleteLoading,
    reviewDataLoading: dataLoading
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
  clientReviewClear
})(CommerceCourtReservationDetails);
