import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Overlay, Image } from 'react-native-elements';
import { IconButton } from './IconButton';

const PictureView = props => {
  renderPicture = () => {
    if (!props.picture) return null;

    return (
      <Overlay
        overlayStyle={[styles.overlayStyle, props.overlayStyle]}
        onBackdropPress={props.onBackdropPress}
        isVisible={props.isVisible}
        animationType="fade"
        fullScreen
        overlayBackgroundColor="black"
      >
        <View style={styles.mainContainerStyle}>
          <IconButton icon="md-close" containerStyle={styles.iconButtonContainerStyle} onPress={props.onClosePress} />
          <View style={styles.imageContainerStyle}>
            <Image
              style={{
                height: props.height,
                width: props.width
              }}
              source={{ uri: props.picture }}
            />
          </View>
        </View>
      </Overlay>
    );
  };

  return renderPicture();
};

const styles = StyleSheet.create({
  overlayStyle: {
    padding: 0,
    alignItems: 'stretch'
  },
  mainContainerStyle: {
    flex: 1,
    alignItems: 'flex-end'
  },
  iconButtonContainerStyle: {
    padding: 10,
    marginTop: 15
  },
  imageContainerStyle: {
    justifyContent: 'center',
    flex: 1
  }
});

export { PictureView };
