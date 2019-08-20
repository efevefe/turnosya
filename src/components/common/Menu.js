import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Overlay, Divider } from 'react-native-elements';

class Menu extends Component {
  renderTitle = () => {
    if (this.props.title) {
      return (
        <View>
          <View style={styles.titleContainerStyle}>
            <Text style={styles.titleStyle}>{this.props.title}</Text>
          </View>
          <Divider style={styles.dividerStyle} />
        </View>
      );
    }
  };

  render() {
    return (
      <Overlay
        height="auto"
        overlayStyle={[styles.overlayStyle, this.props.overlayStyle]}
        onBackdropPress={this.props.onBackdropPress}
        isVisible={this.props.isVisible}
        animationType="fade"
      >
        <View>
          {this.renderTitle()}
          {this.props.children}
        </View>
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  overlayStyle: {
    padding: 0,
    borderRadius: 8
  },
  titleContainerStyle: {
    alignSelf: 'stretch',
    alignItems: 'flex-start'
  },
  titleStyle: {
    color: 'black',
    fontSize: 15,
    margin: 16,
    marginLeft: 18
  },
  dividerStyle: {
    backgroundColor: 'grey'
  }
});

export { Menu };
