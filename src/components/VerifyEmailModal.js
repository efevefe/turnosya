import React from 'react';
import firebase from 'firebase';
import { Menu, MenuItem } from '../components/common';

class VerifyEmailModal extends React.Component {
  componentWillMount() {
    this.setState({ isVisible: true });
  }

  onBackdropPress = () => {
    this.setState({ isVisible: false });
    this.props.onModalCloseCallBack();
  };

  onSendEmailPress = () => {
    firebase.auth().currentUser.sendEmailVerification();
    this.props.onModalCloseCallBack();
  };

  render() {
    return (
      <Menu
        title="Lo siento. Deberás validar tu Email Primero"
        onBackdropPress={() => this.onBackdropPress()}
        isVisible={this.state.isVisible}
      >
        <MenuItem
          title="Reenviar"
          icon="md-mail-unread"
          onPress={() => this.onSendEmailPress()}
        />
      </Menu>
    );
  }
}

export default VerifyEmailModal;
