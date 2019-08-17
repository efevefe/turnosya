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
    const { name, address, profilePicture } = this.props.commerce;
    const areaName = this.props.commerce.area.name;

    return (
      <View>
        <ListItem
          leftAvatar={{
            source: profilePicture ? { uri: profilePicture } : null,
            size: 'medium'
          }}
          title={name}
          subtitle={`${areaName}\n${address}`}
          rightIcon={
            <Button
              type="clear"
              containerStyle={{ borderRadius: 15, overflow: 'hidden' }}
              icon={
                this.state.favorite ? (
                  <Icon name="favorite" color="red" size={25} />
                ) : (
                  <Icon name="favorite" color="rgb(242, 242, 242)" size={25} />
                )
              }
              buttonStyle={{ padding: 0 }}
              onPress={this.onFavoritePress}
            />
          }
          bottomDivider
        />
      </View>
    );
  }
}

export default CommerceListItem;
