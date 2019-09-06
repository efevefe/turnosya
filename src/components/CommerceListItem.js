import React, { Component } from 'react';
import { ListItem, Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  registerFavoriteCommerce,
  deleteFavoriteCommerce,
  readFavoriteCommerces
} from '../actions/CommercesListActions';
import { connect } from 'react-redux';
class CommerceListItem extends Component {
  state = { favorite: false };

  componentWillMount() {
    console.log(this.props.commerce.objectID)
    this.setState({
      favorite: this.props.favoriteCommerces.includes(this.props.commerce.objectID)
    });
  }

  onFavoritePress = commerceId => {
    if (this.state.favorite) {
      this.props.deleteFavoriteCommerce(commerceId);
    } else {
      this.props.registerFavoriteCommerce(commerceId);
    }
    this.setState({ favorite: !this.state.favorite });
  };

  render() {
    const { name, address, profilePicture, areaName, objectID } = this.props.commerce;

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
        onPress={() =>
          this.props.navigation.navigate('commerceCourtTypes', {
            commerceId: objectID
          })
        }
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
  { registerFavoriteCommerce, deleteFavoriteCommerce, readFavoriteCommerces }
)(CommerceListItem));

