import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Spinner, EmptyList, ReviewItem } from './common';
import { onCommerceReviewsRead } from '../actions';

class CommerceReviewsList extends Component {
  componentDidMount() {
    const commerceId = this.props.navigation.getParam('commerceId');
    this.props.onCommerceReviewsRead(commerceId);
  }

  renderItem = ({ item }) => {
    return <ReviewItem rating={item.rating} date={item.date} comment={item.comment} />;
  };

  render() {
    return this.props.loading ? (
      <Spinner />
    ) : this.props.commerceReviews && this.props.commerceReviews.length ? (
      <FlatList data={this.props.commerceReviews} renderItem={this.renderItem} keyExtractor={review => review.id} />
    ) : (
      <EmptyList title="Parece que no hay reseñas" />
    );
  }
}

const mapStateToProps = state => {
  const { loading, commerceReviews } = state.commerceReviewsList;
  return { loading, commerceReviews };
};

export default connect(mapStateToProps, { onCommerceReviewsRead })(CommerceReviewsList);
