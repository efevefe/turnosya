import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Spinner, EmptyList, ReviewItem, Button } from './common';
import { onClientReviewsRead } from '../actions';

class ClientReviewsList extends Component {
  state = { lastVisible: null };

  componentDidMount() {
    const clientId = this.props.navigation.getParam('clientId');
    this.props.onClientReviewsRead(clientId);
  }

  componentDidUpdate(prevProps) {
    const { clientReviews, loading, refreshing } = this.props;

    if (clientReviews.length && ((prevProps.loading && !loading) || (prevProps.refreshing && !refreshing))) {
      this.setState({ lastVisible: clientReviews[clientReviews.length - 1].date.toDate() });
    }
  }

  loadMoreReviews = () => {
    this.props.onClientReviewsRead(this.props.navigation.state.params.clientId, this.state.lastVisible)
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
      )

    return null;
  }

  renderItem = ({ item }) => {
    return <ReviewItem rating={item.rating} date={item.date} comment={item.comment} />;
  };

  render() {
    if (this.props.loading) return <Spinner />;

    if (this.props.clientReviews && this.props.clientReviews.length)
      return (
        <FlatList
          data={this.props.clientReviews}
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
  const { loading, clientReviews, refreshing, moreData } = state.clientReviewsList;
  return { loading, clientReviews, refreshing, moreData };
};

export default connect(mapStateToProps, { onClientReviewsRead })(ClientReviewsList);
