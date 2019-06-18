import React, { Component } from 'react';
import { Button as RNEButton } from 'react-native-elements';
import { MAIN_COLOR } from '../../constants';

class Button extends Component {
    render () {
        const color = this.props.color || MAIN_COLOR;

        return (
            <RNEButton
                { ...this.props }
                buttonStyle={[ styles.buttonStyle, { backgroundColor: color }, this.props.buttonStyle ]}
                containerStyle={[ styles.containerStyle, this.props.containerStyle ]}
            />
        );
    }
}

const borderRadius = 8;

const styles = {
    buttonStyle: {
        borderRadius,
        padding: 10,
        margin: 8
    },
    containerStyle: {
        borderRadius,
        overflow: 'hidden'
    }
}

export {Button};