import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, CardSection, Toast } from '../../common';
import * as Print from 'expo-print';
import * as MailComposer from 'expo-mail-composer';

class SendReportAsPDF extends Component {
  onPDFSend = () => {
    if (!this.props.html)
      return Toast.show({ text: 'Espere a que el grafico termine de cargar' })

    let options = {
      html: this.props.html,
      height: this.props.horizontal ? 794 : 1123,
      width: this.props.horizontal ? 1123 : 794
    };

    Print.printToFileAsync(options)
      .then(res => {
        MailComposer.composeAsync({
          subject: this.props.mailOptions.subject || '',
          body: this.props.mailOptions.body || '',
          attachments: [res.uri]
        })
        .then(() => Toast.show({ text: 'El reporte se envió correctamente' }))
        .catch(error => Toast.show({ text: 'Falló el envio, intente nuevamente' }));
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