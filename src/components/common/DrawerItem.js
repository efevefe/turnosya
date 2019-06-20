import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

class DrawerItem extends Component {
    render () {
        return (
            <Button
                { ...this.props }
                type='clear'
                loadingProps={{ color: color }}
                buttonStyle={[ styles.buttonStyle, this.props.buttonStyle ]}
                containerStyle={[ styles.containerStyle, this.props.containerStyle ]}
                titleStyle={[ styles.titleStyle, this.props.titleStyle ]}
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
        color: color
    }
});

export {DrawerItem};