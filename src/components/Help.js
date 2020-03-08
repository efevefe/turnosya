import React, { Component } from 'react';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { Spinner } from '../components/common';
import { onManualRead } from '../actions';

class Help extends Component {
  componentDidMount() {
    let section = 'guest';

    switch (this.props.navigation.state.routeName) {
      case 'clientHelp':
        section = 'client'
        break;
      case 'commerceHelp':
        section = 'commerce';
        break;
      default:
        break;
    }

    this.props.onManualRead(section);
  }

  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <WebView
        source={{ uri: this.props.manualURL }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        renderLoading={() => <Spinner />}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        scrollEnabled={false}
        injectedJavaScript={
          "var header = document.getElementsByClassName('ndfHFb-c4YZDc-Wrql6b')[0];" +
          "header.parentNode.removeChild(header)"
        }
      />
    );
  }
}

const mapStateToProps = state => {
  return { loading: state.manuals.loading, manualURL: state.manuals.manualURL };
}

export default connect(mapStateToProps, { onManualRead })(Help);