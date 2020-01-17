import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Button, CardSection } from '../common';
import { WebView } from 'react-native-webview';

class PaymentSettings extends Component {
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
          // onNavigationStateChange={this.onWebViewStateChange}
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
