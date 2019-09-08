import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch/connectors';
import { EmptyList, Spinner } from './common';
import CommerceListItem from './CommerceListItem';

import { connect } from 'react-redux';

class Hits extends Component {
  renderItem({ item }) {
    return <CommerceListItem commerce={item} />;
  }

  render() {
    return this.props.hits.length > 0 ? (
      <FlatList
        data={this.props.hits}
        renderItem={this.renderItem}
        keyExtractor={item => item.objectID}
        initialNumToRender={20}
      />
    ) : this.props.searching ? (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Spinner />
      </View>
    ) : (
      <View style={{ alignSelf: 'center' }}>
        <EmptyList title="No se encontraron negocios" />
      </View>
    );
  }
}

Hits.propTypes = {
  hits: PropTypes.array.isRequired,
  refine: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  const { searching } = state.commercesList;
  return { searching };
};

const ConnectedHits = connectInfiniteHits(Hits);

export default connect(
  mapStateToProps,
  {}
)(ConnectedHits);
