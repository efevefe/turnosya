import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View, RefreshControl } from 'react-native';
import { Fab } from 'native-base';
import { Spinner, IconButton, EmptyList } from './common';
import {
  onScheduleValueChange,
  onScheduleCreate,
  onScheduleRead
} from '../actions';
import { MAIN_COLOR } from '../constants';
import ScheduleRegisterItem from './ScheduleRegisterItem';

class ScheduleRegister extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({ rightIcon: this.renderSaveButton() });
    //this.props.onScheduleRead();
  }

  renderSaveButton = () => {
    return (
      <IconButton
        icon="md-checkmark"
        onPress={this.onSavePress}
      />
    );
  };

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
    )
  }

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

  renderAddButton = () => {
    return (
      <Fab
        style={{ backgroundColor: MAIN_COLOR }}
        position="bottomRight"
        onPress={() => this.onAddPress()}
      >
        <Ionicons name="md-add" />
      </Fab>
    );
  }

  renderRow = ({ item }) => {
    return (
      <ScheduleRegisterItem card={item} navigation={this.props.navigation} />
    );
  };

  renderList = () => {
    const { cards, refreshing } = this.props;

    if (this.props.cards.length > 0) {
      return (
        <View style={{ flex: 1 }}>
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
          {this.renderAddButton()}
        </View>
      );
    }

    return (
      <EmptyList title='No hay horarios de atencion.'>
        {this.renderAddButton()}
      </EmptyList>
    );
  }

  render() {
    if (this.props.loading) return <Spinner />;

    return this.renderList();
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
  } = state.scheduleRegister;
  const { commerceId } = state.commerceData;

  return {
    cards,
    selectedDays,
    commerceId,
    reservationMinLength,
    reservationDayPeriod,
    loading,
    refreshing
  };
};

export default connect(
  mapStateToProps,
  { onScheduleValueChange, onScheduleCreate, onScheduleRead }
)(ScheduleRegister);
