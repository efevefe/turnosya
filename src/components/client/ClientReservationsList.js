import React, { Component } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { ListItem, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import { MONTHS, DAYS, MAIN_COLOR, SUCCESS_COLOR } from '../../constants';
import { Spinner, EmptyList, Badge } from '../common';
import { onClientReservationsListRead } from '../../actions';
import moment from 'moment';
import { isOneWeekOld } from '../../utils/functions';

class ClientReservationsList extends Component {
  state = { selectedIndex: 1, filteredList: [] };

  componentDidMount() {
    this.onReservationsRead();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reservations !== this.props.reservations) {
      this.updateIndex(this.state.selectedIndex);
    }
  }

  componentWillUnmount() {
    this.unsubscribeReservationsRead && this.unsubscribeReservationsRead();
  }

  onReservationsRead = () => {
    this.unsubscribeReservationsRead && this.unsubscribeReservationsRead();
    this.unsubscribeReservationsRead = this.props.onClientReservationsListRead();
  };

  updateIndex = selectedIndex => {
    const { reservations } = this.props;
    let filteredList = [];

    if (selectedIndex == 0) {
      // turnos pasados
      filteredList = reservations.filter(res => res.endDate < moment()).reverse();
    } else {
      // turnos proximos
      filteredList = reservations.filter(res => res.startDate > moment());
    }

    this.setState({ filteredList, selectedIndex });
  };

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={() => this.onReservationsRead()}
        colors={[MAIN_COLOR]}
        tintColor={MAIN_COLOR}
      />
    );
  };

  renderRow = ({ item }) => {
    const { commerce, startDate, endDate, price, reviewId, paymentId } = item;

    return (
      <ListItem
        title={commerce.name}
        subtitle={`${DAYS[startDate.day()]} ${startDate.format('D')} de ${
          MONTHS[startDate.month()]
          }\nDe ${startDate.format('HH:mm')} hs. a ${endDate.format('HH:mm')} hs.`}
        rightTitle={`$${price}`}
        rightTitleStyle={styles.listItemRightTitleStyle}
        rightSubtitle={
          <View style={{ alignItems: 'flex-end' }}>
            {item.paymentId ? <Badge value='Pagado' color={SUCCESS_COLOR} /> : null}
            {
              endDate < moment() && !isOneWeekOld(endDate) && !reviewId && paymentId ?
                <Text style={styles.listItemRightSubtitleStyle}>¡Calificá el servicio!</Text> : null
            }
          </View>
        }
        bottomDivider
        onPress={() =>
          this.props.navigation.navigate('reservationDetails', {
            reservation: item
          })
        }
      />
    );
  };

  renderList() {
    const { filteredList } = this.state;

    if (filteredList.length)
      return (
        <FlatList
          data={filteredList}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={reservation => reservation.id}
          refreshControl={this.onRefresh()}
        />
      );

    return <EmptyList title="No tiene reservas" onRefresh={this.onRefresh()} />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={this.state.selectedIndex}
          buttons={['PASADOS', 'PRÓXIMOS']}
          containerBorderRadius={0}
          containerStyle={styles.buttonGroupStyle}
          selectedButtonStyle={{ backgroundColor: 'white' }}
          buttonStyle={{ backgroundColor: MAIN_COLOR }}
          selectedTextStyle={{ color: MAIN_COLOR }}
          textStyle={{ color: 'white' }}
          innerBorderStyle={{ width: 0 }}
        />

        {this.props.loading ? <Spinner style={{ position: 'relative' }} /> : this.renderList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonGroupStyle: {
    height: 40,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 0.5,
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0
  },
  listItemRightTitleStyle: {
    fontWeight: 'bold',
    color: 'black',
    marginRight: 2
  },
  listItemRightSubtitleStyle: {
    color: 'grey',
    fontSize: 11,
    marginRight: 2,
    marginTop: 3
  }
});

const mapStateToProps = state => {
  const { reservations, loading } = state.clientReservationsList;
  return { reservations, loading };
};

export default connect(mapStateToProps, { onClientReservationsListRead })(ClientReservationsList);
