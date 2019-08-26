import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch/connectors';
import CommerceListItem from './CommerceListItem';

class Hits extends Component {
  render() {
    const hits =
      this.props.hits.length > 0 ? (
        <FlatList
          data={this.props.hits}
          renderItem={this.renderItem}
          keyExtractor={item => item.objectID}
          initialNumToRender={20}
        />
      ) : null;
    return hits;
  }

  renderItem({ item }) {
    return <CommerceListItem commerce={item} />;
  }
}

Hits.propTypes = {
  hits: PropTypes.array.isRequired,
  refine: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired
};

const ConnectedHits = connectInfiniteHits(Hits);

export default ConnectedHits;
