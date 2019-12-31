import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ListItem, ButtonGroup, Overlay } from 'react-native-elements';
import moment from 'moment';
import { connect } from 'react-redux';
import { Calendar, Spinner, EmptyList } from '../common';
import { onCommerceDetailedCourtReservationsRead } from '../../actions';
import { MAIN_COLOR } from '../../constants';

class CommerceCourtReservations extends Component {
  state = {
    selectedDate: moment(),
    selectedIndex: 1,
    filteredList: [],
    selectedReservation: {},
    detailsVisible: false
  };

  componentDidMount() {
    this.onDateSelected(moment());
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reservations !== this.props.reservations) {
      this.updateIndex(this.state.selectedIndex);
    }
  }

  componentWillUnmount() {
    this.unsubscribeReservationsRead && this.unsubscribeReservationsRead();
  }

  onDateSelected = date => {
    const selectedDate = moment([date.year(), date.month(), date.date()]);

    this.unsubscribeReservationsRead && this.unsubscribeReservationsRead();
    this.unsubscribeReservationsRead = this.props.onCommerceDetailedCourtReservationsRead({
      commerceId: this.props.commerceId,
      selectedDate
    });

    this.setState({ selectedDate });
  }

  updateIndex = selectedIndex => {
    const { reservations } = this.props;
    let filteredList = [];

    if (selectedIndex == 0) {
      // turnos pasados
      filteredList = reservations
        .filter(res => res.endDate < moment())
        .reverse();
    } else if (selectedIndex == 1) {
      // turnos en curso
      filteredList = reservations.filter(
        res => res.startDate <= moment() && res.endDate >= moment()
      );
    } else {
      // turnos proximos
      filteredList = reservations.filter(res => res.startDate > moment());
    }

    this.setState({ filteredList, selectedIndex });
  };

  renderList = ({ item }) => {
    const clientName = item.clientId
      ? `${item.client.firstName} ${item.client.lastName}`
      : item.clientName;

    return (
      <ListItem
        rightIcon={{
          name: 'ios-arrow-forward',
          type: 'ionicon',
          color: 'black'
        }}
        title={`${item.startDate.format('HH:mm')} a ${item.endDate.format(
          'HH:mm'
        )}`}
        subtitle={`${clientName}\n${item.court.name}`}
        rightTitle={`$${item.price}`}
        rightTitleStyle={styles.listItemRightTitleStyle}
        rightSubtitle={item.light ? 'Con Luz' : 'Sin Luz'}
        rightSubtitleStyle={styles.listItemRightSubtitleStyle}
        onPress={() =>
          this.props.navigation.navigate('reservationDetails', {
            reservation: item
          })
        }
        bottomDivider
      />
    );
  };

  renderItems = () => {
    const { filteredList } = this.state;

    if (filteredList.length) {
      return (
        <FlatList
          data={filteredList}
          renderItem={this.renderList.bind(this)}
          keyExtractor={reservation => reservation.id}
        />
      );
    }

    return <EmptyList title="No hay turnos" />;
  };

  render() {
    return (
      <View style={{ alignSelf: 'stretch', flex: 1 }}>
        <Calendar
          onDateSelected={date => this.onDateSelected(date)}
          startingDate={this.state.selectedDate}
        />
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={this.state.selectedIndex}
          buttons={['PASADOS', 'EN CURSO', 'PRÓXIMOS']}
          containerBorderRadius={0}
          containerStyle={styles.buttonGroupContainerStyle}
          selectedButtonStyle={styles.buttonGroupSelectedButtonStyle}
          buttonStyle={styles.buttonGroupButtonStyle}
          textStyle={styles.buttonGroupTextStyle}
          selectedTextStyle={styles.buttonGroupSelectedTextStyle}
          innerBorderStyle={styles.buttonGroupInnerBorderStyle}
        />
        {this.props.loading ? (
          <Spinner style={{ position: 'relative' }} />
        ) : (
            this.renderItems()
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonGroupContainerStyle: {
    height: 40,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 0.5,
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0
  },
  buttonGroupSelectedButtonStyle: {
    backgroundColor: 'white'
  },
  buttonGroupButtonStyle: {
    backgroundColor: MAIN_COLOR
  },
  buttonGroupTextStyle: {
    color: 'white'
  },
  buttonGroupSelectedTextStyle: {
    color: MAIN_COLOR
  },
  buttonGroupInnerBorderStyle: {
    width: 0
  },
  listItemRightTitleStyle: {
    fontWeight: 'bold',
    color: 'black'
  },
  listItemRightSubtitleStyle: {
    color: 'grey'
  }
});

const mapStateToProps = state => {
  const { commerceId } = state.commerceData;
  const { detailedReservations, loading } = state.courtReservationsList;

  return { commerceId, reservations: detailedReservations, loading };
};

export default connect(mapStateToProps, {
  onCommerceDetailedCourtReservationsRead
})(CommerceCourtReservations);
