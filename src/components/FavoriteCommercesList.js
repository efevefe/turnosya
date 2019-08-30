import React, { Component } from 'react';
import { FlatList, View, Dimensions, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import FavoriteCommercesListItem from './FavoriteCommercesListItem';
import CommerceListItem from './CommerceListItem';
import { readOnlyFavoriteCommerces } from '../actions';

class FavoriteCommercesList extends Component {
  componentWillMount() {
    this.props.readOnlyFavoriteCommerces();
  }

  renderRow({ item }) {
    return (
      <FavoriteCommercesListItem
        commerce={item}
        navigation={this.props.navigation}
      />
    );
  }

  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.onlyFavoriteCommerces}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={commerce => commerce.id}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { onlyFavoriteCommerces, loading, searching } = state.commercesList;
  return { onlyFavoriteCommerces, loading, searching };
};

export default connect(
  mapStateToProps,
  {
    readOnlyFavoriteCommerces
  }
)(FavoriteCommercesList);
