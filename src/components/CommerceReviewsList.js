import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import { readCommerceReviews } from '../actions';

class CommerceReviewsList extends Component {
  componentDidMount() {
    this.props.readCommerceReviews();
  }

  renderItem = ({ item }) => {
    return <Text>{item.comment}</Text>;
  };

  render() {
    return this.props.loading ? null : (
      <FlatList
        data={this.props.commerceReviews}
        renderItem={this.renderItem}
        keyExtractor={review => review.id}
      />
    );
  }
}

const mapStateToProps = state => {
  const { loading, commerceReviews } = state.commerceReviewsList;
  return { loading, commerceReviews };
};

export default connect(mapStateToProps, { readCommerceReviews })(
  CommerceReviewsList
);
