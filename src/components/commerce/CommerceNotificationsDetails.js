import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import { CardSection } from '../common';
import { MAIN_COLOR } from '../../constants';
import { onUserRead, setState } from '../../actions';
import { connect } from 'react-redux';

class CommerceNotificationsDetail extends Component {
  constructor(props) {
    super(props);
    const notification = props.navigation.getParam('notification');
    this.state = {
      notification
    };

    if (notification.type === 'person')
      this.props.onUserRead(notification.sentFor);

    setState(this.props.commerceId, notification.id);
  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('title')
    };
  };

  renderName = () => {
    const { firstName } = this.props;

    if (firstName)
      return (
        <Text h4 style={{ textAlign: 'center', marginHorizontal: 10 }}>
          {firstName}
        </Text>
      );
  };

  renderInfo = () => {
    if (this.state.notification.body) {
      return (
        <CardSection
          style={[
            styles.cardSections,
            { paddingBottom: 5, flexDirection: 'row', justifyContent: 'center' }
          ]}
        >
          <Text style={styles.infoText}>{this.state.notification.body}</Text>
        </CardSection>
      );
    }
  };
  render() {
    const { profilePicture, loading } = this.props;
    const { type, body, title, date } = this.state.notification;

    if (loading) return <Spinner />;

    return (
      <View style={styles.mainContainer}>
        <Avatar
          rounded
          source={profilePicture ? { uri: profilePicture } : null}
          size={90}
          icon={{ firstName: type }}
          containerStyle={styles.avatarStyle}
          onPress={this.props.onPicturePress}
        />
        <View style={styles.contentContainer}>
          <CardSection style={styles.cardSections}>
            {this.renderName()}
            {this.renderInfo()}
          </CardSection>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  avatarStyle: {
    borderWidth: 3,
    borderColor: MAIN_COLOR,
    margin: 12,
    marginBottom: 8
  },
  contentContainer: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start'
  },
  bigText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  mediumText: {
    fontSize: 17
  },
  regularText: {
    fontSize: 14
  },
  infoText: {
    fontSize: 13
  },
  divider: {
    margin: 10,
    marginLeft: 40,
    marginRight: 40,
    backgroundColor: 'grey'
  },
  cardSections: {
    alignItems: 'center'
  }
});

const mapStateToProps = state => {
  const { profilePicture, firstName, lastName } = state.clientData;
  const { commerceId } = state.commerceData;

  return { profilePicture, firstName, lastName, commerceId };
};

export default connect(mapStateToProps, { onUserRead })(
  CommerceNotificationsDetail
);
