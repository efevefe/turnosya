import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

class CommerceCourtStateListItem extends Component {
  state = {
    courtAvailable: true
  };

  componentWillMount() {
    this.courtIsAvailable();
  }

  courtIsAvailable = () => {
    this.setState({
      courtAvailable: !this.props.reservationsOnSlot.find(reservation => reservation.courtId === this.props.court.id)
    })
  };

  render() {
    const {
      name,
      court,
      ground,
      price,
      lightPrice,
      id
    } = this.props.court;
    const { disabled, onPress } = this.props;
    const { courtAvailable } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <ListItem
          containerStyle={
            courtAvailable ? null : { backgroundColor: '#E7E7E7' }
          }
          title={courtAvailable ? name : name + ' - Ocupado'}
          titleStyle={
            courtAvailable
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
                    courtAvailable
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
                    courtAvailable
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
                    courtAvailable
                      ? null
                      : { color: 'grey', fontStyle: 'italic' }
                  }
                >{`Sin luz: $${price}`}</Text>
              )
          }
          key={id}
          subtitle={
            <Text
              style={
                courtAvailable
                  ? { color: 'grey' }
                  : { color: 'grey', fontStyle: 'italic' }
              }
            >{`${court} - ${ground}`}</Text>
          }
          bottomDivider
          onPress={onPress}
          disabled={(disabled && !courtAvailable)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { reservationsOnSlot } = state.courtReservationsList;

  return { reservationsOnSlot };
};

export default connect(
  mapStateToProps,
  null
)(CommerceCourtStateListItem);
