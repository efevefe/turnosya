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
  state = { selectedIndex: 1 };

  componentDidMount() {
    this.onReservationsRead();
  }

  componentWillUnmount() {
    this.unsubscribeReservationsRead && this.unsubscribeReservationsRead();
  }

  onReservationsRead = () => {
    this.unsubscribeReservationsRead && this.unsubscribeReservationsRead();
    this.unsubscribeReservationsRead = this.props.onClientReservationsListRead();
  };

  filterLists = () => {
    const pastList = [];
    const nextList = [];

    this.props.reservations.forEach(res => {
      if (res.endDate < moment()) {
        pastList.push(res);
      } else {
        nextList.push(res);
      }
    })

    return [pastList.reverse(), nextList];
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

  render() {
    const filteredLists = this.filterLists();

    return (
      <View style={{ flex: 1 }}>
        <ButtonGroup
          onPress={selectedIndex => this.setState({ selectedIndex })}
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

        {
          this.props.loading ? <Spinner style={{ position: 'relative' }} />
            : filteredLists[this.state.selectedIndex].length ?
              <FlatList
                data={filteredLists[this.state.selectedIndex]}
                renderItem={this.renderRow.bind(this)}
                keyExtractor={reservation => reservation.id}
                refreshControl={this.onRefresh()}
              />
              : <EmptyList title="No tiene reservas" onRefresh={this.onRefresh()} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonGroupStyle: {
    height: 45,
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
