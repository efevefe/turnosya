import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, CardSection } from '../../common';
import * as Print from 'expo-print';
import * as MailComposer from 'expo-mail-composer';

class SendReportAsPDF extends Component {
  onPDFSend = () => {
    let options = {
      html: this.props.html
    };

    Print.printToFileAsync(options)
      .then(res => {
        MailComposer.composeAsync({ attachments: [res.uri] });
      })
      .catch(error => console.error(error));
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.children}
        <CardSection>
          <Button title='Enviar por mail como PDF' onPress={this.onPDFSend} />
        </CardSection>
      </View>
    );
  }
}

export default SendReportAsPDF;