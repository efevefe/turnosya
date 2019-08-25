import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

class CommerceListItem extends Component {
  state = { favorite: false };

  onFavoritePress = () => {
    this.setState({ favorite: !this.state.favorite });
  };

  render() {
    const { name, address, profilePicture, id } = this.props.commerce;
    const areaName = this.props.commerce.area.name;

    return (
      <ListItem
        leftAvatar={{
          source: profilePicture ? { uri: profilePicture } : null,
          icon: { name: 'store', type: 'material' },
          size: 'medium'
        }}
        title={name}
        subtitle={`${areaName}\n${address}`}
        rightIcon={
          <Button
            type="clear"
            containerStyle={{ borderRadius: 15, overflow: 'hidden' }}
            icon={
              <Icon
                name="favorite"
                color={this.state.favorite ? 'red' : '#c4c4c4'}
                size={25}
              />
            }
            buttonStyle={{ padding: 0 }}
            onPress={this.onFavoritePress}
          />
        }
        onPress={() => this.props.navigation.navigate('commerceCourtTypes', { commerceId: id })}
        bottomDivider
      />
    );
  }
}

export default CommerceListItem;
