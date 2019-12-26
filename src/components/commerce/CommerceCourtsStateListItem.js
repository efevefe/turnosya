import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem, Badge } from 'react-native-elements';
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
  }

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
    const { badgeTitle, badgeColor } = this.setCourtBadge();

    return (
      <View style={{ flex: 1 }}>
        <ListItem
          title={name}
          titleStyle={{ textAlign: 'left', display: 'flex' }}
          rightTitle={
            <View style={{ justifyContent: 'flex-start', flex: 1, paddingTop: 2 }}>
              <Text
                style={{
                  textAlign: 'right',
                  lineHeight: 20
                }}
              >
                {
                  lightPrice
                    ? `Sin Luz: $${price}\nCon Luz: $${lightPrice}`
                    : `Sin Luz: $${price}`
                }
              </Text>
            </View>
          }
          key={id}
          subtitle={
            <View style={{ alignItems: 'flex-start' }}>
              <Text
                style={{ color: 'grey' }}
              >
                {`${court} - ${ground}`}
              </Text>
              <Badge
                value={badgeTitle}
                badgeStyle={{
                  height: 25,
                  width: 'auto',
                  borderRadius: 12.5,
                  paddingLeft: 5,
                  paddingRight: 5,
                  backgroundColor: badgeColor
                }}
                containerStyle={{ paddingTop: 3 }}
              />
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

export default CommerceCourtsStateListItem;
