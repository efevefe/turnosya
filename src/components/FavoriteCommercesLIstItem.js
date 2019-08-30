import React, { Component } from 'react';
import { ListItem, Button } from 'react-native-elements';
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
    registerFavoriteCommerce,
    deleteFavoriteCommerce,
} from '../actions/CommercesListActions';
import { connect } from 'react-redux';

class FavoriteCommercesListItem extends Component {
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
    }

    render() {
        return (
            <View>{this.renderFavorites()}</View>
        )
    }
}


const mapStateToProps = state => {
    const { favoriteCommerces } = state.commercesList;
    return {
        favoriteCommerces
    };
};

export default connect(
    null,
    
    { registerFavoriteCommerce, deleteFavoriteCommerce}
)(FavoriteCommercesListItem);
