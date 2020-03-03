import React from 'react';
import { WebView } from 'react-native-webview';
import { Spinner } from '../components/common';

const Help = () => {
  return (
    <WebView
      source={{ uri: 'https://drive.google.com/file/d/16I8xO_T6QXWLLDZKNU0atAw_Yn59ovIR/view' }}
      style={{ flex: 1 }}
      startInLoadingState={true}
      renderLoading={() => <Spinner />}
      domStorageEnabled={true}
      javaScriptEnabled={true}
      scrollEnabled={false}
      injectedJavaScript={"var header = document.getElementsByClassName('ndfHFb-c4YZDc-Wrql6b')[0]; header.parentNode.removeChild(header)"}
    />
  );
}

export default Help;