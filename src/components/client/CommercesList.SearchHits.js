import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch/connectors';
import { EmptyList, Spinner } from '../common';
import CommerceListItem from './CommerceListItem';

import { connect } from 'react-redux';

class Hits extends Component {
  state = {
    permissionStatus: null,
    modal: true
  };

  // componentDidUpdate() {
  //   this.props;
  //   debugger;
  // }

  componentDidMount() {
    console.log(this.props.hits);
  }

  callback = () => {
    this.setState({ modal: false });
  };

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

export default connect(
  mapStateToProps,
  {}
)(ConnectedHits);
