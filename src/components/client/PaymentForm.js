import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { Toast, Spinner } from '../common';

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

  //access-token
  //client-id
  //reservation-id
  //commerce-id

  handleWebViewNavigationStateChange = newNavState => {
    // newNavState looks something like this:
    // {
    //   url?: string;
    //   title?: string;
    //   loading?: boolean;
    //   canGoBack?: boolean;
    //   canGoForward?: boolean;
    // }
    console.log(newNavState);
    const { url, loading } = newNavState;
    if (!url) return;

    if (loading !== this.state.loading) this.setState({ loading });

    if (url.includes('proyecto-turnosya.web.app/payment-success?')) {
      Toast.show({ text: 'Pago registrado con éxito ' });
      this.props.navigation.goBack();
    }
    // // handle certain doctypes
    // if (url.includes('.pdf')) {
    //   this.webview.stopLoading();
    //   // open a modal with the PDF viewer
    // }

    // // one way to handle a successful form submit is via query strings
    // if (url.includes('?message=success')) {
    //   this.webview.stopLoading();
    //   // maybe close this view?
    // }

    // // one way to handle errors is via query string
    // if (url.includes('?errors=true')) {
    //   this.webview.stopLoading();
    // }

    // // redirect somewhere else
    // if (url.includes('google.com')) {
    //   const newURL = 'https://facebook.github.io/react-native/';
    //   const redirectTo = 'window.location = "' + newURL + '"';
    //   this.webview.injectJavaScript(redirectTo);
    // }
  };

  render() {
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
          renderLoading={() => <Spinner />}
          javaScriptEnabled={true}
          //domStorageEnabled={true} //For the Cache
          originWhitelist={['*']}
          mixedContentMode={'always'}
          //useWebKit={Platform.OS == 'ios'}
          cacheEnabled={false}
          scrollEnabled={true}
          startInLoadingState={true}
          allowUniversalAccessFromFileURLs={true}
          style={
            this.state.loading
              ? { flex: 0, height: 0 }
              : { flex: 1, flexGrow: 1, alignSelf: 'stretch' }
          }
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
