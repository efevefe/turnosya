import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  StatusBar
} from 'react-native';
import { Overlay, Divider, Image } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

class PictureView extends Component {
  renderPicture = () => {
    if (this.props.picture === '') return null;

    return (
      <Overlay
        overlayStyle={[styles.overlayStyle, this.props.overlayStyle]}
        onBackdropPress={this.props.onBackdropPress}
        isVisible={this.props.isVisible}
        animationType="fade"
        fullScreen
        overlayBackgroundColor="black"
      >
        <View style={{ flex: 1 }}>
          <TouchableHighlight
            onPress={this.props.onClosePress}
            style={{ alignItems: 'flex-end', marginTop: 20, marginRight: 15 }}
          >
            <Ionicons name="md-close" color={'white'} size={30} />
          </TouchableHighlight>
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <Image
              style={{
                height: this.props.height,
                width: this.props.width
              }}
              source={{ uri: this.props.picture }}
            />
            <StatusBar hidden />
          </View>
        </View>
      </Overlay>
    );
  };

  render() {
    return this.renderPicture();
  }
}

const styles = StyleSheet.create({
  overlayStyle: {
    padding: 0,
    alignItems: 'stretch'
  }
});

export { PictureView };
