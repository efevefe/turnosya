import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

class DrawerItem extends Component {
  renderIcon = (color) => {
    // el icono debe ser de ionicons
    if (this.props.icon) {
      return (
        <View style={{ width: 25, alignItems: 'center' }} >
          {
            this.props.loadingWithText ? (
              <ActivityIndicator
                style={StyleSheet.flatten({ marginVertical: 2 })}
                color={color}
                size='small'
              />
            ) : (
                <Ionicons
                  name={this.props.icon}
                  color={color}
                  size={22}
                />
              )
          }

        </View>
      );
    }
  }

  render() {
    return (
      <Button
        {...this.props}
        type='clear'
        icon={() => this.renderIcon(color)}
        loadingProps={{ color: color }}
        buttonStyle={[styles.buttonStyle, this.props.buttonStyle]}
        containerStyle={[styles.containerStyle, this.props.containerStyle]}
        titleStyle={[styles.titleStyle, this.props.titleStyle]}
      />
    );
  }
}

const borderRadius = 0;
const color = 'black';

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius,
    padding: 10,
    paddingLeft: 15,
    margin: 0,
    justifyContent: 'flex-start'
  },
  containerStyle: {
    borderRadius,
    overflow: 'hidden',
    margin: 0
  },
  titleStyle: {
    fontSize: 15,
    color: color,
    paddingLeft: 18
  }
});

export { DrawerItem };