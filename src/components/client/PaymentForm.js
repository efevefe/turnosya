import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);

    const reservation = props.navigation.getParam('reservation', null);
    const mPagoToken = props.navigation.getParam('mPagoToken', null);

    this.state = {
      clientId: this.props.clientId,
      reservation,
      accessToken: mPagoToken
    };
  }

  //access-token
  //client-id
  //reservation-id
  //commerce-id

  render() {
    console.log(this.state);

    const {
      accessToken,
      clientId,
      reservation: { id, price, commerceId }
    } = this.state;
    console.log(
      `https://proyecto-turnosya.web.app/pay?access-token=${accessToken}&client-id=${clientId}&reservation-id=${id}&price=${price}&commerce-id=${commerceId}`
    );

    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{
            uri:
              accessToken && clientId && id && price && commerceId
                ? `https://proyecto-turnosya.web.app/pay?access-token=${accessToken}&client-id=${clientId}&reservation-id=${id}&price=${price}&commerce-id=${commerceId}`
                : null
          }}
          javaScriptEnabled={true}
          //domStorageEnabled={true} //For the Cache
          originWhitelist={['*']}
          mixedContentMode={'always'}
          //useWebKit={Platform.OS == 'ios'}
          cacheEnabled={false}
          scrollEnabled={true}
          startInLoadingState={true}
          allowUniversalAccessFromFileURLs={true}
          style={{ flex: 1, flexGrow: 1, alignSelf: 'stretch' }}
          onNavigationStateChange={e =>
            console.log(
              'Navigation State Change: ' + e.url + ' - ' + e.mainDocumentURL
            )
          }
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { clientId } = state.clientData;

  return { clientId };
};

export default connect(mapStateToProps, {})(PaymentForm);
