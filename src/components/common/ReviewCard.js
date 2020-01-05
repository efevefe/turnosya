import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AirbnbRating } from 'react-native-elements';
import { CardSection } from './CardSection';
import { Input } from './Input';

class ReviewCard extends Component {
  renderReviewTitle = title => {
    return (
      <CardSection>
        <Text style={reviewTitleStyle}>{title}</Text>
      </CardSection>
    );
  };

  render() {
    return this.props.fieldsVisible ? (
      <View>
        {this.renderReviewTitle(this.props.title)}
        <CardSection>
          <AirbnbRating
            onFinishRating={this.props.onFinishRating}
            showRating={false}
            size={25}
            defaultRating={this.props.rating}
            isDisabled={this.props.isDisabled}
          />
        </CardSection>
        <CardSection>
          {this.props.readOnly ? (
            <Text style={readOnlyReviewStyle}>{this.props.commentText}</Text>
          ) : (
            <Input
              onChangeText={this.props.onChangeText}
              multiline={true}
              maxLength={254}
              maxHeight={180}
              placeholder={this.props.commentPlaceholder}
              defaultValue={this.props.commentText}
            />
          )}
        </CardSection>
      </View>
    ) : (
      <View>{this.renderReviewTitle(this.props.title)}</View>
    );
  }
}

const { reviewTitleStyle, readOnlyReviewStyle } = StyleSheet.create({
  reviewTitleStyle: {
    fontSize: 16,
    textAlign: 'center'
  },
  readOnlyReviewStyle: {
    fontSize: 15,
    textAlign: 'center',
    alignSelf: 'center',
    color: 'grey'
  }
});

export { ReviewCard };
