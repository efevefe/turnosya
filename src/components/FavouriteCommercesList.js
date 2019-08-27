import React, { Component } from 'react';
import { FlatList, View, Dimensions, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import FavoriteCommercesListItem from './FavoriteCommercesLIstItem';
import {
  commercesRead,
  searchCommerces,
  readFavoriteCommerce
} from '../actions';
import { MAIN_COLOR } from '../constants';

class FavoriteCommercesList extends Component {
  componentWillMount() {
    this.props.readFavoriteCommerce();
    this.props.commercesRead();
  }

  renderRow({ item }) {
    return (
      <FavoriteCommercesListItem
        commerce={item}
        navigation={this.props.navigation}
      />
    );
  }

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.loading}
        onRefresh={() => this.props.commercesRead()}
        colors={[MAIN_COLOR]}
        tintColor={MAIN_COLOR}
      />
    );
  };

  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.commerces}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={commerce => commerce.id}
          refreshControl={this.onRefresh()}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { commerces, loading, searching } = state.commercesList;
  return { commerces, loading, searching };
};

export default connect(
  mapStateToProps,
  { commercesRead, searchCommerces, readFavoriteCommerce }
)(FavoriteCommercesList);
