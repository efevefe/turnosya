import React, { Component } from 'react';
import { FlatList, View , RefreshControl} from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import CommerceListItem from './CommerceListItem';
import { readOnlyFavoriteCommerces } from '../actions';
import { MAIN_COLOR } from '../constants';

class FavoriteCommercesList extends Component {
  componentWillMount() {
    this.props.readOnlyFavoriteCommerces();
  }

  renderRow({ item }) {
    return (
      <CommerceListItem commerce={item} navigation={this.props.navigation} />
    );
  }

  onRefresh = () => {
    this.props.readOnlyFavoriteCommerces();
  };

  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.onlyFavoriteCommerces}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={commerce => commerce.id}
          extraData={this.props}
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh ={this.onRefresh}
              colors={[MAIN_COLOR]}
              tintColor={MAIN_COLOR}
            />
          }
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { onlyFavoriteCommerces, loading , favoriteCommerces} = state.commercesList;
  return { onlyFavoriteCommerces, loading ,favoriteCommerces};
};

export default connect(
  mapStateToProps,
  {
    readOnlyFavoriteCommerces
  }
)(FavoriteCommercesList);
