import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Divider, Overlay } from 'react-native-elements';
import { Button, Spinner, CardSection } from '../common';
import { WebView } from 'react-native-webview';

class PaymentSettings extends Component {
  state = { loading: true, webViewVisible: false };

  handleWebViewNavigationStateChange = newNavState => {
    console.log(newNavState);
    const { loading } = newNavState;

    if (loading !== this.state.loading) this.setState({ loading });
  };

  render() {
    console.log(this.props.commerceId);
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
          //domStorageEnabled={true} //For the Cache
          originWhitelist={['*']}
          mixedContentMode={'always'}
          //useWebKit={Platform.OS == 'ios'}
          cacheEnabled={false}
          scrollEnabled={true}
          startInLoadingState={true}
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

export default connect(mapStateToProps, {})(PaymentSettings);
