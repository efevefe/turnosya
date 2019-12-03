import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch/connectors';
import { EmptyList, Spinner } from '../common';
import CommerceListItem from './CommerceListItem';
import { commerceHitsUpdate } from '../../actions';
import { withNavigationFocus } from 'react-navigation';

class Hits extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (
      (prevProps.hits !== this.props.hits && this.props.hits.length > 0) ||
      (this.props.isFocused && this.props.isFocused !== prevProps.isFocused)
    ) {
      this.props.commerceHitsUpdate(this.props.hits);
    }
  }

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
        contentContainerStyle={{ paddingBottom: 95 }}
      />
    ) : this.props.searching ? (
      <Spinner style={{ position: 'relative' }} />
    ) : (
      <EmptyList title="No se encontraron negocios" />
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

export default connect(mapStateToProps, { commerceHitsUpdate })(
  withNavigationFocus(ConnectedHits)
);
