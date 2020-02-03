import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { Spinner } from '../common';

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);

    const reservation = props.navigation.getParam('reservation', null);
    const mPagoToken = props.navigation.getParam('mPagoToken', null);

    this.state = {
      clientId: this.props.clientId,
      reservation,
      accessToken: mPagoToken,
      loading: true
    };
  }

  handleWebViewNavigationStateChange = newNavState => {
    const { loading } = newNavState;

    if (loading !== this.state.loading) this.setState({ loading });
  };

  render() {
    const {
      accessToken,
      clientId,
      reservation: { id, price, commerceId }
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{
            uri:
              accessToken && clientId && id && price && commerceId
                ? `https://proyecto-turnosya.web.app/pay?access-token=${accessToken}&client-id=${clientId}&reservation-id=${id}&price=${price}&commerce-id=${commerceId}`
                : null
          }}
          renderLoading={() => <Spinner />}
          javaScriptEnabled={true}
          originWhitelist={['*']}
          mixedContentMode={'always'}
          cacheEnabled={false}
          scrollEnabled={true}
          startInLoadingState={true}
          thirdPartyCookiesEnabled={false}
          incognito={true}
          allowUniversalAccessFromFileURLs={true}
          style={this.state.loading ? { flex: 0, height: 0 } : { flex: 1, flexGrow: 1, alignSelf: 'stretch' }}
          onNavigationStateChange={this.handleWebViewNavigationStateChange}
        />
        {this.state.loading ? <Spinner /> : null}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { clientId } = state.clientData;

  return { clientId };
};

export default connect(mapStateToProps, {})(PaymentForm);
