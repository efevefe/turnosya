import React, { Component } from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { Spinner, EmptyList } from './common';
import CommerceListItem from './CommerceListItem';
import { readOnlyFavoriteCommerces } from '../actions';
import { MAIN_COLOR } from '../constants';

class FavoriteCommercesList extends Component {
  componentDidMount() {
    this.onFavoriteCommercesRead();
  }

  componentWillUnmount() {
    this.unsubscribeFavoritesRead && this.unsubscribeFavoritesRead();
  }

  onFavoriteCommercesRead = () => {
    this.unsubscribeFavoritesRead && this.unsubscribeFavoritesRead();
    this.unsubscribeFavoritesRead = this.props.readOnlyFavoriteCommerces();
  }

  renderRow({ item }) {
    return (
      <CommerceListItem commerce={item} navigation={this.props.navigation} />
    );
  }

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={() => this.onFavoriteCommercesRead()}
        colors={[MAIN_COLOR]}
        tintColor={MAIN_COLOR}
      />
    );
  };

  render() {
    const { onlyFavoriteCommerces, loading } = this.props;

    if (loading) return <Spinner />;

    if (onlyFavoriteCommerces.length > 0) {
      return (
        <FlatList
          data={onlyFavoriteCommerces}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={commerce => commerce.objectID}
          refreshControl={this.onRefresh()}
        />
      );
    }

    return (
      <EmptyList
        title='No tenes favoritos'
        onRefresh={this.onRefresh()}
      />
    );
  }
}

const mapStateToProps = state => {
  const { onlyFavoriteCommerces, loading, favoriteCommerces } = state.commercesList;
  return { onlyFavoriteCommerces, loading, favoriteCommerces };
};

export default connect(
  mapStateToProps,
  {
    readOnlyFavoriteCommerces
  }
)(FavoriteCommercesList);
