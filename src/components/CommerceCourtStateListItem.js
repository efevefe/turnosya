import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { onCommerceCourtReservationsReadOnSlot } from '../actions';

class CourtListItemOnSlot extends Component {
  state = {
    optionsVisible: false,
    deleteVisible: false,
    courtReservationState: 'Disponible'
  };

  componentWillMount() {
    this.courtsAvailable();
  }

  courtsAvailable = () => {
    for (i in this.props.reservationsOnSlot) {
      this.props.reservationsOnSlot[i].courtId === this.props.court.id
        ? this.setState({ courtReservationState: 'Ocupado' })
        : {};
    }
  };

  render() {
    const { name, court, ground, price, lightPrice, id } = this.props.court;

    return (
      <View style={{ flex: 1 }}>
        <ListItem
          containerStyle={
            this.state.courtReservationState === 'Disponible'
              ? {}
              : { backgroundColor: '#E7E7E7' }
          }
          title={
            this.state.courtReservationState === 'Disponible'
              ? name // + ' - Disponible'
              : name + ' - Ocupado'
          }
          titleStyle={
            this.state.courtReservationState === 'Disponible'
              ? { textAlign: 'left', display: 'flex' }
              : {
                  textAlign: 'left',
                  display: 'flex',
                  color: 'grey',
                  fontStyle: 'italic'
                }
          }
          rightTitle={
            lightPrice !== '' ? (
              <View style={{ justifyContent: 'space-between' }}>
                <Text
                  style={
                    this.state.courtReservationState === 'Disponible'
                      ? { textAlign: 'right', color: 'black' }
                      : {
                          textAlign: 'right',
                          color: 'grey',
                          fontStyle: 'italic'
                        }
                  }
                >{`Sin luz: $${price}`}</Text>
                <Text
                  style={
                    this.state.courtReservationState === 'Disponible'
                      ? { textAlign: 'right', color: 'black' }
                      : {
                          textAlign: 'right',
                          color: 'grey',
                          fontStyle: 'italic'
                        }
                  }
                >{`Con luz: $${lightPrice}`}</Text>
              </View>
            ) : (
              <Text
                style={
                  this.state.courtReservationState === 'Disponible'
                    ? {}
                    : { color: 'grey', fontStyle: 'italic' }
                }
              >{`Sin luz: $${price}`}</Text>
            )
          }
          key={id}
          subtitle={
            <Text
              style={
                this.state.courtReservationState === 'Disponible'
                  ? { color: 'grey' }
                  : { color: 'grey', fontStyle: 'italic' }
              }
            >{`${court} - ${ground}`}</Text>
          }
          bottomDivider
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { reservations, reservationsOnSlot } = state.courtReservationsList;

  return { reservations, reservationsOnSlot };
};

export default connect(
  mapStateToProps,
  {
    onCommerceCourtReservationsReadOnSlot
  }
)(CourtListItemOnSlot);
