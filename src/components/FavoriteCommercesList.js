import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import CommerceListItem from './CommerceListItem';
import { readOnlyFavoriteCommerces } from '../actions';

class FavoriteCommercesList extends Component {
  componentWillMount() {
    this.props.readOnlyFavoriteCommerces();
  }

  renderRow({ item }) {
    return (
      <CommerceListItem commerce={item} navigation={this.props.navigation} />
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
          extraData={this.props}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { onlyFavoriteCommerces, loading } = state.commercesList;
  return { onlyFavoriteCommerces, loading };
};

export default connect(
  mapStateToProps,
  {
    readOnlyFavoriteCommerces
  }
)(FavoriteCommercesList);
