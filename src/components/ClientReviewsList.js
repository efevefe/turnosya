import React, { Component } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Divider, Rating } from 'react-native-elements';
import moment from 'moment';
import { CardSection, Spinner, EmptyList } from './common';
import { readClientReviews } from '../actions';

class ClientReviewsList extends Component {
  componentDidMount() {
    const clientId = this.props.navigation.getParam('clientId');
    this.props.readClientReviews(clientId);
  }

  renderItem = ({ item }) => {
    return (
      <View>
        <CardSection>
          <View style={topCardContainerStyle}>
            <Rating readonly imageSize={20} startingValue={item.rating} />
            <Text>{moment(item.date.toDate()).format('ll')}</Text>
          </View>
          {item.comment ? (
            <Text style={commentStyle}>{item.comment}</Text>
          ) : null}
        </CardSection>
        <Divider />
      </View>
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

const { topCardContainerStyle, commentStyle } = StyleSheet.create({
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
  }
});

const mapStateToProps = state => {
  const { loading, clientReviews } = state.clientReviewsList;
  return { loading, clientReviews };
};

export default connect(mapStateToProps, { readClientReviews })(
  ClientReviewsList
);
