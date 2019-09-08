import React from 'react';
import { View, Text } from 'react-native';
import { getPermissionLocationStatus } from '../utils';
import { LocationMessages, Button } from './common';

class App extends React.Component {
  state = { permissionStatus: null };

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

  render() {
    if (this.state.permissionStatus) {
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
            onPress={() =>
              this.setState({ location: this.state.location + ' gfdsa' })
            }
          />
          <Text>{this.state.location}</Text>
        </View>
      );
    }
  }
}

export default App;
