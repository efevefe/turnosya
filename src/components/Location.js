import React from 'react';
import { connect } from 'react-redux';
import { onLocationChanged } from '../actions';
import { View, AppState, Text } from 'react-native';
import { getPermissionLocationStatus, getCurrentPosition } from '../utils';
import { LocationMessages, Button } from './common';

class App extends React.Component {
  state = {
    permissionStatus: null,
    location: null,
    appState: AppState.currentState,
    modal: true
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  async componentDidMount() {
    const newPermissionLocationStatus = await getPermissionLocationStatus();
    this.setState({ permissionStatus: newPermissionLocationStatus });
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevState.appState !== this.state.appState &&
      this.state.appState === 'active'
    ) {
      const newPermissionLocationStatus = await getPermissionLocationStatus();
      this.setState({
        permissionStatus: newPermissionLocationStatus,
        modal: true
      });
    }
  }

  _handleAppStateChange = nextAppState => {
    this.setState({ appState: nextAppState });
  };

  getLocation = async () => {
    let location = await getCurrentPosition();
    this.setState({ location });
  };

  callback = () => {
    this.setState({ modal: false });
  };

  render() {
    if (this.state.permissionStatus) {
      return (
        <LocationMessages
          permissionStatus={this.state.permissionStatus}
          modal={this.state.modal}
          callback={this.callback}
        />
      );
    } else {
      return (
        <View>
          {/* <Button
            title="Hacer algun cambio en el state"
            onPress={() => this.getLocation()}
          />
          <Text>{JSON.stringify(this.state.location)}</Text> */}
        </View>
      );
    }
  }
}

export default App;
