import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

class CommerceCourtStateListItem extends Component {
  state = {
    courtAvailable: true
  };

  componentWillMount() {
    this.courtsAvailable();
  }

  courtsAvailable = () => {
    for (i in this.props.reservationsOnSlot) {
      this.props.reservationsOnSlot[i].courtId === this.props.court.id
        ? this.setState({ courtAvailable: false })
        : null;
    }
  };

  render() {
    const { name, court, ground, price, lightPrice, id } = this.props.court;

    return (
      <View style={{ flex: 1 }}>
        <ListItem
          containerStyle={
            this.state.courtAvailable ? null : { backgroundColor: '#E7E7E7' }
          }
          title={this.state.courtAvailable ? name : name + ' - Ocupado'}
          titleStyle={
            this.state.courtAvailable
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
                    this.state.courtAvailable
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
                    this.state.courtAvailable
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
                  this.state.courtAvailable
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
                this.state.courtAvailable
                  ? { color: 'grey' }
                  : { color: 'grey', fontStyle: 'italic' }
              }
            >{`${court} - ${ground}`}</Text>
          }
          bottomDivider
          onPress={this.props.onPress}
          disabled={!this.state.courtAvailable}
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
  {}
)(CommerceCourtStateListItem);
