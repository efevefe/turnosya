import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Spinner, EmptyList, ReviewItem } from './common';
import { readClientReviews } from '../actions';

class ClientReviewsList extends Component {
  componentDidMount() {
    const clientId = this.props.navigation.getParam('clientId');
    this.props.readClientReviews(clientId);
  }

  renderItem = ({ item }) => {
    return (
      <ReviewItem
        rating={item.rating}
        date={item.date}
        comment={item.comment}
      />
    );
  };

  render() {
    return this.props.loading ? (
      <Spinner />
    ) : this.props.clientReviews && this.props.clientReviews.length > 0 ? (
      <FlatList
        data={this.props.clientReviews}
        renderItem={this.renderItem}
        keyExtractor={review => review.id}
      />
    ) : (
      <EmptyList title="Parece que no hay reseñas" />
    );
  }
}

const mapStateToProps = state => {
  const { loading, clientReviews } = state.clientReviewsList;
  return { loading, clientReviews };
};

export default connect(mapStateToProps, { readClientReviews })(
  ClientReviewsList
);
