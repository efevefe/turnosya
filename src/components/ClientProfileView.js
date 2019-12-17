import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar, Text, Divider, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { MAIN_COLOR } from '../constants';
import { onUserRead } from '../actions';
import { Spinner } from './common';

const avatarSize = Math.round(Dimensions.get('window').width * 0.4);

class ClientProfileView extends React.Component {
  constructor(props) {
    super(props);
    const clientId = props.navigation.getParam('clientId');
    this.state = { clientId };
  }

  componentDidMount() {
    this.props.onUserRead(this.state.clientId);
  }

  getRatingValue = () => {
    const { total, count } = this.props.rating;
    return total ? total / count : 0;
  };

  renderClientPhone = () => {
    const { phone } = this.props;
    return phone ? <Text style={clientInfoStyle}>{phone}</Text> : null;
  };

  onReviewButtonPress = () => {
    this.props.navigation.navigate('clientReviewsList', {
      clientId: this.state.clientId
    });
  };

  render() {
    const { firstName, lastName, profilePicture, email } = this.props;

    return this.props.loading ? (
      <Spinner />
    ) : (
      <View style={mainContainerStyle}>
        <Avatar
          rounded
          source={profilePicture ? { uri: profilePicture } : null}
          size={avatarSize}
          icon={{ name: 'person' }}
          containerStyle={avatarStyle}
        />
        <Text h4>{`${firstName} ${lastName}`}</Text>
        <TouchableOpacity onPress={this.onReviewButtonPress}>
          <Rating
            style={ratingStyle}
            readonly
            imageSize={24}
            startingValue={this.getRatingValue()}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onReviewButtonPress}>
          <Ionicons name="md-text" color={MAIN_COLOR} size={30} />
        </TouchableOpacity>
        <Divider style={dividerStyle} />
        <Text style={clientInfoStyle}>{email}</Text>
        {this.renderClientPhone()}
      </View>
    );
  }
}

const {
  mainContainerStyle,
  avatarStyle,
  clientInfoStyle,
  dividerStyle,
  ratingStyle
} = StyleSheet.create({
  mainContainerStyle: {
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  avatarStyle: {
    borderWidth: 4,
    borderColor: MAIN_COLOR,
    marginVertical: 20
  },
  clientInfoStyle: {
    fontSize: 14,
    margin: 5
  },
  dividerStyle: {
    marginHorizontal: 70,
    margin: 10,
    alignSelf: 'stretch',
    backgroundColor: 'grey'
  },
  ratingStyle: { padding: 10 }
});

const mapStateToProps = state => {
  const {
    firstName,
    lastName,
    email,
    phone,
    profilePicture,
    rating,
    loading
  } = state.clientData;

  return { firstName, lastName, email, phone, profilePicture, rating, loading };
};

export default connect(mapStateToProps, { onUserRead })(ClientProfileView);
