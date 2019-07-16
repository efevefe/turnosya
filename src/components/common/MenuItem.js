import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

class MenuItem extends Component {
    renderIcon = (color) => {
        // el icono debe ser de ionicons
        if (this.props.icon) {
            return (
                <View style={{ width: 25, alignItems: 'center' }} >
                    <Ionicons
                        name={this.props.icon}
                        color={color}
                        size={22}
                    />
                </View>
            );
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
        paddingLeft: 16,
        margin: 0,
        justifyContent: 'flex-start'
    },
    containerStyle: {
        overflow: 'hidden',
        margin: 0
    },
    titleStyle: {
        fontSize: 15,
        paddingLeft: 15
    }
});

export {MenuItem};