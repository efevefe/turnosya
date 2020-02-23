import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Badge } from '../common';
import { MAIN_COLOR, SUCCESS_COLOR } from '../../constants';

class CommerceCourtsStateListItem extends Component {
  setCourtBadge = () => {
    if (this.props.disabled) {
      return {
        badgeTitle: 'Deshabilitada',
        badgeColor: 'grey'
      };
    } else {
      return {
        badgeTitle: this.props.courtAvailable ? 'Disponible' : 'Ocupada',
        badgeColor: this.props.courtAvailable ? SUCCESS_COLOR : MAIN_COLOR
      };
    }
  };

  render() {
    const { name, court, ground, price, lightPrice, lightHour, id } = this.props.court;
    const { disabled, onPress, startDate } = this.props;
    const { badgeTitle, badgeColor } = this.setCourtBadge();

    return (
      <View style={{ flex: 1 }}>
        <ListItem
          title={name}
          titleStyle={{ textAlign: 'left', display: 'flex' }}
          rightTitle={`$${lightPrice && lightHour && (lightHour <= startDate.format('HH:mm')) ? lightPrice : price}`}
          rightTitleStyle={{ fontWeight: 'bold', color: 'black' }}
          rightSubtitle={lightPrice && lightHour && (lightHour <= startDate.format('HH:mm')) ? 'Con Luz' : 'Sin Luz'}
          key={id}
          subtitle={
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={{ color: 'grey' }}>{`${court} - ${ground}`}</Text>
              <Badge value={badgeTitle} color={badgeColor} />
            </View>
          }
          bottomDivider
          onPress={onPress}
          disabled={disabled}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { startDate: state.reservation.startDate };
}

export default connect(mapStateToProps, null)(CommerceCourtsStateListItem);
