import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from '../common';
import { WebView } from 'react-native-webview';
import { onCommerceMPagoTokenRead } from '../../actions';

class PaymentSettings extends Component {
  state = { loading: true };

  handleWebViewNavigationStateChange = newNavState => {
    const { loading, url } = newNavState;

    if (url.includes('https://proyecto-turnosya.web.app/commerce-oauth-redirect'))
      this.props.onCommerceMPagoTokenRead(this.props.commerceId);

    if (loading !== this.state.loading) this.setState({ loading });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{
            uri: this.props.commerceId
              ? `https://proyecto-turnosya.web.app/commerce-oauth?commerce-id=${this.props.commerceId}`
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
  const { commerceId } = state.commerceData;
  return { commerceId };
};

export default connect(mapStateToProps, { onCommerceMPagoTokenRead })(PaymentSettings);
