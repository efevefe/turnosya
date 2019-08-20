import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

class MenuItem extends Component {
    renderIcon = (color) => {
        // el icono debe ser de ionicons
        if (this.props.icon) {
            if (this.props.loadingWithText) {
                return (
                    <View style={{ width: 25, alignItems: 'center' }} >
                        <ActivityIndicator
                            style={StyleSheet.flatten({ marginVertical: 2 })}
                            color={color}
                            size='small'
                        />
                    </View>
                );
            } else {
                return (
                    <View style={{ width: 25, alignItems: 'center' }} >
                        <Ionicons
                            name={this.props.icon}
                            color={color}
                            size={20}
                        />
                    </View>
                );
            }
        }
    }

    render() {
        const color = this.props.color ? this.props.color : 'black';

        return (
            <Button
                {...this.props}
                type='clear'
                icon={() => this.renderIcon(color)}
                loadingProps={{ color }}
                buttonStyle={[styles.buttonStyle, this.props.buttonStyle]}
                containerStyle={[styles.containerStyle, this.props.containerStyle]}
                titleStyle={[styles.titleStyle, { color }, this.props.titleStyle]}
            />
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        padding: 14,
        paddingLeft: 13,
        paddingRight: 13,
        margin: 0,
        justifyContent: 'flex-start'
    },
    containerStyle: {
        overflow: 'hidden',
        margin: 0
    },
    titleStyle: {
        textAlign: 'left',
        fontSize: 13,
        marginLeft: 13,
        marginRight: 20
    }
});

export { MenuItem };