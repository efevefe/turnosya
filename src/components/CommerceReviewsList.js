import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Spinner, EmptyList, ReviewItem, Button } from './common';
import { onCommerceReviewsRead } from '../actions';

class CommerceReviewsList extends Component {
  state = { lastVisible: null };

  componentDidMount() {
    const commerceId = this.props.navigation.getParam('commerceId');
    this.props.onCommerceReviewsRead(commerceId);
  }

  componentDidUpdate(prevProps) {
    const { commerceReviews, loading, refreshing } = this.props;

    if (commerceReviews.length && ((prevProps.loading && !loading) || (prevProps.refreshing && !refreshing))) {
      this.setState({ lastVisible: commerceReviews[commerceReviews.length - 1].date.toDate() });
    }
  }

  loadMoreReviews = () => {
    this.props.onCommerceReviewsRead(this.props.navigation.state.params.commerceId, this.state.lastVisible);
  }

  renderFooter = () => {
    if (this.props.moreData)
      return (
        <Button
          title='Cargar más'
          type='clear'
          loading={this.props.refreshing}
          onPress={this.loadMoreReviews}
        />
      );

    return null;
  }

  renderItem = ({ item }) => {
    return <ReviewItem rating={item.rating} date={item.date} comment={item.comment} />;
  };

  render() {
    if (this.props.loading) return <Spinner />;

    if (this.props.commerceReviews && this.props.commerceReviews.length)
      return (
        <FlatList
          data={this.props.commerceReviews}
          renderItem={this.renderItem}
          keyExtractor={review => review.id}
          ListFooterComponent={this.renderFooter()}
          refreshing={this.props.refreshing}
        />
      )

    return <EmptyList title="Parece que no hay reseñas" />
  }
}

const mapStateToProps = state => {
  const { loading, commerceReviews, refreshing, moreData } = state.commerceReviewsList;
  return { loading, commerceReviews, refreshing, moreData };
};

export default connect(mapStateToProps, { onCommerceReviewsRead })(CommerceReviewsList);
