import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AirbnbRating } from 'react-native-elements';
import { CardSection, Input } from '../common';
import { MAIN_COLOR } from '../../constants';

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
        <View style={{ marginTop: 10 }}>
          <Input
            onChangeText={this.props.onChangeText}
            multiline={true}
            maxLength={254}
            maxHeight={180}
            placeholder={this.props.commentPlaceholder}
            defaultValue={this.props.commentText}
            editable={!this.props.isDisabled}
          />
        </View>
      </View>
    ) : (
      <View>{this.renderReviewTitle(this.props.title)}</View>
    );
  }
}

const { reviewTitleStyle } = StyleSheet.create({
  reviewTitleStyle: { fontSize: 16, textAlign: 'center' }
});

export { ReviewCard };
