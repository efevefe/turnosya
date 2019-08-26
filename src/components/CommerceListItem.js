import React, { Component } from 'react';
import _ from 'lodash';
import { ListItem, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  registerFavoriteCommerce,
  deleteFavoritesCommerces,
  readFavoriteCommerce
} from '../actions/CommercesListActions';
import { connect } from 'react-redux';
class CommerceListItem extends Component {
  state = { favorite: false };

  componentWillMount() {
    this.props.favoritesArray.forEach(element => {
      if (element === this.props.commerce.id) {
        this.setState({ favorite: !this.state.favorite });
      }
    });
  }

  onFavoritePress = commerceId => {
    if (this.props.favoritesArray.includes(commerceId)) {
      this.props.deleteFavoritesCommerces(commerceId);
    } else {
      this.props.registerFavoriteCommerce(commerceId);
    }
    this.setState({ favorite: !this.state.favorite });
  };

  render() {
    const { name, address, profilePicture } = this.props.commerce;
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
            onPress={() => this.onFavoritePress(this.props.commerce.id)}
          />
        }
        bottomDivider
      />
    );
  }
}

const mapStateToProps = state => {
  const { favoritesCommerce } = state.commercesList;
  var favoritesArray = _.map(favoritesCommerce, element => {
    return element.id;
  });
  return {
    favoritesArray
  };
};

export default connect(
  mapStateToProps,
  { registerFavoriteCommerce, deleteFavoritesCommerces, readFavoriteCommerce }
)(CommerceListItem);
