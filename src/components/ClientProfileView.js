import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar, Text, Divider, Rating } from 'react-native-elements';
import { MAIN_COLOR } from '../constants';

const avatarSize = Math.round(Dimensions.get('window').width * 0.4);

export default class ClientProfileView extends React.Component {
  constructor(props) {
    super(props);

    const client = props.navigation.getParam('client');

    this.state = { client };
  }

  getRatingValue = () => {
    const { total, count } = this.state.client.rating;
    return total ? total / count : 0;
  };

  renderClientEmail = () => {
    const { email } = this.state.client;
    return email ? <Text style={clientInfoStyle}>{email}</Text> : null;
  };

  renderClientPhone = () => {
    const { phone } = this.state.client;
    return phone ? <Text style={clientInfoStyle}>{phone}</Text> : null;
  };

  render() {
    const { firstName, lastName, profilePicture } = this.state.client;

    return (
      <View style={mainContainerStyle}>
        <Avatar
          rounded
          source={profilePicture ? { uri: profilePicture } : null}
          size={avatarSize}
          icon={{ name: 'person' }}
          containerStyle={avatarStyle}
        />
        <Text h4>{`${firstName} ${lastName}`}</Text>
        <TouchableOpacity>
          <Rating
            style={{ padding: 10 }}
            readonly
            imageSize={24}
            startingValue={this.getRatingValue()}
          />
        </TouchableOpacity>
        <Divider style={dividerStyle} />
        {this.renderClientEmail()}
        {this.renderClientPhone()}
        {/* <Text style={clientInfoStyle}>{email}</Text>
        <Text style={clientInfoStyle}>{phone}</Text> */}
      </View>
    );
  }
}

const {
  mainContainerStyle,
  avatarStyle,
  clientInfoStyle,
  dividerStyle
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
  }
});
