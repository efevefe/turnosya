import React from 'react';
import { View, Text } from 'react-native';
import { getPermissionLocationStatus, getCurrentPosition } from '../utils';
import { LocationMessages, Button } from './common';

class App extends React.Component {
  state = { permissionStatus: null, location: null };

  async componentDidMount() {
    const newPermissionLocationStatus = await getPermissionLocationStatus();
    this.setState({ permissionStatus: newPermissionLocationStatus });
  }

  // async componentDidUpdate(prevProps, prevState) {
  //   const newPermissionLocationStatus = await getPermissionLocationStatus();

  //   if (prevState.permissionStatus !== newPermissionLocationStatus) {
  //     this.setState({ permissionStatus: newPermissionLocationStatus });
  //   }
  // }

  getLocation = async () => {
    let location = await getCurrentPosition();
    this.setState({ location });
  };

  render() {
    if (this.state.permissionStatus !== 'permissionsAllowed') {
      return (
        <View>
          <LocationMessages permissionStatus={this.state.permissionStatus} />
          <Button
            title="Hacer algun cambio en el state"
            onPress={() =>
              this.setState({ location: this.state.location + ' gfdsa' })
            }
          />
          <Text>{this.state.location}</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Button
            title="Hacer algun cambio en el state"
            onPress={() => this.getLocation()}
          />
          <Text>{JSON.stringify(this.state.location)}</Text>
        </View>
      );
    }
  }
}

export default App;
