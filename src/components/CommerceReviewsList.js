import React, { Component } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Divider, Rating } from 'react-native-elements';
import moment from 'moment';
import { CardSection, Spinner, EmptyList } from './common';
import { readCommerceReviews } from '../actions';

class CommerceReviewsList extends Component {
  componentDidMount() {
    const commerceId = this.props.navigation.getParam('commerceId');
    this.props.readCommerceReviews(commerceId);
  }

  renderItem = ({ item }) => {
    return (
      <View>
        <CardSection>
          <View style={topCardContainerStyle}>
            <Rating readonly imageSize={20} startingValue={item.rating} />
            <Text>{moment(item.date.toDate()).format('ll')}</Text>
          </View>
          <Text style={commentStyle}>{item.comment}</Text>
        </CardSection>
        <Divider />
      </View>
    );
  };

  render() {
    return this.props.loading ? (
      <Spinner />
    ) : this.props.commerceReviews.length > 0 ? (
      <FlatList
        data={this.props.commerceReviews}
        renderItem={this.renderItem}
        keyExtractor={review => review.id}
      />
    ) : (
      <EmptyList title="Parece que no hay reseñas" />
    );
  }
}

const {
  topCardContainerStyle,
  commentStyle,
  ratingContainerStyle
} = StyleSheet.create({
  topCardContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
    alignItems: 'center'
  },
  commentStyle: {
    fontSize: 16,
    marginTop: 7,
    marginBottom: 9,
    marginLeft: 10
  },
  ratingContainerStyle: {
    padding: 8
  }
});

const mapStateToProps = state => {
  const { loading, commerceReviews } = state.commerceReviewsList;
  return { loading, commerceReviews };
};

export default connect(mapStateToProps, { readCommerceReviews })(
  CommerceReviewsList
);
