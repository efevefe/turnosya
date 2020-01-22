import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Button, CardSection } from '../common';
import { WebView } from 'react-native-webview';

class PaymentSettings extends Component {
  handleWebViewNavigationStateChange = newNavState => {
    // newNavState looks something like this:
    // {
    //   url?: string;
    //   title?: string;
    //   loading?: boolean;
    //   canGoBack?: boolean;
    //   canGoForward?: boolean;
    // }
    const { url } = newNavState;
    if (!url) return;

    // handle certain doctypes
    if (url.includes('.pdf')) {
      this.webview.stopLoading();
      // open a modal with the PDF viewer
    }

    // one way to handle a successful form submit is via query strings
    if (url.includes('?message=success')) {
      this.webview.stopLoading();
      // maybe close this view?
    }

    // one way to handle errors is via query string
    if (url.includes('?errors=true')) {
      this.webview.stopLoading();
    }

    // redirect somewhere else
    if (url.includes('google.com')) {
      const newURL = 'https://facebook.github.io/react-native/';
      const redirectTo = 'window.location = "' + newURL + '"';
      this.webview.injectJavaScript(redirectTo);
    }
  };

  render() {
    console.log(this.props.commerceId);
    return (
      <View style={{ flex: 1 }}>
        <View style={{ margin: 15 }}>
          <Text>Usted actualmente tiene que configurar la wea</Text>
        </View>
        <Button title="Configurar Mercado Pago" />
        <WebView
          source={{
            uri: this.props.commerceId
              ? `https://proyecto-turnosya.web.app/commerce-oauth?commerce-id=${this.props.commerceId}`
              : null
          }}
          javaScriptEnabled={true}
          //domStorageEnabled={true} //For the Cache
          originWhitelist={['*']}
          mixedContentMode={'always'}
          useWebKit={Platform.OS == 'ios'}
          // thirdPartyCookiesEnabled={true}
          scrollEnabled={true}
          startInLoadingState={true}
          allowUniversalAccessFromFileURLs={true}
          style={{ flex: 1, flexGrow: 1, alignSelf: 'stretch' }}
          onNavigationStateChange={this.handleWebViewNavigationStateChange}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { commerceId } = state.commerceData;
  return { commerceId };
};

export default connect(mapStateToProps, {})(PaymentSettings);
