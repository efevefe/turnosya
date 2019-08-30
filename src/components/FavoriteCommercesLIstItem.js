import React, { Component } from 'react';
import { ListItem, Button } from 'react-native-elements';
<<<<<<< HEAD
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
    registerFavoriteCommerce,
    deleteFavoriteCommerce,
=======
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  registerFavoriteCommerce,
  deleteFavoritesCommerces,
  readFavoriteCommerce
>>>>>>> 8720d42bc1fb1e8fa7de5bde67f59b0b3556ec28
} from '../actions/CommercesListActions';
import { connect } from 'react-redux';

class FavoriteCommercesListItem extends Component {
<<<<<<< HEAD
    state = { favorite: true };

/*     componentWillMount() {
        this.setState({ favorite: this.props.favoriteCommerces.includes(this.props.commerce.id) });
    } */

    onFavoritePress = (commerceId) => {
        if (this.state.favorite) {
            this.props.deleteFavoriteCommerce(commerceId);
        } else {
            this.props.registerFavoriteCommerce(commerceId);
        }
        this.setState({ favorite: !this.state.favorite });
    };
    renderFavorites = () => {
        const { name, address, profilePicture } = this.props.commerce;
        const areaName = this.props.commerce.area.name;
        if (this.state.favorite) {
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
                />)
        }
=======
  state = { favorite: false };

  componentWillMount() {
    console.log(this.props.favoritesCommerce);
    this.setState({
      favorite: this.props.favoritesCommerce.includes(this.props.commerce.id)
    });
  }

  onFavoritePress = commerceId => {
    if (this.props.favoritesCommerce.includes(commerceId)) {
      this.props.deleteFavoritesCommerces(commerceId);
    } else {
      this.props.registerFavoriteCommerce(commerceId);
>>>>>>> 8720d42bc1fb1e8fa7de5bde67f59b0b3556ec28
    }
    this.setState({ favorite: !this.state.favorite });
  };

<<<<<<< HEAD
    render() {
        return (
            <View>{this.renderFavorites()}</View>
        )
=======
  renderFavorites = () => {
    const { name, address, profilePicture, id } = this.props.commerce;
    const areaName = this.props.commerce.area.name;
    if (this.state.favorite) {
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
              onPress={() => this.onFavoritePress(id)}
            />
          }
          bottomDivider
        />
      );
    } else {
      return <View></View>;
>>>>>>> 8720d42bc1fb1e8fa7de5bde67f59b0b3556ec28
    }
  };

  render() {
    return this.renderFavorites();
  }
}

const mapStateToProps = state => {
<<<<<<< HEAD
    const { favoriteCommerces } = state.commercesList;
    return {
        favoriteCommerces
    };
};

export default connect(
    null,
    
    { registerFavoriteCommerce, deleteFavoriteCommerce}
=======
  const { favoritesCommerce } = state.commercesList;
  return {
    favoritesCommerce
  };
};

export default connect(
  mapStateToProps,
  { registerFavoriteCommerce, deleteFavoritesCommerces, readFavoriteCommerce }
>>>>>>> 8720d42bc1fb1e8fa7de5bde67f59b0b3556ec28
)(FavoriteCommercesListItem);
