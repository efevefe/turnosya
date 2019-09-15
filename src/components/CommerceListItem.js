import React, { Component } from 'react';
import { ListItem, Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import {
  registerFavoriteCommerce,
  deleteFavoriteCommerce,
  readFavoriteCommerces,
  onCourtReservationValueChange
} from '../actions';

class CommerceListItem extends Component {
  state = { favorite: false };

  componentDidMount() {
    this.setState({
      favorite: this.props.favoriteCommerces.includes(this.props.commerce.objectID)
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.favoriteCommerces !== this.props.favoriteCommerces) {
      this.setState({
        favorite: this.props.favoriteCommerces.includes(this.props.commerce.objectID)
      });
    }
  }

  onFavoritePress = commerceId => {
    if (this.state.favorite) {
      this.props.deleteFavoriteCommerce(commerceId);
    } else {
      this.props.registerFavoriteCommerce(commerceId);
    }
    this.setState({ favorite: !this.state.favorite });
  };

  onCommercePress = () => {
    this.props.onCourtReservationValueChange({
      prop: 'commerce',
      value: this.props.commerce
    })

    this.props.navigation.navigate('commerceCourtTypes');
  }

  render() {
    const { name, address, profilePicture, areaName } = this.props.commerce;

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
            onPress={() => this.onFavoritePress(this.props.commerce.objectID)}
          />
        }
        onPress={this.onCommercePress}
        bottomDivider
      />
    );
  }
}

const mapStateToProps = state => {
  const { favoriteCommerces } = state.commercesList;

  return {
    favoriteCommerces
  };
};

export default withNavigation(connect(
  mapStateToProps,
  { 
    registerFavoriteCommerce, 
    deleteFavoriteCommerce, 
    readFavoriteCommerces,
    onCourtReservationValueChange 
  }
)(CommerceListItem));

