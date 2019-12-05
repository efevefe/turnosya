import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider, Rating } from 'react-native-elements';
import moment from 'moment';
import { CardSection } from './CardSection';

class ReviewItem extends Component {
  render() {
    return (
      <View>
        <CardSection>
          <View style={topCardContainerStyle}>
            <Rating readonly imageSize={20} startingValue={this.props.rating} />
            <Text>{moment(this.props.date.toDate()).format('ll')}</Text>
          </View>
          {this.props.comment ? (
            <Text style={commentStyle}>{this.props.comment}</Text>
          ) : (
            <Text style={placeholderStyle}>
              Ésta reseña no posee comentarios.
            </Text>
          )}
        </CardSection>
        <Divider />
      </View>
    );
  }
}

const {
  topCardContainerStyle,
  commentStyle,
  placeholderStyle
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
  placeholderStyle: {
    color: 'gray',
    fontSize: 16,
    marginTop: 7,
    marginBottom: 9,
    marginLeft: 10
  }
});

export { ReviewItem };
