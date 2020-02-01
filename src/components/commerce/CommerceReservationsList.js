import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ListItem, ButtonGroup } from 'react-native-elements';
import moment from 'moment';
import { connect } from 'react-redux';
import { Calendar, Spinner, EmptyList, AreaComponentRenderer, PermissionsAssigner } from '../common';
import { onCommerceDetailedReservationsRead } from '../../actions';
import { MAIN_COLOR, AREAS, ROLES } from '../../constants';
import EmployeesFilter from './EmployeesFilter';

class CommerceReservationsList extends Component {
  state = {
    selectedDate: moment(),
    selectedIndex: 1,
    filteredList: [],
    selectedReservation: {},
    detailsVisible: false,
    selectedEmployeeId: this.props.employeeId
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
    this.unsubscribeReservationsRead = this.props.onCommerceDetailedReservationsRead({
      commerceId: this.props.commerceId,
      selectedDate,
      employeeId: this.state.selectedEmployeeId //
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

  onEmployeesFilterValueChange = selectedEmployeeId => {
    if (selectedEmployeeId && selectedEmployeeId !== this.state.selectedEmployeeId) {
      this.setState({ selectedEmployeeId }, () => this.onDateSelected(this.state.selectedDate));
    }
  }

  renderItem = ({ item }) => {
    const clientName = item.clientId
      ? `${item.client.firstName} ${item.client.lastName}`
      : item.clientName;

    let name;
    let service;
    let court;

    if (this.props.areaId === AREAS.hairdressers) {
      service = this.props.services.find(service => service.id === item.serviceId);
      name = service.name;
      // } else if (this.props.areaId === AREAS.sports) { // no anda para reservas viejas que no tenian el areaId
    } else {
      court = this.props.courts.find(court => court.id === item.courtId);
      name = court.name;
    }

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
        subtitle={`${clientName}\n${name}`}
        rightTitle={`$${item.price}`}
        rightTitleStyle={styles.listItemRightTitleStyle}
        rightSubtitle={(item.light !== undefined) ? (item.light ? 'Con Luz' : 'Sin Luz') : null}
        rightSubtitleStyle={styles.listItemRightSubtitleStyle}
        onPress={() =>
          this.props.navigation.navigate('reservationDetails', {
            reservation: { ...item, court, service }
          })
        }
        bottomDivider
      />
    );
  };

  renderList = () => {
    const { filteredList } = this.state;

    if (filteredList.length) {
      return (
        <FlatList
          data={filteredList}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={reservation => reservation.id}
        />
      );
    }

    return <EmptyList title="No hay turnos" />;
  };

  render() {
    return (
      <View style={{ alignSelf: 'stretch', flex: 1 }}>
        <AreaComponentRenderer
          hairdressers={
            <PermissionsAssigner requiredRole={ROLES.ADMIN}>
              <EmployeesFilter onValueChange={this.onEmployeesFilterValueChange} />
            </PermissionsAssigner>
          }
        />

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
            this.renderList()
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
  const { commerceId, area: { areaId } } = state.commerceData;
  const { detailedReservations, loading } = state.reservationsList;
  const { services } = state.servicesList;
  const { courts } = state.courtsList;
  const { selectedEmployeeId } = state.employeesList;
  const employeeId = (areaId === AREAS.hairdressers) ? state.roleData.employeeId : null;

  return { commerceId, areaId, selectedEmployeeId, reservations: detailedReservations, services, courts, loading };
};

export default connect(mapStateToProps, {
  onCommerceDetailedReservationsRead
})(CommerceReservationsList);
