import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View, RefreshControl } from 'react-native';
import { Divider } from 'react-native-elements';
import { Fab } from 'native-base';
import { HeaderBackButton } from 'react-navigation-stack';
import moment from 'moment';
import { Spinner, IconButton, EmptyList, Menu, MenuItem } from '../common';
import {
  onScheduleValueChange,
  onScheduleCreate,
  onScheduleRead,
  onCommerceLastCourtReservationRead
} from '../../actions';
import { MAIN_COLOR, DAYS, MONTHS } from '../../constants';
import ScheduleRegisterItem from './ScheduleRegisterItem';

class ScheduleRegister extends Component {
  state = { reservationsModalVisible: false };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon'),
      headerLeft: navigation.getParam('leftIcon')
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      rightIcon: this.renderSaveButton(),
      leftIcon: this.renderBackButton()
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lastReservationDate !== this.props.lastReservationDate
      || prevProps.error !== this.props.error) {
      this.setState({ reservationsModalVisible: true });
    }
  }

  renderBackButton = () => {
    return <HeaderBackButton onPress={this.onBackPress} tintColor="white" />;
  };

  renderSaveButton = () => {
    return <IconButton icon="md-checkmark" onPress={this.onSavePress} />;
  };

  onSavePress = () => {
    this.props.onCommerceLastCourtReservationRead();
  }

  onLastReservationValidate = () => {
    const { lastReservationDate } = this.props;
    const date = moment([lastReservationDate.year(), lastReservationDate.month(), lastReservationDate.date(), 0, 0, 0]).add(1, days);

    if (date > moment()) return this.setState({ reservationsModalVisible: true });

    this.onScheduleSave();
  }

  onScheduleSave = () => {
    const {
      cards,
      commerceId,
      reservationMinLength,
      reservationDayPeriod,
      lastReservationDate,
      navigation
    } = this.props;

    this.props.onScheduleUpdate(
      {
        cards,
        commerceId,
        reservationMinLength,
        reservationDayPeriod,
        lastReservationDate
      },
      navigation
    );
  }

  /*
  onSavePress = () => {
    const {
      cards,
      commerceId,
      reservationMinLength,
      reservationDayPeriod,
      navigation
    } = this.props;

    this.props.onScheduleCreate(
      {
        cards,
        commerceId,
        reservationMinLength,
        reservationDayPeriod
      },
      navigation
    );
  };
  */

  onBackPress = () => {
    this.props.navigation.goBack();
    this.props.onScheduleRead(this.props.commerceId);
  };

  onAddPress = () => {
    const { cards, selectedDays, onScheduleValueChange } = this.props;

    if (cards.length === 0) {
      onScheduleValueChange({
        prop: 'cards',
        value: cards.concat([{ ...emptyCard, id: 0 }])
      });
    } else if (
      selectedDays.length < 7 &&
      !this.props.cards.find(card => card.days.length === 0)
    ) {
      onScheduleValueChange({
        prop: 'cards',
        value: cards.concat([
          { ...emptyCard, id: parseInt(cards[cards.length - 1].id) + 1 }
        ])
      });
    }
  };

  renderRow = ({ item }) => {
    return (
      <ScheduleRegisterItem card={item} navigation={this.props.navigation} />
    );
  };

  renderList = () => {
    const { cards, refreshing } = this.props;

    if (cards.length > 0) {
      return (
        <FlatList
          data={cards}
          renderItem={this.renderRow}
          keyExtractor={card => card.id.toString()}
          extraData={this.props}
          contentContainerStyle={{ paddingBottom: 95 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              colors={[MAIN_COLOR]}
              tintColor={MAIN_COLOR}
            />
          }
        />
      );
    }

    return <EmptyList title="No hay horarios de atencion" />;
  };

  render() {
    const { lastReservationDate } = this.props;

    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        {this.renderList()}

        <Menu
          title={
            'La ultima reserva que tienes es el ' +
            `${DAYS[moment(lastReservationDate).day()]} ${moment(lastReservationDate).format('D')} de ${MONTHS[moment(lastReservationDate).month()]}`
            + ', por lo que los nuevos horarios de atencion entraran en vigencia luego de esa fecha. ' +
            '¿Desea confirmar los cambios?'}
          onBackdropPress={() => this.setState({ reservationsModalVisible: false })}
          isVisible={this.state.reservationsModalVisible}
        >
          <MenuItem
            title="Acepar"
            icon="md-checkmark"
            onPress={this.onScheduleSave}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Cancelar"
            icon="md-close"
            onPress={() => this.setState({ reservationsModalVisible: false })}
          />
        </Menu>

        <Fab
          style={{ backgroundColor: MAIN_COLOR }}
          position="bottomRight"
          onPress={() => this.onAddPress()}
        >
          <Ionicons name="md-add" />
        </Fab>
      </View>
    );
  }
}

const emptyCard = {
  firstShiftStart: '',
  firstShiftEnd: '',
  secondShiftStart: null,
  secondShiftEnd: null,
  days: []
};

const mapStateToProps = state => {
  const {
    cards,
    selectedDays,
    reservationMinLength,
    reservationDayPeriod,
    loading,
    refreshing
  } = state.commerceSchedule;
  const { commerceId } = state.commerceData;
  const { lastReservationDate, error } = state.courtReservationsList;

  return {
    cards,
    selectedDays,
    commerceId,
    reservationMinLength,
    reservationDayPeriod,
    loading,
    refreshing,
    lastReservationDate,
    error
  };
};

export default connect(
  mapStateToProps,
  { onScheduleValueChange, onScheduleCreate, onScheduleRead, onCommerceLastCourtReservationRead }
)(ScheduleRegister);
