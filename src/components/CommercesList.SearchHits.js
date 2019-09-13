import React, { Component } from 'react';
import { FlatList, View, AppState } from 'react-native';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch/connectors';
import { EmptyList } from './common';
import CommerceListItem from './CommerceListItem';
import { getPermissionLocationStatus, getCurrentPosition } from '../utils';
import { LocationMessages, Button } from './common';

class Hits extends Component {
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

  renderItem({ item }) {
    return <CommerceListItem commerce={item} />;
  }

  render() {
    if (this.state.permissionStatus) {
      return (
        <View>
          <LocationMessages
            permissionStatus={this.state.permissionStatus}
            modal={this.state.modal}
            callback={this.callback}
          />
          {this.props.hits.length > 0 ? (
            <FlatList
              data={this.props.hits}
              renderItem={this.renderItem}
              keyExtractor={item => item.objectID}
              initialNumToRender={20}
            />
          ) : (
            <View style={{ alignSelf: 'center' }}>
              <EmptyList title="No se encontraron negocios" />
            </View>
          )}
        </View>
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

Hits.propTypes = {
  hits: PropTypes.array.isRequired,
  refine: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired
};

const ConnectedHits = connectInfiniteHits(Hits);

export default ConnectedHits;
